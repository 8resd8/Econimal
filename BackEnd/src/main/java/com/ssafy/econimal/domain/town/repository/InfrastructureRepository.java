package com.ssafy.econimal.domain.town.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.econimal.domain.town.entity.Infrastructure;
import com.ssafy.econimal.domain.town.entity.Town;

public interface InfrastructureRepository extends JpaRepository<Infrastructure, Long> {

	List<Infrastructure> findByTown(Town town);

}
