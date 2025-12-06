package com.mobylab.springbackend.controller;

import com.mobylab.springbackend.entity.BankAccount;
import com.mobylab.springbackend.service.BankingService;
import com.mobylab.springbackend.service.dto.CreateAccountDto;
import com.mobylab.springbackend.service.dto.TransactionRequestDto;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/bank")
public class BankingController {

    private final BankingService bankingService;

    public BankingController(BankingService bankingService) {
        this.bankingService = bankingService;
    }

    @PostMapping("/accounts")
    public ResponseEntity<BankAccount> createAccount(@RequestBody CreateAccountDto dto, Authentication authentication) {
        return ResponseEntity.ok(bankingService.createAccount(authentication.getName(), dto));
    }

    @GetMapping("/accounts")
    public ResponseEntity<List<BankAccount>> getUserAccounts(Authentication authentication) {
        return ResponseEntity.ok(bankingService.getUserAccounts(authentication.getName()));
    }

    @PostMapping("/transfer")
    public ResponseEntity<?> transfer(@RequestBody TransactionRequestDto dto, Authentication authentication) {
        bankingService.transfer(authentication.getName(), dto);
        return ResponseEntity.ok("Transfer successful");
    }

    @GetMapping("/accounts/{accountId}/transactions")
    public ResponseEntity<?> getTransactions(@PathVariable Long accountId, Authentication authentication) {
        return ResponseEntity.ok(bankingService.getAccountTransactions(authentication.getName(), accountId));
    }

    @PostMapping("/accounts/{accountId}/statement")
    public ResponseEntity<?> sendStatement(@PathVariable Long accountId, Authentication authentication) {
        bankingService.sendStatement(authentication.getName(), accountId);
        return ResponseEntity.ok("Statement sent successfully");
    }
}
