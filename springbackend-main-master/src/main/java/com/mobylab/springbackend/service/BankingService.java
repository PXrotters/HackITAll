package com.mobylab.springbackend.service;

import com.mobylab.springbackend.entity.BankAccount;
import com.mobylab.springbackend.entity.Transaction;
import com.mobylab.springbackend.entity.User;
import com.mobylab.springbackend.exception.BadRequestException;
import com.mobylab.springbackend.repository.BankAccountRepository;
import com.mobylab.springbackend.repository.TransactionRepository;
import com.mobylab.springbackend.repository.UserRepository;
import com.mobylab.springbackend.entity.Category;
import com.mobylab.springbackend.repository.CategoryRepository;
import com.mobylab.springbackend.service.dto.CreateAccountDto;
import com.mobylab.springbackend.service.dto.TransactionRequestDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class BankingService {

        private final BankAccountRepository bankAccountRepository;
        private final TransactionRepository transactionRepository;
        private final UserRepository userRepository;
        private final CategoryRepository categoryRepository;

        public BankingService(BankAccountRepository bankAccountRepository, TransactionRepository transactionRepository,
                        UserRepository userRepository, CategoryRepository categoryRepository) {
                this.bankAccountRepository = bankAccountRepository;
                this.transactionRepository = transactionRepository;
                this.userRepository = userRepository;
                this.categoryRepository = categoryRepository;
        }

        public BankAccount createAccount(String userEmail, CreateAccountDto dto) {
                User user = userRepository.findUserByEmail(userEmail)
                                .orElseThrow(() -> new BadRequestException("User not found"));

                String iban = "RO" + UUID.randomUUID().toString().substring(0, 10).toUpperCase(); // Simple IBAN
                                                                                                  // generation

                BankAccount account = new BankAccount()
                                .setUser(user)
                                .setIban(iban)
                                .setCurrency(dto.getCurrency())
                                .setName(dto.getName())
                                .setBalance(new BigDecimal("1000"));

                return bankAccountRepository.save(account);
        }

        public List<BankAccount> getUserAccounts(String userEmail) {
                User user = userRepository.findUserByEmail(userEmail)
                                .orElseThrow(() -> new BadRequestException("User not found"));
                return bankAccountRepository.findAllByUserId(user.getId());
        }

        public List<Transaction> getAccountTransactions(String userEmail, Long accountId) {
                User user = userRepository.findUserByEmail(userEmail)
                                .orElseThrow(() -> new BadRequestException("User not found"));

                BankAccount account = bankAccountRepository.findById(accountId)
                                .orElseThrow(() -> new BadRequestException("Account not found"));

                if (!account.getUser().getId().equals(user.getId())) {
                        throw new BadRequestException("Not your account");
                }

                return transactionRepository.findAllByAccountIdOrderByCreatedAtDesc(accountId);
        }

        public void transfer(String userEmail, TransactionRequestDto dto) {
                User user = userRepository.findUserByEmail(userEmail)
                                .orElseThrow(() -> new BadRequestException("User not found"));

                BankAccount source = bankAccountRepository.findById(dto.getSourceAccountId())
                                .orElseThrow(() -> new BadRequestException("Source account not found"));

                if (!source.getUser().getId().equals(user.getId())) {
                        throw new BadRequestException("Not your account");
                }

                if (source.getBalance().compareTo(dto.getAmount()) < 0) {
                        throw new BadRequestException("Insufficient funds");
                }

                BankAccount destination = bankAccountRepository.findByIban(dto.getDestinationIban())
                                .orElseThrow(() -> new BadRequestException("Destination account not found"));

                BigDecimal convertedAmount = convert(dto.getAmount(), source.getCurrency(), destination.getCurrency());

                // Debit Source
                source.setBalance(source.getBalance().subtract(dto.getAmount()));
                bankAccountRepository.save(source);

                // Credit Destination
                destination.setBalance(destination.getBalance().add(convertedAmount));
                bankAccountRepository.save(destination);

                // Record Transaction (Debit)
                Category category = null;
                if (dto.getCategory() != null && !dto.getCategory().trim().isEmpty()) {
                        String catName = dto.getCategory().trim();
                        category = categoryRepository.findByNameAndUser(catName, user)
                                        .orElseGet(() -> {
                                                Category newCat = new Category()
                                                                .setName(catName)
                                                                .setType("EXPENSE")
                                                                .setUser(user);
                                                return categoryRepository.save(newCat);
                                        });
                }

                Transaction debitTx = new Transaction()
                                .setAccount(source)
                                .setType("DEBIT")
                                .setAmount(dto.getAmount())
                                .setCategory(category)
                                .setDescription("Transfer to " + dto.getDestinationIban() + " ("
                                                + destination.getCurrency() + "): " + dto.getDescription())
                                .setTransactionDate(LocalDateTime.now());
                transactionRepository.save(debitTx);

                // Record Transaction (Credit)
                Category creditCategory = null;
                if (dto.getCategory() != null && !dto.getCategory().trim().isEmpty()) {
                        String catName = dto.getCategory().trim();
                        User receiverUser = destination.getUser();
                        creditCategory = categoryRepository.findByNameAndUser(catName, receiverUser)
                                        .orElseGet(() -> {
                                                Category newCat = new Category()
                                                                .setName(catName)
                                                                .setType("INCOME")
                                                                .setUser(receiverUser);
                                                return categoryRepository.save(newCat);
                                        });
                }

                Transaction creditTx = new Transaction()
                                .setAccount(destination)
                                .setType("CREDIT")
                                .setAmount(convertedAmount)
                                .setCategory(creditCategory)
                                .setDescription("Transfer from " + source.getIban() + " (" + source.getCurrency()
                                                + "): " + dto.getDescription())
                                .setTransactionDate(LocalDateTime.now());
                transactionRepository.save(creditTx);
        }

        private BigDecimal convert(BigDecimal amount, String fromCurrency, String toCurrency) {
                if (fromCurrency.equals(toCurrency)) {
                        return amount;
                }
                BigDecimal rateFrom = getRateToRon(fromCurrency);
                BigDecimal rateTo = getRateToRon(toCurrency);

                // Formula: (Amount * RateFrom) / RateTo
                // Use RoundingMode.HALF_UP for currency
                return amount.multiply(rateFrom).divide(rateTo, 2, java.math.RoundingMode.HALF_UP);
        }

        private BigDecimal getRateToRon(String currency) {
                switch (currency) {
                        case "EUR":
                                return new BigDecimal("5.0");
                        case "USD":
                                return new BigDecimal("4.5");
                        case "RON":
                                return BigDecimal.ONE;
                        default:
                                throw new BadRequestException("Unknown currency: " + currency);
                }
        }
}
