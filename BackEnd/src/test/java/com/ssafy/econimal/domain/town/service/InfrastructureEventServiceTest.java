package com.ssafy.econimal.domain.town.service;

import com.ssafy.econimal.domain.data.TestEntityHelper;
import com.ssafy.econimal.domain.town.dto.InfrastructureEventResponse;
import com.ssafy.econimal.domain.town.dto.TownStatusResponse;
import com.ssafy.econimal.domain.town.entity.*;
import com.ssafy.econimal.domain.town.repository.TownRepository;
import com.ssafy.econimal.domain.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class InfrastructureEventServiceTest {

    @Autowired
    private InfrastructureEventService infrastructureEventService;

    @Autowired
    private TestEntityHelper helper;

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
    void 도시_상태_조회() {
        TownStatusResponse response = infrastructureEventService.getTownStatus(user);
        assertNotNull(response);
        assertEquals(1, response.townStatus().size());

        InfrastructureEventResponse eventResponse = response.townStatus().get(0);
        assertEquals(infrastructure.getId(), eventResponse.infraId());
        assertEquals(facility.getEcoType(), eventResponse.ecoType());
        assertEquals(infrastructure.isClean(), eventResponse.isClean());
        assertEquals(infrastructureEvent.getId(), eventResponse.infraEventId());
        assertEquals(infrastructureEvent.isActive(), eventResponse.isActive());
    }
}