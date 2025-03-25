package com.ssafy.econimal.domain.town.util;

import java.util.List;

import org.springframework.stereotype.Component;

import com.ssafy.econimal.domain.town.entity.EcoQuiz;
import com.ssafy.econimal.domain.town.entity.Infrastructure;
import com.ssafy.econimal.domain.town.entity.InfrastructureEvent;
import com.ssafy.econimal.domain.town.entity.Town;
import com.ssafy.econimal.domain.town.repository.EcoQuizRepository;
import com.ssafy.econimal.domain.town.repository.InfrastructureEventRepository;
import com.ssafy.econimal.domain.town.repository.InfrastructureRepository;
import com.ssafy.econimal.global.exception.InvalidArgumentException;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class InfrastructureEventInitializer {

	private final InfrastructureRepository infrastructureRepository;
	private final InfrastructureEventRepository infrastructureEventRepository;
	private final EcoQuizRepository ecoQuizRepository;

	public void createMissingEventsForTown(Town town) {
		List<Infrastructure> infrastructures = infrastructureRepository.findByTown(town);

		for (Infrastructure infra : infrastructures) {
			boolean exists = infrastructureEventRepository.existsByInfrastructure(infra);

			if (!exists) {
				// EcoQuiz를 랜덤으로 하나 가져오기 (혹은 특정 방식 선택 가능)
				EcoQuiz quiz = ecoQuizRepository.findFirstByFacility(infra.getFacility())
					.orElseThrow(() -> new InvalidArgumentException("해당 시설에 대한 EcoQuiz가 존재하지 않습니다."));

				InfrastructureEvent event = InfrastructureEvent.builder()
					.infrastructure(infra)
					.ecoQuiz(quiz)
					.isActive(false) // 초기엔 비활성화로 시작
					.build();

				infrastructureEventRepository.save(event);
			}
		}
	}
}
