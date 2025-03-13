package com.ssafy.econimal.global.insertdata;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.ssafy.econimal.domain.town.entity.Facility;
import com.ssafy.econimal.domain.town.entity.Infrastructure;
import com.ssafy.econimal.domain.town.entity.Town;
import com.ssafy.econimal.domain.town.repository.FacilityRepository;
import com.ssafy.econimal.domain.town.repository.InfrastructureRepository;
import com.ssafy.econimal.domain.town.repository.TownRepository;
import com.ssafy.econimal.global.common.enums.EcoType;
import com.ssafy.econimal.global.common.enums.FacilityType;

@SpringBootTest
public class InsertInfrastructure {

	@Autowired
	private InfrastructureRepository infraRepository;

	@Autowired
	private TownRepository townRepository;

	@Autowired
	private FacilityRepository facilityRepository;

	@Test
	@Disabled
	void 인프라등록() {
		가스저장();
		물저장();
		전기저장();
		법원저장();
	}

	private void 가스저장() {
		Town town = Town.builder().name("0지").build();
		townRepository.save(town);

		Facility facility = Facility.builder()
			.ecoType(EcoType.GAS.name())
			.facilityName(FacilityType.GAS.name())
			.build();

		facilityRepository.save(facility);

		Infrastructure infra1 = Infrastructure.builder()
			.facility(facility)
			.isClean(false)
			.town(town)
			.build();

		infraRepository.save(infra1);
	}

	private void 법원저장() {
		Town town = Town.builder().name("0지").build();
		townRepository.save(town);

		Facility facility = Facility.builder()
			.ecoType(EcoType.COURT.name())
			.facilityName(FacilityType.COURT.name())
			.build();

		facilityRepository.save(facility);

		Infrastructure infra = Infrastructure.builder()
			.facility(facility)
			.isClean(false)
			.town(town)
			.build();

		infraRepository.save(infra);
	}

	private void 전기저장() {
		Town town = Town.builder().name("0지").build();
		townRepository.save(town);

		Facility facility = Facility.builder()
			.ecoType(EcoType.ELECTRICITY.name())
			.facilityName(FacilityType.ELECTRICITY.name())
			.build();

		facilityRepository.save(facility);

		Infrastructure infra = Infrastructure.builder()
			.facility(facility)
			.isClean(false)
			.town(town)
			.build();

		infraRepository.save(infra);
	}

	private void 물저장() {
		Town town = Town.builder().name("나는 물이좋아").build();
		townRepository.save(town);

		Facility facility = Facility.builder()
			.ecoType(EcoType.WATER.name())
			.facilityName(FacilityType.WATER.name())
			.build();

		facilityRepository.save(facility);

		Infrastructure infra = Infrastructure.builder()
			.facility(facility)
			.isClean(false)
			.town(town)
			.build();

		infraRepository.save(infra);
	}

}
