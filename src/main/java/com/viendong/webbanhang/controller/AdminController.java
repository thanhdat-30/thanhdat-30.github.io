package com.viendong.webbanhang.controller;

import com.viendong.webbanhang.model.Category;
import com.viendong.webbanhang.model.Order;
import com.viendong.webbanhang.model.Product;
import com.viendong.webbanhang.model.User;
import com.viendong.webbanhang.service.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List; // Import List

@Controller
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private OrderDetailsService orderDetailsService;
    @Autowired
    private ProductService productService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private UserService userService;

    @Autowired
    private OrderService orderService;

    @GetMapping
    public String showAdminDashboard(Model model) {
        List<Order> recentOrders = orderService.getRecentOrders();
        model.addAttribute("orders", recentOrders);
        long totalProducts = productService.getTotalProducts();
        model.addAttribute("totalProducts", totalProducts);
        model.addAttribute("products", productService.getAllProducts());
        long categoryCount = categoryService.countCategories();
        model.addAttribute("categoryCount", categoryCount);
        long totalUsers = userService.getTotalUsers();
        model.addAttribute("totalUsers", totalUsers);
        model.addAttribute("latestCategories", categoryService.getLatestCategories());
        long totalOrders = orderService.getTotalOrders();
        model.addAttribute("totalOrders", totalOrders);
        List<Product> latestProducts = productService.getLatestProducts();
        model.addAttribute("latestProducts", latestProducts);
        return "/admin/dashboard";
    }

    @GetMapping("/categories")
    public String listCategories(Model model) {
        List<Category> categories = categoryService.getAllCategories();
        model.addAttribute("categories", categories);
        return "/admin/categories-management";
    }

    @GetMapping("/categories/add")
    public String showAdminAddCategories(Model model) {
        model.addAttribute("product", new Product());
        model.addAttribute("latestProducts", productService.getLatestProducts(5));
        model.addAttribute("categories", categoryService.getAllCategories());
        return "/admin/add-categories";
    }

    @GetMapping("/products")
    public String showAdminProductsDashboard(Model model) {
        model.addAttribute("products", productService.getAllProducts());
        model.addAttribute("product", new Product());
        List<Product> latestProducts = productService.getLatestProducts(5);
        model.addAttribute("latestProducts", latestProducts);
        model.addAttribute("categories", categoryService.getAllCategories());
        return "/admin/products-management";
    }

    @GetMapping("/products/edit/{id}")
    public String showAdminEditForm(@PathVariable("id") Long id, Model model) {
        Product product = productService.getProductById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid product Id:" + id));
        model.addAttribute("product", product);
        model.addAttribute("categories", categoryService.getAllCategories());
        return "/admin/edit-product";
    }

    @PostMapping("/products/update/{id}")
    public String updateAdminProduct(@PathVariable("id") Long id, @Valid Product product, BindingResult bindingResult,
            Model model) {
        if (bindingResult.hasErrors()) {
            model.addAttribute("categories", categoryService.getAllCategories());
            return "/admin/edit-product";
        }
        return "redirect:/admin/products";
    }

    @GetMapping("/products/delete/{id}")
    public String deleteAdminProduct(@PathVariable("id") Long id) {
        orderDetailsService.deleteByProductId(id);
        productService.deleteProductById(id);
        return "redirect:/admin/products";
    }

    @GetMapping("/users")
    public String showUserList(Model model) {
        model.addAttribute("users", userService.getAllUsers());
        model.addAttribute("user", new User());
        return "/admin/user-list";
    }
    @PostMapping("/users/update/{id}")
    public String updateUser(@PathVariable("id") Long id, @Valid User user, BindingResult bindingResult, Model model) {
        if (bindingResult.hasErrors()) {
            user.setId(id);
            userService.updateUser(user);
            return "redirect:/admin/users";
        }
        return "/admin/edit-user";
    }
    @GetMapping("/users/delete/{id}")
    public String deleteUser(@PathVariable("id") Long id) {
        userService.deleteUser(id);
        return "redirect:/admin/users";
    }


    @GetMapping("/orders")
    public String showAllOrders(Model model) {
        model.addAttribute("orders", orderService.getAllOrders());
        return "/admin/oder-management";
    }
}
