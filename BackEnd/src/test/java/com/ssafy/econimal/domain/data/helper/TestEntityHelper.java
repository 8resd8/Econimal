package com.ssafy.econimal.domain.data.helper;

import org.springframework.stereotype.Component;

import com.ssafy.econimal.domain.character.entity.Character;
import com.ssafy.econimal.domain.data.CharacterSample;
import com.ssafy.econimal.domain.data.ProductSample;
import com.ssafy.econimal.domain.data.TownSample;
import com.ssafy.econimal.domain.data.UserCharacterSample;
import com.ssafy.econimal.domain.data.UserSample;
import com.ssafy.econimal.domain.store.entity.Product;
import com.ssafy.econimal.domain.town.entity.Town;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.entity.UserCharacter;

import jakarta.persistence.EntityManager;

@Component
public class TestEntityHelper {

	private final EntityManager em;

	public TestEntityHelper(EntityManager em) {
		this.em = em;
	}

	public <T> T persist(T entity) {
		em.persist(entity);
		return entity;
	}

	public Town createTown() {
		Town town = TownSample.town();
		return persist(town);
	}

	public User createUser(Town town) {
		User user = UserSample.user(town);
		return persist(user);
	}

	public Product createProduct() {
		Product product = ProductSample.product();
		return persist(product);
	}

	public Character createCharacter(Product product) {
		Character character = CharacterSample.character(product);
		return persist(character);
	}

	public UserCharacter createUserCharacter(User user, Character character) {
		UserCharacter userCharacter = UserCharacterSample.userCharacter(user, character);
		return persist(userCharacter);
	}
}
