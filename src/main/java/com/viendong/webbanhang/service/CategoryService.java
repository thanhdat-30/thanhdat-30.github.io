package com.viendong.webbanhang.service;

import com.viendong.webbanhang.model.Category;
import com.viendong.webbanhang.repository.CategoryRepository;
import jakarta.transaction.Transactional;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    public Category addCategory(Category category) {
        categoryRepository.save(category);
        return category;
    }

    public long countCategories() {
        return categoryRepository.count();
    }

    public List<Category> getLatestCategories() {
        return categoryRepository.findTop5ByOrderByCreatedDateDesc();
    }

    public Category updateCategory(@NonNull Category category) {
        Category existingCategory = categoryRepository.findById(category.getId()).orElseThrow(
                () -> new IllegalStateException("Category with ID " + category.getId() + " does not exist."));
        existingCategory.setName(category.getName());
        categoryRepository.save(existingCategory);
        return existingCategory;
    }

    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new IllegalStateException("Category with ID " + id + " does not exist.");
        }
        categoryRepository.deleteById(id);
    }

}
