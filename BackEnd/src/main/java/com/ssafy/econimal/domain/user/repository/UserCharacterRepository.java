package com.ssafy.econimal.domain.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.econimal.domain.user.entity.UserCharacter;

public interface UserCharacterRepository extends JpaRepository<UserCharacter, Long> {
}
