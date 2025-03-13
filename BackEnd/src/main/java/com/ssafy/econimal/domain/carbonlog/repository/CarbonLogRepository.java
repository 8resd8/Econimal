package com.ssafy.econimal.domain.carbonlog.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.econimal.domain.carbonlog.entity.CarbonLog;

public interface CarbonLogRepository extends JpaRepository<CarbonLog, Long> {
}
