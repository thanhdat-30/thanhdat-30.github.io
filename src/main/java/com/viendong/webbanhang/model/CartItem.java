package com.viendong.webbanhang.model;

import lombok.*;

import java.text.DecimalFormat;

@Getter
@Setter
public class CartItem {
    private Product product;
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
