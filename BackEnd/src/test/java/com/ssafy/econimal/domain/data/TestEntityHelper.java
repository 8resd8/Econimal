package com.ssafy.econimal.domain.data;

import org.springframework.stereotype.Component;

import com.ssafy.econimal.domain.character.entity.Character;
import com.ssafy.econimal.domain.checklist.entity.Checklist;
import com.ssafy.econimal.domain.data.sample.CharacterSample;
import com.ssafy.econimal.domain.data.sample.ChecklistSample;
import com.ssafy.econimal.domain.data.sample.EcoQuizSample;
import com.ssafy.econimal.domain.data.sample.FacilitySample;
import com.ssafy.econimal.domain.data.sample.InfrastructureEventSample;
import com.ssafy.econimal.domain.data.sample.InfrastructureSample;
import com.ssafy.econimal.domain.data.sample.ProductSample;
import com.ssafy.econimal.domain.data.sample.TownSample;
import com.ssafy.econimal.domain.data.sample.UserCharacterSample;
import com.ssafy.econimal.domain.data.sample.UserChecklistSample;
import com.ssafy.econimal.domain.data.sample.UserSample;
import com.ssafy.econimal.domain.product.entity.Product;
import com.ssafy.econimal.domain.town.entity.EcoQuiz;
import com.ssafy.econimal.domain.town.entity.Facility;
import com.ssafy.econimal.domain.town.entity.Infrastructure;
import com.ssafy.econimal.domain.town.entity.InfrastructureEvent;
import com.ssafy.econimal.domain.town.entity.Town;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.entity.UserCharacter;
import com.ssafy.econimal.domain.user.entity.UserChecklist;
import com.ssafy.econimal.global.common.enums.DifficultyType;
import com.ssafy.econimal.global.common.enums.EcoType;

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

	public Checklist createChecklist(DifficultyType difficulty, EcoType ecoType) {
		Checklist checklist = ChecklistSample.checklist(difficulty, ecoType);
		return persist(checklist);
	}

	public UserChecklist createUserChecklist(User user, Checklist checklist) {
		UserChecklist userChecklist = UserChecklistSample.userChecklist(user, checklist);
		return persist(userChecklist);
	}

	// TODO: Facility, EcoQuiz, Infra, InfraEvent persist
	public Facility createFacility() {
		Facility facility = FacilitySample.facility();
		return persist(facility);
	}

	public EcoQuiz createEcoQuiz(Facility facility) {
		EcoQuiz ecoQuiz = EcoQuizSample.ecoQuiz(facility);
		return persist(ecoQuiz);
	}

	public Infrastructure createInfrastructure(Town town, Facility facility, boolean isClean) {
		Infrastructure infrastructure = InfrastructureSample.infrastructure(town, facility, isClean);
		return persist(infrastructure);
	}

	public InfrastructureEvent createInfrastructureEvent(Infrastructure infrastructure, EcoQuiz ecoQuiz, boolean isActive) {
		InfrastructureEvent infrastructureEvent = InfrastructureEventSample.infrastructureEvent(infrastructure, ecoQuiz, isActive);
		return persist(infrastructureEvent);
	}

}
