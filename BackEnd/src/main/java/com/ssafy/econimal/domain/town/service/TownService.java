package com.ssafy.econimal.domain.town.service;

import com.ssafy.econimal.domain.town.dto.TownNameUpdateRequest;
import com.ssafy.econimal.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
@Transactional
public class TownService {

    public void updateTownName(User user, TownNameUpdateRequest townNameUpdateRequest) {
        user.getTown().updateTownName(townNameUpdateRequest.townName());
    }

}
