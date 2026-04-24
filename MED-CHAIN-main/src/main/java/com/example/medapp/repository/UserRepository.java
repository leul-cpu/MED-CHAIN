package com.example.medapp.repository;


import com.example.medapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * Repository interface for User authentication.
 * JpaRepository handles all the heavy lifting for database communication.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Used by Spring Security during login to find the user by their username.
     */
    Optional<User> findByUsername(String username);
}
