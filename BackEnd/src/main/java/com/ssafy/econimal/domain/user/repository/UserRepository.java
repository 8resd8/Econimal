package com.ssafy.econimal.domain.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.econimal.domain.user.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
}
