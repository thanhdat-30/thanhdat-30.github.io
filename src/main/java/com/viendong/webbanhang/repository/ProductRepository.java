package com.viendong.webbanhang.repository;

import com.viendong.webbanhang.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findTop5ByOrderByCreatedAtDesc();

    List<Product> findByNameContainingIgnoreCase(String name);

    @Query("SELECT COUNT(p) FROM Product p")
    long countProducts();

    List<Product> findAllByOrderByCreatedAtDesc();
}
