package com.ssafy.econimal.domain.carbonlog.entity;

import java.math.BigDecimal;

import com.ssafy.econimal.domain.town.entity.EcoAnswer;
import com.ssafy.econimal.domain.town.entity.InfrastructureEvent;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.global.common.entity.BaseTimeEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "carbon_log")
public class CarbonLog extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "carbon_log_id")
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "infra_event_id", nullable = false)
	private InfrastructureEvent infrastructureEvent;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "eco_answer_id", nullable = false)
	private EcoAnswer ecoAnswer;

	@Column(name = "carbon_quantity", nullable = false, precision = 10, scale = 2, columnDefinition = "DECIMAL(10, 2) DEFAULT 0.00")
	private BigDecimal carbonQuantity = BigDecimal.valueOf(0.00);

	@Builder
	private CarbonLog(User user, InfrastructureEvent infrastructureEvent, EcoAnswer ecoAnswer, BigDecimal carbonQuantity) {
		this.user = user;
		this.infrastructureEvent = infrastructureEvent;
		this.ecoAnswer = ecoAnswer;
		this.carbonQuantity = carbonQuantity;
	}

	public static CarbonLog createCarbonLog(User user, InfrastructureEvent infrastructureEvent, EcoAnswer ecoAnswer, BigDecimal bigDecimal) {
		return CarbonLog.builder()
			.user(user)
			.infrastructureEvent(infrastructureEvent)
			.ecoAnswer(ecoAnswer)
			.carbonQuantity(bigDecimal)
			.build();
	}
}