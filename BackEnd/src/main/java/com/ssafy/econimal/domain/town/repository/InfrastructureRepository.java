package com.ssafy.econimal.domain.town.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.econimal.domain.town.entity.Infrastructure;

public interface InfrastructureRepository extends JpaRepository<Infrastructure, Long> {
}
