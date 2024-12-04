package com.viendong.webbanhang.model;

import lombok.*;

import java.text.DecimalFormat;

@Getter
@Setter
public class CartItem {
    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    private Product product;

    public int getQuantity() {
        return quantity;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    private int quantity;
    private String size;

    public CartItem(Product product, int quantity, String size) {
        this.product = product;
        this.quantity = quantity;
        this.size = size;
    }

    public String formattedPriceQuantity() {
        DecimalFormat formatter = new DecimalFormat("#,###");
        int totalPrice = (int) (product.getPrice() * quantity);
        return formatter.format(totalPrice) + " ₫";
    }
}
