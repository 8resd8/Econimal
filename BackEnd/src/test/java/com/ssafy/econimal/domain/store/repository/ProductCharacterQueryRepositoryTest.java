package com.ssafy.econimal.domain.store.repository;

import static org.assertj.core.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.econimal.domain.store.dto.StoreDto;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.repository.UserRepository;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
@Sql(scripts = "classpath:test-data.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
class ProductCharacterQueryRepositoryTest {

	@Autowired
	private ProductCharacterQueryRepository productCharacterQueryRepository;

	@Autowired
	private UserRepository userRepository;

	@Test
	void 캐릭터상점항목조회() {
		User user = userRepository.findById(1L).get();
		assertThat(user).isNotNull();

		List<StoreDto> charactersStore = productCharacterQueryRepository.findAllCharactersStore(user);

		assertThat(charactersStore.size()).isEqualTo(4);
		long ownedCount = charactersStore.stream()
			.filter(StoreDto::owned)
			.count();
		assertThat(ownedCount).isEqualTo(3);
	}
}