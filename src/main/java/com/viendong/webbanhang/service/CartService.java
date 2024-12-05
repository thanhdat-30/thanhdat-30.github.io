package com.viendong.webbanhang.service;

import com.viendong.webbanhang.model.CartItem;
import com.viendong.webbanhang.model.Product;
import com.viendong.webbanhang.repository.ProductRepository;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.annotation.SessionScope;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;

@Service
@SessionScope
public class CartService {
    @Getter
    private List<CartItem> cartItems = new ArrayList<>();

    @Autowired
    private ProductRepository productRepository;

    public List<CartItem> getCartItems() {
        return cartItems;
    }

    public void setCartItems(List<CartItem> cartItems) {
        this.cartItems = cartItems;
    }

    public ProductRepository getProductRepository() {
        return productRepository;
    }

    public void setProductRepository(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public void addToCart(Long productId, int quantity, String size) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Không thấy sản phẩm: " + productId));

        boolean validSize = product.getSizeQuantities().stream()
                .anyMatch(sizeQuantity -> sizeQuantity.getSize().equals(size));

        if (!validSize) {
            throw new IllegalArgumentException("Không thấy size: " + size);
        }

        for (CartItem item : cartItems) {
            if (item.getProduct().getId().equals(productId) && item.getSize().equals(size)) {
                item.setQuantity(item.getQuantity() + quantity);
                return;
            }
        }

        cartItems.add(new CartItem(product, quantity, size));
    }

    public void removeFromCart(Long productId, String size) {
        cartItems.removeIf(cartItem ->
                cartItem.getProduct().getId().equals(productId) && cartItem.getSize().equals(size)
        );
    }

    public void clearCart() {
        cartItems.clear();
    }

    public int getTotalQuantity() {
        return cartItems.stream().mapToInt(CartItem::getQuantity).sum();
    }

    public void updateItemQuantity(Long productId, int quantity, String size) {
        for (CartItem item : cartItems) {
            if (item.getProduct().getId().equals(productId) && item.getSize().equals(size)) {
                if (quantity > 0) {
                    item.setQuantity(quantity);
                } else {
                    throw new IllegalArgumentException("Số lượng phải lớn hơn 0");
                }
                return;
            }
        }

        throw new IllegalArgumentException("Không tìm tìm thấy sản phẩm có size: " + size);
    }

    public double getTotalCartValue() {
        return cartItems.stream()
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();
    }

    public String formattedCartTotal() {
        DecimalFormat formatter = new DecimalFormat("#,###");
        int totalValue = (int) getTotalCartValue();
        return formatter.format(totalValue) + " ₫";
    }
}
