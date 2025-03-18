package com.ssafy.econimal.domain.town.service;

import com.ssafy.econimal.domain.data.helper.TestEntityHelper;
import com.ssafy.econimal.domain.town.dto.TownNameUpdateDto;
import com.ssafy.econimal.domain.town.entity.Town;
import com.ssafy.econimal.domain.town.repository.TownRepository;
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

    @BeforeEach
    void setUp() {
        town = helper.createTown();
    }

    @Test
    void 도시_이름_변경() {
        // given
        String changeName = "도시 이름 변경";
        TownNameUpdateDto townNameUpdateDto = new TownNameUpdateDto(town.getId(), changeName);

        // when
        townService.updateTownName(townNameUpdateDto);

        // then
        Town newTown = townRepository.findById(town.getId()).orElse(null);
        assertNotNull(newTown);
        assertEquals(changeName, newTown.getName());
    }
}