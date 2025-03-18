package com.ssafy.econimal.domain.town.service;

import com.ssafy.econimal.domain.town.dto.TownNameUpdateRequest;
import com.ssafy.econimal.domain.town.repository.TownRepository;
import com.ssafy.econimal.domain.user.entity.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class TownService {

    private final TownRepository townRepository;

    public void updateTownName(User user, TownNameUpdateRequest townNameUpdateRequest) {
        user.getTown().updateTownName(townNameUpdateRequest.townName());
    }
}
