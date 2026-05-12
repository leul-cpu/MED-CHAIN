package com.leul.medapp.util;


import com.leul.medapp.model.User;
import com.leul.medapp.repository.UserRepository;
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
            createUser("admin", "admin", "ADMIN");
            createUser("doctor", "doctor", "DOCTOR");
            createUser("patient", "patient", "PATIENT");
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
