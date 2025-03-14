package com.ssafy.econimal.domain.auth.service;

import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.ssafy.econimal.domain.auth.dto.SignupRequest;
import com.ssafy.econimal.domain.auth.util.AuthValidator;
import com.ssafy.econimal.domain.character.entity.Character;
import com.ssafy.econimal.domain.character.repository.CharacterRepository;
import com.ssafy.econimal.domain.checklist.entity.Checklist;
import com.ssafy.econimal.domain.checklist.util.ChecklistRandomUtil;
import com.ssafy.econimal.domain.town.entity.Facility;
import com.ssafy.econimal.domain.town.entity.Infrastructure;
import com.ssafy.econimal.domain.town.entity.Town;
import com.ssafy.econimal.domain.town.repository.FacilityRepository;
import com.ssafy.econimal.domain.town.repository.InfrastructureRepository;
import com.ssafy.econimal.domain.town.repository.TownRepository;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.entity.UserCharacter;
import com.ssafy.econimal.domain.user.entity.UserChecklist;
import com.ssafy.econimal.domain.user.repository.UserCharacterRepository;
import com.ssafy.econimal.domain.user.repository.UserChecklistRepository;
import com.ssafy.econimal.domain.user.repository.UserRepository;
import com.ssafy.econimal.global.common.enums.ExpressionType;
import com.ssafy.econimal.global.exception.InvalidArgumentException;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class SignUpService {

	private final UserRepository userRepository;
	private final CharacterRepository characterRepository;
	private final ChecklistRandomUtil checklistRandomUtil;
	private final UserCharacterRepository userCharacterRepository;
	private final UserChecklistRepository userChecklistRepository;
	private final InfrastructureRepository infrastructureRepository;
	private final FacilityRepository facilityRepository;
	private final TownRepository townRepository;
	private final BCryptPasswordEncoder encoder;
	private final AuthValidator validator;

	public User signup(SignupRequest request) {
		validator.validateSignUpUser(request);

		String encodedPassword = encoder.encode(request.password1());

		// 마을 생성
		Town town = Town.builder()
			.name("이름없는 마을")
			.build();
		townRepository.save(town);

		User user = User.builder()
			.town(town)
			.email(request.email())
			.name(request.name())
			.birth(request.birth())
			.nickname(request.nickname())
			.password(encodedPassword)
			.role(request.userType())
			.build();

		User saveUser = userRepository.save(user);

		// UserCharacter 생성
		List<Character> originalCharacters = characterRepository.findByOriginalIsTrue();
		for (Character character : originalCharacters) {
			UserCharacter userCharacter = UserCharacter.builder()
				.user(user)
				.character(character)
				.level(1)
				.totalExp(0)
				.expression(ExpressionType.SADNESS)
				.isMain(false)
				.build();
			userCharacterRepository.save(userCharacter);
		}

		// 체크리스트 생성
		List<Checklist> randomChecklists = checklistRandomUtil.getRandomChecklistPerDifficulty();
		for (Checklist checklist : randomChecklists) {
			UserChecklist userChecklist = UserChecklist.builder()
				.user(user)
				.checklist(checklist)
				.isComplete(false)
				.build();
			userChecklistRepository.save(userChecklist);
		}

		// Facility에 있는 모든 시설에 대해 Infrastructure 생성
		List<Facility> facilities = facilityRepository.findAll();
		for (Facility facility : facilities) {
			Infrastructure infra = Infrastructure.builder()
				.town(town)
				.facility(facility)
				.isClean(false)
				.build();
			infrastructureRepository.save(infra);
		}

		return saveUser;
	}
}
