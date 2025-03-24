package com.ssafy.econimal.domain.town.controller;

import com.ssafy.econimal.domain.town.dto.EcoAnswerResponse;
import com.ssafy.econimal.domain.town.dto.InfrastructureEventDetailResponse;
import com.ssafy.econimal.domain.town.dto.TownNameUpdateRequest;
import com.ssafy.econimal.domain.town.dto.TownStatusResponse;
import com.ssafy.econimal.domain.town.service.InfrastructureEventService;
import com.ssafy.econimal.domain.town.service.TownService;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.global.annotation.Login;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/towns")
@RequiredArgsConstructor
public class TownController {

    private final TownService townService;
    private final InfrastructureEventService infrastructureEventService;

    @PatchMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateTownName(@Login User user, @RequestBody TownNameUpdateRequest townNameUpdateRequest) {
        townService.updateTownName(user, townNameUpdateRequest);
    }

    @GetMapping("/events")
    public TownStatusResponse getTownStatus(@Login User user) {
        return infrastructureEventService.getTownStatus(user);
    }

    @GetMapping("/events/{infraEventId}")
    public InfrastructureEventDetailResponse getInfrastructureEventDetail(@PathVariable Long infraEventId) {
        return infrastructureEventService.getInfrastructureEventDetail(infraEventId);
    }

    @PostMapping("/ecoAnswer/{ecoAnswerId}")
    public EcoAnswerResponse getEcoAnswer(@Login User user, @PathVariable Long ecoAnswerId) {
        return infrastructureEventService.getEcoAnswer(user, ecoAnswerId);
    }
}
