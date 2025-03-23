package com.ssafy.econimal.domain.checklist.service;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.ssafy.econimal.domain.checklist.entity.Checklist;
import com.ssafy.econimal.domain.data.TestEntityHelper;
import com.ssafy.econimal.domain.town.entity.Town;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.entity.UserChecklist;
import com.ssafy.econimal.global.common.enums.DifficultyType;
import com.ssafy.econimal.global.common.enums.EcoType;

import jakarta.transaction.Transactional;

@SpringBootTest
@Transactional
public class ChecklistServiceTest {

	@Autowired
	private ChecklistService checklistService;

	@Autowired
	private TestEntityHelper helper;

	private Town town;
	private User user;
	private Checklist checklist;
	private UserChecklist userChecklist;

	@BeforeEach
	void setUp() {
		town = helper.createTown();
		user = helper.createUser(town);
		checklist = helper.createChecklist(DifficultyType.LOW, EcoType.ELECTRICITY);
		userChecklist = helper.createUserChecklist(user, checklist);
	}

	@Test
	void 체크리스트조회() {
		assertNotNull(checklistService.getUserChecklist(user));
	}
}
