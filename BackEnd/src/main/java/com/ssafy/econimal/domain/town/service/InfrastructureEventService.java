package com.ssafy.econimal.domain.town.service;

import com.ssafy.econimal.domain.town.dto.InfrastructureEventResponse;
import com.ssafy.econimal.domain.town.dto.TownStatusResponse;
import com.ssafy.econimal.domain.town.entity.InfrastructureEvent;
import com.ssafy.econimal.domain.town.repository.InfrastructureEventRepository;
import com.ssafy.econimal.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class InfrastructureEventService {

    private final InfrastructureEventRepository infrastructureEventRepository;


    @Transactional(readOnly = true)
    public TownStatusResponse getTownStatus(User user) {
        Long townId = user.getTown().getId();
        List<InfrastructureEvent> events = infrastructureEventRepository.findByInfrastructureTownId(townId);

        List<InfrastructureEventResponse> responseList = events.stream()
                .map(event -> new InfrastructureEventResponse(
                        event.getInfrastructure().getId(),
                        event.getInfrastructure().getFacility().getEcoType(),
                        event.getInfrastructure().isClean(),
                        event.getId(),
                        event.isActive()
                ))
                .collect(Collectors.toList());

        return new TownStatusResponse(responseList);
    }
}
