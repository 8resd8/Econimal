package com.ssafy.econimal.domain.town.service;

import com.ssafy.econimal.domain.town.dto.InfrastructureEventResponse;
import com.ssafy.econimal.domain.town.dto.TownNameUpdateRequest;
import com.ssafy.econimal.domain.town.dto.TownStatusResponse;
import com.ssafy.econimal.domain.town.entity.InfrastructureEvent;
import com.ssafy.econimal.domain.town.entity.Town;
import com.ssafy.econimal.domain.town.repository.TownRepository;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.global.exception.InvalidArgumentException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TownService {

    private final TownRepository townRepository;

    public void updateTownName(User user, TownNameUpdateRequest townNameUpdateRequest) {
        user.getTown().updateTownName(townNameUpdateRequest.townName());
    }

    @Transactional(readOnly = true)
    public TownStatusResponse getTownStatus(User user) {
        Long townId = user.getTown().getId();
        // townId를 이용하여 해당 마을의 인프라 이벤트들을 조회
        List<InfrastructureEvent> events = townRepository.findInfrastructureEventsById(townId);

        // 조회한 이벤트들을 InfrastructureEventResponse dto로 변환
        List<InfrastructureEventResponse> responseList = events.stream()
                .map(event -> new InfrastructureEventResponse(
                        event.getInfrastructure().getId(),
                        event.getInfrastructure().getFacility().getEcoType(),
                        event.getInfrastructure().isClean(),
                        event.getId(),
                        event.isActive()
                ))
                .collect(Collectors.toList());

        // 변환된 결과를 TownStatusResponse에 담아 반환
        return new TownStatusResponse(responseList);
    }

}
