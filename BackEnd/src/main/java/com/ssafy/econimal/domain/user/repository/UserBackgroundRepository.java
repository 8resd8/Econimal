package com.ssafy.econimal.domain.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.econimal.domain.product.entity.Product;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.entity.UserBackground;

public interface UserBackgroundRepository extends JpaRepository<UserBackground, Long> {
	boolean existsByUserAndProduct(User user, Product product);
}
