package com.ssafy.econimal.insertdata;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.ssafy.econimal.domain.character.entity.Character;
import com.ssafy.econimal.domain.character.repository.CharacterRepository;
import com.ssafy.econimal.domain.store.entity.Product;
import com.ssafy.econimal.domain.store.repository.ProductRepository;
import com.ssafy.econimal.global.common.enums.CharacterType;
import com.ssafy.econimal.global.common.enums.ProductType;

@SpringBootTest
public class InsertCharacter {

	@Autowired
	private ProductRepository productRepository;
	@Autowired
	private CharacterRepository characterRepository;

	@Test
	@Disabled
	void 캐릭터등록() {
		// 부기부기 캐릭터
		Product product1 = Product.builder()
			.price(0)
			.type(ProductType.CHARACTER)
			.build();

		productRepository.save(product1);

		Character character1 = Character.builder()
			.product(product1)
			.name("부기부기")
			.type(CharacterType.OCEAN)
			.summary("바다에 사는 바다 거북이에요")
			.description("안녕, 나는 바다의 쓰레기를 줄여야 한다고 생각해. \n"
				+ "여러분 도와주세요!. 바다의 플라스틱 쓰레기 때문에 바다 거북이들이 위험해지고 있어요. 여러분이 저희를 함께 도와주면 바다의 깨끗한 환경을 만들 수 있을 거예요")
			.build();

		characterRepository.save(character1);


		// 팽글링스 캐릭터
		Product product2 = Product.builder()
			.price(0)
			.type(ProductType.CHARACTER)
			.build();

		productRepository.save(product2);

		Character character2 = Character.builder()
			.product(product2)
			.name("팽글링스")
			.type(CharacterType.POLAR)  // 극지 타입으로 가정
			.summary("남극에 사는 펭귄이에요")
			.description("안녕, 나는 수영보다 걷기를 좋아하는 펭귄이야. \n"
				+ "여러분 도와주세요!. 남극의 펭귄 친구들은 빙하가 녹아 힘들어하고 있어요. 여러분이 저희를 함께 도와주면 펭귄들이 행복하게 살 수 있는 환경을 만들 수 있을 거예요")
			.build();

		characterRepository.save(character2);

		// 호랭이 캐릭터
		Product product3 = Product.builder()
			.price(0)
			.type(ProductType.CHARACTER)
			.build();

		productRepository.save(product3);

		Character character3 = Character.builder()
			.product(product3)
			.name("호랭이")
			.type(CharacterType.FOREST)  // 산림 타입으로 가정
			.summary("산 속에 사는 호랑이에요")
			.description("안녕, 나는 숲의 보존이 중요하다고 생각해. \n"
				+ "여러분 도와주세요!. 산림 파괴로 인해 호랑이의 서식지가 줄어들고 있어요. 여러분이 저희를 함께 도와주면 호랑이들이 안전하게 살 수 있는 숲을 지킬 수 있을 거예요")
			.build();

		characterRepository.save(character3);
	}

}
