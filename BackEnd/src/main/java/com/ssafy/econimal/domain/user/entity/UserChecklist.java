package com.ssafy.econimal.domain.user.entity;

import java.time.LocalDateTime;

import com.ssafy.econimal.domain.checklist.entity.Checklist;
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
@Table(name = "user_checklist")
public class UserChecklist extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_checklist_id")
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "checklist_id", nullable = false)
	private Checklist checklist;

	@Column(name = "is_complete", nullable = false)
	private boolean isComplete = false;

	@Column(name = "completion_date")
	private LocalDateTime completionDate;

	@Builder
	public UserChecklist(User user, Checklist checklist, boolean isComplete, LocalDateTime completionDate) {
		this.user = user;
		this.checklist = checklist;
		this.isComplete = isComplete;
		this.completionDate = completionDate;
	}
}