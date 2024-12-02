package com.viendong.webbanhang.repository;

import com.viendong.webbanhang.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);

    Optional<User> findByEmail(String email);

    @Query("SELECT COUNT(u) FROM User u")
    long countUsers();
}
