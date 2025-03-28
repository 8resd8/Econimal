package com.ssafy.econimal.domain.town.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.econimal.domain.town.dto.request.TownNameUpdateRequest;
import com.ssafy.econimal.domain.user.entity.User;

@Service
@Transactional
public class TownService {

	public void updateTownName(User user, TownNameUpdateRequest request) {
		user.getTown().updateTownName(request.townName());
	}
}
