package com.viendong.webbanhang.service;

import com.viendong.webbanhang.model.Product;
import com.viendong.webbanhang.model.SizeQuantity;
import com.viendong.webbanhang.repository.ProductRepository;
import com.viendong.webbanhang.repository.SizeQuantityRepository;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SizeQuantityRepository sizeQuantityRepository;

    @Autowired
    private EmailService emailService;

    public long getTotalProducts() {
        return productRepository.count();
    }

    public List<Product> getLatestProducts(int limit) {
        return productRepository.findTop5ByOrderByCreatedAtDesc();
    }

    public List<Product> getLatestProducts() {
        return productRepository.findTop5ByOrderByCreatedAtDesc();
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getProductNew() {
        return productRepository.findAllByOrderByCreatedAtDesc();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public byte[] getProductImageById(Long id) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isPresent() && product.get().getImage() != null) {
            return product.get().getImage();
        } else {
            return null;
        }
    }

    public Product addProduct(Product product, MultipartFile imageFile) throws IOException {
        if (imageFile != null && !imageFile.isEmpty()) {
            product.setImage(imageFile.getBytes());
        }

        Product savedProduct = productRepository.save(product);

        if (product.getSizeQuantities() != null) {
            for (SizeQuantity sizeQuantity : product.getSizeQuantities()) {
                sizeQuantity.setProduct(savedProduct);
                sizeQuantityRepository.save(sizeQuantity);
            }
        }

        return savedProduct;
    }

    public Product updateProduct(@NonNull Product product, MultipartFile imageFile) throws IOException {
        Product existingProduct = productRepository.findById(product.getId())
                .orElseThrow(
                        () -> new IllegalStateException("Product with ID " + product.getId() + " does not exist."));

        existingProduct.setName(product.getName());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setOldPrice(product.getOldPrice());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setCategory(product.getCategory());
        existingProduct.setDescriptionCmt(product.getDescriptionCmt());

        if (imageFile != null && !imageFile.isEmpty()) {
            existingProduct.setImage(imageFile.getBytes());
        }


        return productRepository.save(existingProduct);
    }

    public void deleteProductById(Long id) {
        if (!productRepository.existsById(id)) {
            throw new IllegalStateException("Product with ID " + id + " does not exist.");
        }
        productRepository.deleteById(id);
    }

    public List<Product> searchProductsByName(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }

    public void sendSubscribeEmail(String userEmail) {
        Map<String, Object> variables = new HashMap<>();
        try {
            emailService.sendHtmlEmail(
                    userEmail,
                    "Đăng ký nhận bản tin thành công!",
                    "mail/subscribe",
                    variables);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}
