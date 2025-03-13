package com.ssafy.econimal.domain.town.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.econimal.domain.town.entity.Facility;

public interface FacilityRepository extends JpaRepository<Facility, Long> {
}
