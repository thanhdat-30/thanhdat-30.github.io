package com.viendong.webbanhang.controller;

import com.viendong.webbanhang.model.Product;
import com.viendong.webbanhang.service.CartService;
import com.viendong.webbanhang.service.CategoryService;
import com.viendong.webbanhang.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/products")
public class ProductController {
    @Autowired
    private ProductService productService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private CartService cartService;

    @GetMapping
    public String showProducts(Model model) {
        model.addAttribute("products", productService.getAllProducts());
        model.addAttribute("categories", categoryService.getAllCategories());
        model.addAttribute("totalQuantity", cartService.getTotalQuantity());
        return "/products/products-list";
    }

    @GetMapping("/single/{id}")
    public String showSingle(@PathVariable("id") Long id, Model model) {
        Product product = productService.getProductById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid product Id:" + id));
        model.addAttribute("product", product);
        model.addAttribute("categories", categoryService.getAllCategories());
        model.addAttribute("totalQuantity", cartService.getTotalQuantity());
        return "single";
    }
}
