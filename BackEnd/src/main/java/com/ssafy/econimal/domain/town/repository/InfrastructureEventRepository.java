package com.ssafy.econimal.domain.town.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.econimal.domain.town.entity.InfrastructureEvent;

import java.util.List;

public interface InfrastructureEventRepository extends JpaRepository<InfrastructureEvent, Long> {

    List<InfrastructureEvent> findAll();

    List<InfrastructureEvent> findByInfrastructureTownId(Long townId);
}
