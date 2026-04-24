package com.example.medapp.util;


import com.example.medapp.model.User;
import com.example.medapp.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            createUser("admin", "admin123", "ADMIN");
            createUser("doctor", "doc123", "DOCTOR");
            createUser("nurse", "nurse123", "NURSE");
        }
    }

    private void createUser(String u, String p, String r) {
        User user = new User();
        user.setUsername(u);
        user.setPassword(passwordEncoder.encode(p));
        user.setRole(r);
        userRepository.save(user);
    }
}
