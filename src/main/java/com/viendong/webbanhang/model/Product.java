package com.viendong.webbanhang.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.text.DecimalFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is mandatory")
    private String name;

    @Lob
    private byte[] image;

    @Column(name = "description_cmt")
    private String descriptionCmt;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SizeQuantity> sizeQuantities;

    @NotNull(message = "Price is mandatory")
    @Min(value = 0, message = "Price must be a positive number")
    private Double price;

    @Column(name = "old_price")
    private Double oldPrice;

    @NotBlank(message = "Description is mandatory")
    @Column(length = 1000)
    private String description;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    @NotNull(message = "Category is mandatory")
    private Category category;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Transient
    private String base64Image;

    public Product(String name, Double price, Double oldPrice, String description, Category category,
            String descriptionCmt) {
        this.name = name;
        this.price = price;
        this.oldPrice = oldPrice;
        this.description = description;
        this.descriptionCmt = descriptionCmt;
        this.category = category;
    }

    @JsonIgnore
    public String getFormattedPrice() {
        DecimalFormat formatter = new DecimalFormat("#,###");
        return formatter.format(this.price) + " ₫";
    }

    @JsonIgnore
    public String getCategoryId() {
        return this.category.getId().toString();
    }

    @JsonIgnore
     public String getFormattedOldPrice() {
         DecimalFormat formatter = new DecimalFormat("#,###");
         return formatter.format(this.oldPrice) + " ₫";
     }

     @JsonIgnore
     public String getDiscount() {
         if (oldPrice == null || oldPrice == 0) {
             return "0%";
         }
         double discount = (1 - price / oldPrice) * 100;
         return String.format("%.0f%%", discount);
     }
}