package com.ssafy.econimal.domain.globe.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.econimal.domain.globe.entity.Climates;

public interface ClimatesRepository extends JpaRepository<Climates, Long> {
}
