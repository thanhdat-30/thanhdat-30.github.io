package com.viendong.webbanhang.controller;

import com.viendong.webbanhang.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/cart")
public class CartController {
    @Autowired
    private CartService cartService;

    @GetMapping
    public String showCart(Model model) {
        model.addAttribute("cartItems", cartService.getCartItems());
        model.addAttribute("totalQuantity", cartService.getTotalQuantity());
        model.addAttribute("cartTotal", cartService.formattedCartTotal());
        return "/cart/cart";
    }

    @PostMapping("/add")
    @ResponseBody
    public Map<String, Integer> addToCart(@RequestParam Long productId, @RequestParam int quantity, @RequestParam String size) {
        cartService.addToCart(productId, quantity, size);
        int totalQuantity = cartService.getTotalQuantity();
        Map<String, Integer> response = new HashMap<>();
        response.put("totalQuantity", totalQuantity);
        return response;
    }

    @GetMapping("/remove/{productId}/{size}")
    public String removeFromCart(@PathVariable Long productId, @PathVariable String size) {
        cartService.removeFromCart(productId, size);
        return "redirect:/cart";
    }

    @GetMapping("/clear")
    public String clearCart() {
        cartService.clearCart();
        return "redirect:/cart";
    }

    @PostMapping("/update")
    @ResponseBody
    public Map<String, Object> updateQuantity(@RequestParam Long productId, @RequestParam int quantity, @RequestParam String size) {
        try {
            cartService.updateItemQuantity(productId, quantity, size);
            Map<String, Object> response = new HashMap<>();
            response.put("totalQuantity", cartService.getTotalQuantity());
            response.put("cartTotal", cartService.formattedCartTotal());
            return response;
        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return errorResponse;
        }
    }
}
