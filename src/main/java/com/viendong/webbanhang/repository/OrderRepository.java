package com.viendong.webbanhang.repository;

import com.viendong.webbanhang.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("SELECT COUNT(o) FROM Order o")
    long countOrders();

    @Query(value = "SELECT * FROM orders ORDER BY order_date DESC LIMIT 5", nativeQuery = true)
    List<Order> findTop5ByOrderByOrderDateDesc();

    List<Order> findByAccountId(Long accountId);
}
