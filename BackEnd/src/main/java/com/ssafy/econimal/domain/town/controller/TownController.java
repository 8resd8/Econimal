package com.ssafy.econimal.domain.town.controller;

import com.ssafy.econimal.domain.town.dto.TownNameUpdateRequest;
import com.ssafy.econimal.domain.town.service.TownService;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.global.annotation.Login;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/towns")
@RequiredArgsConstructor
public class TownController {

    private final TownService townService;

    @PatchMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateTownName(@Login User user, TownNameUpdateRequest townNameUpdateRequest) {
        townService.updateTownName(user, townNameUpdateRequest);
    }
}
