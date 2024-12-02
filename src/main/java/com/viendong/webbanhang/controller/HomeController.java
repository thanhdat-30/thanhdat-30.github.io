package com.viendong.webbanhang.controller;

import com.viendong.webbanhang.service.CartService;
import com.viendong.webbanhang.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/home")
public class HomeController {
    @Autowired
    private CartService cartService;

    @Autowired
    private ProductService productService;

    @GetMapping
    public String showHome(Model model) {
        model.addAttribute("products", productService.getProductNew());
        model.addAttribute("totalQuantity", cartService.getTotalQuantity());
        return "/home";
    }

    @PostMapping("/subscribe")
    public ResponseEntity<String> subscribe(@RequestParam String email) {
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("Email không hợp lệ.");
        }

        try {
            productService.sendSubscribeEmail(email);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Có lỗi xảy ra khi gửi email.");
        }

        return ResponseEntity.ok("Đăng ký thành công!");
    }
}