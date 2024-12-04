package com.viendong.webbanhang.controller;

import com.viendong.webbanhang.service.CartService;
import com.viendong.webbanhang.service.OrderService;
import com.viendong.webbanhang.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/profile")
public class ProfileController {
    @Autowired
    private UserService userService;

    @Autowired
    private CartService cartService;

    @Autowired
    private OrderService orderService;

    @GetMapping
    public String showProfile(Model model) {
        model.addAttribute("user", userService.getCurrentUser());
        model.addAttribute("totalQuantity", cartService.getTotalQuantity());
        model.addAttribute("orders", orderService.getAccountIdOrders());
        return "/profile";
    }
}