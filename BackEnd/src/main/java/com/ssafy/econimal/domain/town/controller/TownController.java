package com.ssafy.econimal.domain.town.controller;

import com.ssafy.econimal.domain.town.dto.request.TownNameUpdateRequest;
import com.ssafy.econimal.domain.town.service.TownService;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.global.annotation.Login;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/towns")
@RequiredArgsConstructor
public class TownController {

    private final TownService townService;

    @PatchMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateTownName(@Login User user, @Valid @RequestBody TownNameUpdateRequest request) {
        townService.updateTownName(user, request);
    }
}
