package com.ssafy.econimal.domain.town.controller;

import com.ssafy.econimal.domain.town.dto.TownNameUpdateDto;
import com.ssafy.econimal.domain.town.service.TownService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/towns")
@RequiredArgsConstructor
public class TownController {

    private final TownService townService;

    @PatchMapping("/")
    public ResponseEntity<Void> updateTownName(TownNameUpdateDto townNameUpdateDto) {
        townService.updateTownName(townNameUpdateDto);
        return ResponseEntity.ok().build();
    }
}
