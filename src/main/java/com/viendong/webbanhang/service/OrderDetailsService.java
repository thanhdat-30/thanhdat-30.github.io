package com.viendong.webbanhang.service;

import com.viendong.webbanhang.model.OrderDetail;
import com.viendong.webbanhang.repository.OrderDetailRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderDetailsService {
    private final OrderDetailRepository orderDetailsRepository;

    public void deleteByProductId(Long productId) {
        List<OrderDetail> orderDetails = orderDetailsRepository.findByProductId(productId);
        if (!orderDetails.isEmpty()) {
            orderDetailsRepository.deleteAll(orderDetails);
        }
    }
}