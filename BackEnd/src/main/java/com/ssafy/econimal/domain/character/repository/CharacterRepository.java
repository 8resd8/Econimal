package com.ssafy.econimal.domain.character.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.econimal.domain.character.entity.Character;

public interface CharacterRepository extends JpaRepository<Character, Long> {
}
