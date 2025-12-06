package com.mobylab.springbackend.config.security;

import com.mobylab.springbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<com.mobylab.springbackend.entity.User> optionalUser = userRepository.findUserByEmail(email);
        if (optionalUser.isPresent()) {
            com.mobylab.springbackend.entity.User user = optionalUser.get();
            return new User(user.getEmail(), user.getPassword(), java.util.Collections.emptyList());
        } else
            throw new UsernameNotFoundException("User not found");
    }
}
