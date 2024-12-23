package com.viendong.webbanhang.service;

import com.viendong.webbanhang.model.CartItem;
import com.viendong.webbanhang.model.Order;
import com.viendong.webbanhang.model.OrderDetail;
import com.viendong.webbanhang.model.User;
import com.viendong.webbanhang.repository.OrderDetailRepository;
import com.viendong.webbanhang.repository.OrderRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import java.util.HashMap;
import java.util.Map;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {
    @Autowired
    private UserService userService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private CartService cartService;
    public List<Order> getRecentOrders() {
        return orderRepository.findTop5ByOrderByOrderDateDesc();
    }

    public long getTotalOrders() {
        return orderRepository.count();
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

public Order updateOrder(Order orderDetails) {
    Optional<Order> optionalOrder = orderRepository.findById(orderDetails.getId());
    if (optionalOrder.isPresent()) {
        Order order = optionalOrder.get();
        order.setTrangthai(orderDetails.getTrangthai());
        return orderRepository.save(order);
    } else {
        throw new RuntimeException("Order not found with id " + orderDetails.getId());
    }
}

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    public Order createOrder(String customerName, String email, String paymentMethod, String shippingAddress,
            String note, String phone, List<CartItem> cartItems) {

        User accountId = userService.getCurrentUser();

        Order order = new Order();
        order.setAccountId(accountId.getId());
        order.setCustomerName(customerName);
        order.setEmail(email);
        order.setPaymentMethod(paymentMethod);
        order.setShippingAddress(shippingAddress);
        order.setNote(note);
        order.setPhone(phone);
        order.setTrangthai("Chưa xử lý");

        List<String> productNames = cartItems.stream()
                .map(item -> item.getProduct().getName())
                .toList();

        List<String> productSize = cartItems.stream()
                .map(item -> item.getSize())
                .toList();

        order.setQuantity(cartItems.stream().mapToInt(CartItem::getQuantity).sum());

        order.setProductName(String.valueOf(productNames));

        order.setSize(String.valueOf(productSize));

        int totalAmount = cartItems.stream()
                .mapToInt(item -> (int) (item.getProduct().getPrice() * item.getQuantity()))
                .sum();

        order.setTotalAmount(totalAmount);

        order = orderRepository.save(order);

        for (CartItem item : cartItems) {
            OrderDetail detail = new OrderDetail();
            detail.setOrder(order);
            detail.setProduct(item.getProduct());
            detail.setQuantity(item.getQuantity());
            orderDetailRepository.save(detail);
        }
        return order;
    }

    public Order cartOrder(String customerName, String email, String paymentMethod, String shippingAddress, String note,
            String phone, List<CartItem> cartItems) {
        return null;
    }

    public void sendOrderConfirmationEmail(String email, String customerName, String orderId, String orderDate,
            String totalAmount) {
        Map<String, Object> variables = new HashMap<>();
        variables.put("customerName", customerName);
        variables.put("orderId", orderId);
        variables.put("orderDate", orderDate);
        variables.put("totalAmount", totalAmount);
        variables.put("cartItems", cartService.getCartItems());

        try {
            emailService.sendHtmlEmail(
                    email,
                    "Cảm Ơn Bạn Đã Đặt Hàng",
                    "mail/order-confirmation",
                    variables);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }

    public List<Order> getAccountIdOrders() {
        Long accountId = userService.getCurrentUser().getId();

        return orderRepository.findByAccountId(accountId);
    }
}
