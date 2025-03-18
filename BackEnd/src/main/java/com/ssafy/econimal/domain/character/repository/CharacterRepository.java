package com.ssafy.econimal.domain.character.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ssafy.econimal.domain.character.entity.Character;

public interface CharacterRepository extends JpaRepository<Character, Long> {

	@Query("select c from Character c where c.isOriginal = true")
	List<Character> findByOriginalIsTrue();
}
