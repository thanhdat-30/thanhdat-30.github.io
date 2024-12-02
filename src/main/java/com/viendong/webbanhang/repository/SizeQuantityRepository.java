package com.viendong.webbanhang.repository;

import com.viendong.webbanhang.model.SizeQuantity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SizeQuantityRepository extends JpaRepository<SizeQuantity, Long> {

}
