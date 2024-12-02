package com.viendong.webbanhang.controller;

import com.viendong.webbanhang.model.CartItem;
import com.viendong.webbanhang.model.Order;
import com.viendong.webbanhang.service.CartService;
import com.viendong.webbanhang.service.EmailService;
import com.viendong.webbanhang.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Controller
@RequestMapping("/order")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private CartService cartService;

    @Autowired
    private EmailService emailService;

    @GetMapping("/checkout")
    public String checkout(Model model) {
        model.addAttribute("totalQuantity", cartService.getTotalQuantity());
        return "cart/checkout";
    }

    @PostMapping("/submit")
    public String submitOrder(String customerName, String email, String paymentMethod,
                              String shippingAddress, String note, String phone) {
        List<CartItem> cartItems = cartService.getCartItems();
        if (cartItems.isEmpty()) {
            return "redirect:/cart";
        }

        Order order = orderService.createOrder(customerName, email, paymentMethod, shippingAddress, note, phone,
                cartItems);

        String orderId = String.valueOf(order.getId());
        String orderDate = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        String totalAmount = String.valueOf(cartService.formattedCartTotal());

        orderService.sendOrderConfirmationEmail(email, customerName, orderId, orderDate, totalAmount);

        return "redirect:/order/confirmation";
    }

    @GetMapping("/confirmation")
    public String orderConfirmation(Model model) {
        cartService.clearCart();
        model.addAttribute("cartTotal", orderService.getAllOrders());
        model.addAttribute("totalQuantity", cartService.getTotalQuantity());
        return "/cart/order-confirmation";
    }
}
