package com.ssafy.econimal.domain.town.repository;

import com.ssafy.econimal.domain.town.dto.TownNameUpdateDto;
import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.econimal.domain.town.entity.Town;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface TownRepository extends JpaRepository<Town, Long> {
    @Query("UPDATE Town t SET t.name = :townName WHERE t.id = :townId")
    int updateTownName(TownNameUpdateDto townNameUpdateDto);

    Optional<Town> findById(Long townId);
}
