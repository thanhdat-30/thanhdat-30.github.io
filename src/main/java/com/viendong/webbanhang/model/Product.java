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

    public Long getId() {
        return id;
    }

    public List<SizeQuantity> getSizeQuantities() {
        return sizeQuantities;
    }

    public String getBase64Image() {
        return base64Image;
    }

    public void setBase64Image(String base64Image) {
        this.base64Image = base64Image;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Double getOldPrice() {
        return oldPrice;
    }

    public void setOldPrice(Double oldPrice) {
        this.oldPrice = oldPrice;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public void setSizeQuantities(List<SizeQuantity> sizeQuantities) {
        this.sizeQuantities = sizeQuantities;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescriptionCmt() {
        return descriptionCmt;
    }

    public void setDescriptionCmt(String descriptionCmt) {
        this.descriptionCmt = descriptionCmt;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

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