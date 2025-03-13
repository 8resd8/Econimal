package com.ssafy.econimal.domain.store.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.econimal.domain.store.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
