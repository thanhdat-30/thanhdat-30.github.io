package com.viendong.webbanhang.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.text.DecimalFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long accountId;

    private String customerName;
    private String productName;
    private int quantity;

    @CreationTimestamp
    @Column(name = "order_date", updatable = false)
    private LocalDateTime orderDate;

    private String email;
    private String phone;

    private String paymentMethod;
    private String shippingAddress;
    private String note;
    private double totalAmount;

    private String trangthai;

    public void setCartItems(List<CartItem> cartItems) {
    }

    public String getFormattedPrice() {
        DecimalFormat formatter = new DecimalFormat("#,###");
        return formatter.format(this.totalAmount) + " ₫";
    }

    public String getFormattedOrderDate() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        return this.orderDate.format(formatter);
    }
}