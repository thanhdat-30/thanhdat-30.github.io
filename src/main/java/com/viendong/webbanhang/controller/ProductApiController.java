package com.viendong.webbanhang.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.viendong.webbanhang.model.Category;
import com.viendong.webbanhang.model.Product;
import com.viendong.webbanhang.model.SizeQuantity;
import com.viendong.webbanhang.service.CategoryService;
import com.viendong.webbanhang.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
public class ProductApiController {
    private ObjectMapper objectMapper;

    public ProductApiController() {
        this.objectMapper = new ObjectMapper();
    }

    @Autowired
    private ProductService productService;

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam(name = "name", required = false) String name) {
        if (name != null && !name.isEmpty()) {
            return productService.searchProductsByName(name);
        } else {
            return productService.getAllProducts();
        }
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getProductImage(@PathVariable Long id) {
        byte[] imageData = productService.getProductImageById(id);
        if (imageData != null) {
            return ResponseEntity.ok()
                    .header("Content-Type", "image/png")
                    .body(imageData);
        } else {
            return ResponseEntity.noContent().build();
        }
    }

    @PostMapping
    public ResponseEntity<Product> addProduct(
            @RequestParam("name") String name,
            @RequestParam("category_id") Long categoryId,
            @RequestParam("price") Double price,
            @RequestParam("oldPrice") Double oldPrice,
            @RequestParam("description") String description,
            @RequestParam(value = "descriptionCmt", required = false) String descriptionCmt,
            @RequestParam(value = "sizeQuantities", required = false) String sizeQuantitiesJson,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        try {
            Category category = categoryService.getCategoryById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại"));

            Product product = new Product();
            product.setName(name);
            product.setCategory(category);
            product.setPrice(price);
            product.setOldPrice(oldPrice);
            product.setDescription(description);
            product.setDescriptionCmt(descriptionCmt);

            if (imageFile != null && !imageFile.isEmpty()) {
                product.setImage(imageFile.getBytes());
            }

            if (sizeQuantitiesJson != null && !sizeQuantitiesJson.isEmpty()) {
                // Chuyển chuỗi JSON thành danh sách các đối tượng SizeQuantity
                List<SizeQuantity> sizeQuantities = objectMapper.readValue(
                        sizeQuantitiesJson,
                        objectMapper.getTypeFactory().constructCollectionType(List.class, SizeQuantity.class)
                );

                // Duyệt qua danh sách sizeQuantities và gán product_id cho mỗi SizeQuantity
                for (SizeQuantity sizeQuantity : sizeQuantities) {
                    sizeQuantity.setProduct(product);  // Liên kết sizeQuantity với product
                }

                // Thêm danh sách sizeQuantities vào sản phẩm
                product.setSizeQuantities(sizeQuantities);
            }


            Product savedProduct = productService.addProduct(product, imageFile);

            return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> optionalProduct = productService.getProductById(id);
        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();

            byte[] imageData = productService.getProductImageById(id);
            String base64Image = imageData != null ? Base64.getEncoder().encodeToString(imageData) : null;

            product.setBase64Image(base64Image);
            return ResponseEntity.ok(product);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id,
                                                 @RequestParam("name") String name,
                                                 @RequestParam("price") Double price,
                                                 @RequestParam("oldPrice") Double oldPrice,
                                                 @RequestParam("description") String description,
                                                 @RequestParam("category_id") Long categoryId,
                                                 @RequestParam(value = "descriptionCmt", required = false) String descriptionCmt,
                                                 @RequestParam(value = "sizeQuantities", required = false) String sizeQuantitiesJson,
                                                 @RequestParam(value = "image", required = false) MultipartFile image) {
        try {
            Optional<Product> optionalProduct = productService.getProductById(id);
            if (optionalProduct.isPresent()) {
                Product product = optionalProduct.get();
                Category category = categoryService.getCategoryById(categoryId)
                        .orElseThrow(() -> new RuntimeException("Category not found"));

                // Update product details
                product.setName(name);
                product.setPrice(price);
                product.setOldPrice(oldPrice);
                product.setDescription(description);
                product.setCategory(category);
                product.setDescriptionCmt(descriptionCmt);

                // Handle image update if new image is provided
                if (image != null && !image.isEmpty()) {
                    product.setImage(image.getBytes());
                }

                // Xử lý sizeQuantities nếu được cung cấp
                if (sizeQuantitiesJson != null && !sizeQuantitiesJson.isEmpty()) {
                    // Parse JSON thành danh sách SizeQuantity
                    List<SizeQuantity> sizeQuantities = objectMapper.readValue(
                            sizeQuantitiesJson,
                            objectMapper.getTypeFactory().constructCollectionType(List.class, SizeQuantity.class)
                    );

                    // Gỡ bỏ các sizeQuantities cũ
                    product.getSizeQuantities().clear();

                    // Liên kết sizeQuantities mới với sản phẩm
                    for (SizeQuantity sizeQuantity : sizeQuantities) {
                        sizeQuantity.setProduct(product);
                    }

                    // Thêm sizeQuantities mới vào sản phẩm
                    product.getSizeQuantities().addAll(sizeQuantities);
                }


                // Save the updated product
                Product updatedProduct = productService.updateProduct(product, image);

                // Return the updated product
                return ResponseEntity.ok(updatedProduct);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        Product product = productService.getProductById(id)
                .orElseThrow(() -> new RuntimeException("Product not found on :: " + id));
        productService.deleteProductById(id);
        return ResponseEntity.noContent().build();
    }
}