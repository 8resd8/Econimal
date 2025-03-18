package com.ssafy.econimal.domain.town.service;

import com.ssafy.econimal.domain.data.helper.TestEntityHelper;
import com.ssafy.econimal.domain.town.dto.TownNameUpdateRequest;
import com.ssafy.econimal.domain.town.entity.Town;
import com.ssafy.econimal.domain.town.repository.TownRepository;
import com.ssafy.econimal.domain.user.entity.User;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class TownServiceTest {

    @Autowired
    private TownService townService;

    @Autowired
    private TestEntityHelper helper;

    @Autowired
    private TownRepository townRepository;

    private Town town;
    private User user;

    @BeforeEach
    void setUp() {
        town = helper.createTown();
        user = helper.createUser(town);
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
}