package com.ssafy.econimal.domain.user.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.entity.UserBackground;

public interface UserBackgroundRepository extends JpaRepository<UserBackground, Long> {

	// 배경 대표(메인) 찾기
	@Query("select ub from UserBackground ub where ub.user = :user and ub.isMain = true")
	Optional<UserBackground> findByUserAndMainIsTrue(@Param("user") User user);

	List<UserBackground> findByUser(User user);

	// 소유한 물건인지 확인
	boolean findByUserAndProductId(User user, Long productId);
}
