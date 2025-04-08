package com.ssafy.econimal.domain.auth.service;

import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.econimal.domain.auth.dto.request.EmailDuplicationRequest;
import com.ssafy.econimal.domain.auth.dto.request.SignupRequest;
import com.ssafy.econimal.domain.auth.dto.response.EmailDuplicationResponse;
import com.ssafy.econimal.domain.auth.util.AuthValidator;
import com.ssafy.econimal.domain.character.entity.Character;
import com.ssafy.econimal.domain.character.repository.CharacterRepository;
import com.ssafy.econimal.domain.checklist.entity.Checklist;
import com.ssafy.econimal.domain.checklist.util.ChecklistRandomUtil;
import com.ssafy.econimal.domain.product.entity.Product;
import com.ssafy.econimal.domain.product.repository.ProductRepository;
import com.ssafy.econimal.domain.town.entity.Facility;
import com.ssafy.econimal.domain.town.entity.Infrastructure;
import com.ssafy.econimal.domain.town.entity.Town;
import com.ssafy.econimal.domain.town.repository.FacilityRepository;
import com.ssafy.econimal.domain.town.repository.InfrastructureRepository;
import com.ssafy.econimal.domain.town.repository.TownRepository;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.entity.UserBackground;
import com.ssafy.econimal.domain.user.entity.UserCharacter;
import com.ssafy.econimal.domain.user.entity.UserChecklist;
import com.ssafy.econimal.domain.user.repository.UserBackgroundRepository;
import com.ssafy.econimal.domain.user.repository.UserCharacterRepository;
import com.ssafy.econimal.domain.user.repository.UserChecklistRepository;
import com.ssafy.econimal.domain.user.repository.UserRepository;

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
	private final ProductRepository productRepository;
	private final UserBackgroundRepository userBackgroundRepository;

	public User signup(SignupRequest request) {
		validator.validateSignUpUser(request);

		String encodedPassword = encoder.encode(request.password1());

		// 마을 생성
		Town town = Town.createTown(request.name());
		townRepository.save(town);

		User user = User.createUser(town, request.email(), request.name(),
			request.birth(), request.nickname(),
			encodedPassword, request.userType());
		User saveUser = userRepository.save(user);

		// UserCharacter 생성
		List<Character> originalCharacters = characterRepository.findByOriginalIsTrue();
		for (Character character : originalCharacters) {
			UserCharacter userCharacter = UserCharacter.createUserCharacter(user, character);
			userCharacterRepository.save(userCharacter);
		}

		// UserBackground 생성
		List<Product> freeProduct = productRepository.findByFreeProduct();
		for (Product product : freeProduct) {
			UserBackground userBackground = UserBackground.createUserBackground(user, product, product.getName());
			userBackgroundRepository.save(userBackground);
		}

		// 체크리스트 생성
		List<Checklist> randomChecklists = checklistRandomUtil.getRandomChecklistPerDifficulty();
		for (Checklist checklist : randomChecklists) {
			UserChecklist userChecklist = UserChecklist.createUserChecklist(user, checklist);
			userChecklistRepository.save(userChecklist);
		}

		// Facility에 있는 모든 시설에 대해 Infrastructure 생성
		List<Facility> facilities = facilityRepository.findAll();
		for (Facility facility : facilities) {
			Infrastructure infra = Infrastructure.createInfra(town, facility);
			infrastructureRepository.save(infra);
		}

		return saveUser;
	}

	public EmailDuplicationResponse checkDuplicationEmail(EmailDuplicationRequest request) {
		return new EmailDuplicationResponse(userRepository.existsByEmail(request.email()));
	}
}
