package com.ssafy.econimal.domain.town.service;

import com.ssafy.econimal.domain.town.dto.TownNameUpdateDto;
import com.ssafy.econimal.domain.town.entity.Town;
import com.ssafy.econimal.domain.town.repository.TownRepository;
import com.ssafy.econimal.global.exception.InvalidArgumentException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class TownService {

    private final TownRepository townRepository;

    public void updateTownName(TownNameUpdateDto townNameUpdateDto) {
        int updatedCount = townRepository.updateTownName(townNameUpdateDto.townId(), townNameUpdateDto.townName());
        if(updatedCount == 0) {
            throw new InvalidArgumentException("해당하는 마을을 찾을 수 없습니다.");
        }
    }
}
