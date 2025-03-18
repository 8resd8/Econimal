package com.ssafy.econimal.domain.user.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.econimal.domain.user.dto.UserInfoDto;
import com.ssafy.econimal.domain.user.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findByEmail(String email);

	@Query("select new com.ssafy.econimal.domain.user.dto.UserInfoDto(c.email, c.name, c.nickname, c.birth, c.coin, c.role, c.lastLoginAt, c.town.name) FROM User c WHERE c.id = :userId")
	UserInfoDto findUserInfoById(@Param("userId") Long userId);

	// 이메일 존재 여부 확인
	boolean existsByEmail(String email);
}
