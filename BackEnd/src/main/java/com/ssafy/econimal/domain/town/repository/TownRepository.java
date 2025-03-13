package com.ssafy.econimal.domain.town.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.econimal.domain.town.entity.Town;

public interface TownRepository extends JpaRepository<Town, Long> {
}
