package com.ssafy.econimal.domain.town.service;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.econimal.domain.data.TestEntityHelper;
import com.ssafy.econimal.domain.town.dto.response.InfrastructureEventResponse;
import com.ssafy.econimal.domain.town.dto.request.TownNameUpdateRequest;
import com.ssafy.econimal.domain.town.dto.response.TownStatusResponse;
import com.ssafy.econimal.domain.town.entity.EcoQuiz;
import com.ssafy.econimal.domain.town.entity.Facility;
import com.ssafy.econimal.domain.town.entity.Infrastructure;
import com.ssafy.econimal.domain.town.entity.InfrastructureEvent;
import com.ssafy.econimal.domain.town.entity.Town;
import com.ssafy.econimal.domain.town.repository.TownRepository;
import com.ssafy.econimal.domain.user.entity.User;

@SpringBootTest
@Transactional
class TownServiceTest {
	@Autowired
	private TownService townService;

	@Autowired
	private TestEntityHelper helper;

	@Autowired
	private TownEventService townEventService;

	@Autowired
	private TownRepository townRepository;

	private Town town;
	private User user;
	private Facility facility;
	private EcoQuiz ecoQuiz;
	private Infrastructure infrastructure;
	private InfrastructureEvent infrastructureEvent;

	@BeforeEach
	void setUp() {
		town = helper.createTown();
		user = helper.createUser(town);
		facility = helper.createFacility();
		ecoQuiz = helper.createEcoQuiz(facility);
		infrastructure = helper.createInfrastructure(town, facility, true);
		infrastructureEvent = helper.createInfrastructureEvent(infrastructure, ecoQuiz, true);
	}

	@Test
	void 도시_이름_변경() {
		// given
		String changeName = "변경된 도시 이름";
		TownNameUpdateRequest townNameUpdateRequest = new TownNameUpdateRequest(changeName);

		// when
		townService.updateTownName(user, townNameUpdateRequest);

		// then
		Town newTown = townRepository.findById(town.getId()).orElse(null);
		assertNotNull(newTown);
		assertEquals(changeName, newTown.getName());
	}

	@Test
	void 도시_상태_조회() {
		TownStatusResponse response = townEventService.getTownStatus(user);
		assertNotNull(response);
		assertEquals(1, response.townStatus().size());

		InfrastructureEventResponse eventResponse = response.townStatus().get(0);
		assertEquals(infrastructure.getId(), eventResponse.infraId());
		assertEquals(facility.getEcoType().toString(), eventResponse.ecoType().toString());
		assertEquals(infrastructure.isClean(), eventResponse.isClean());
		assertEquals(infrastructureEvent.getId(), eventResponse.infraEventId());
		assertEquals(infrastructureEvent.isActive(), eventResponse.isActive());
	}
}