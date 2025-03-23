package com.ssafy.econimal.domain.town.repository;

import com.ssafy.econimal.domain.town.entity.InfrastructureEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.econimal.domain.town.entity.Town;

import java.util.List;
import java.util.Optional;

public interface TownRepository extends JpaRepository<Town, Long> {

    Optional<Town> findById(Long townId);

    List<InfrastructureEvent> findInfrastructureEventsById(Long townId);
}
