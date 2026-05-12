package com.leul.medapp;



import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Bean;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.leul.medapp.model.User;
import com.leul.medapp.repository.UserRepository;

import java.awt.*;
import java.net.URI;

@SpringBootApplication
public class MedappApplication {

	public static void main(String[] args) {
		new SpringApplicationBuilder(MedappApplication.class).headless(false).run(args);
	}

	@Bean
	CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			if (userRepository.findByUsername("admin").isEmpty()) {
				User admin = new User();
				admin.setUsername("admin");
				admin.setPassword(passwordEncoder.encode("admin"));
				admin.setRole("ADMIN");
				userRepository.save(admin);
				System.out.println("Created default user: admin");
			}
			
			if (userRepository.findByUsername("doctor").isEmpty()) {
				User doctor = new User();
				doctor.setUsername("doctor");
				doctor.setPassword(passwordEncoder.encode("doctor"));
				doctor.setRole("DOCTOR");
				userRepository.save(doctor);
				System.out.println("Created default user: doctor");
			}
			
			if (userRepository.findByUsername("patient").isEmpty()) {
				User patient = new User();
				patient.setUsername("patient");
				patient.setPassword(passwordEncoder.encode("patient"));
				patient.setRole("PATIENT");
				userRepository.save(patient);
				System.out.println("Created default user: patient");
			}
		};
	}

	// This listener waits until the server is fully "Ready"
	@EventListener(ApplicationReadyEvent.class)
	public void launchBrowser() {
		try {
			if (Desktop.isDesktopSupported()) {
				Desktop desktop = Desktop.getDesktop();
				desktop.browse(new URI("http://localhost:8080"));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}