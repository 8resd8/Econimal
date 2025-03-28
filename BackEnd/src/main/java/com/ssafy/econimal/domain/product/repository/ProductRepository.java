package com.ssafy.econimal.domain.product.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.econimal.domain.product.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
