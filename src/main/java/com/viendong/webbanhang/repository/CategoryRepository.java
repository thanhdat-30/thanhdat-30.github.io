package com.viendong.webbanhang.repository;

import com.viendong.webbanhang.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findTop5ByOrderByCreatedDateDesc();

}
