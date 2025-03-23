package com.ssafy.econimal.domain.user.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.ssafy.econimal.domain.town.entity.Town;
import com.ssafy.econimal.global.common.entity.BaseTimeEntity;
import com.ssafy.econimal.global.common.enums.UserType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "users")
@ToString(of = {"id", "email", "name", "nickname", "coin", "birth", "role", "lastLoginAt"})
public class User extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_id")
	private Long id;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "town_id", nullable = false)
	private Town town;

	@Column(name = "user_email", nullable = false, unique = true)
	private String email;

	@Column(name = "user_name", nullable = false)
	private String name;

	@Column(name = "birth", nullable = false)
	private LocalDate birth;

	@Column(name = "nickname")
	private String nickname;

	@Column(name = "password", nullable = false)
	private String password;

	@Column(name = "role", nullable = false, columnDefinition = "ENUM('USER', 'ADMIN') DEFAULT 'USER'")
	@Enumerated(EnumType.STRING)
	private UserType role;

	@Column(name = "coin", columnDefinition = "BIGINT DEFAULT 0")
	private long coin;

	@Column(name = "last_login_at")
	private LocalDateTime lastLoginAt;

	@Builder
	public User(Town town, String email, String name, LocalDate birth, String nickname, String password,
		UserType role) {
		this.town = town;
		this.email = email;
		this.name = name;
		this.birth = birth;
		if (nickname == null)
			nickname = name;
		this.nickname = nickname;
		this.password = password;
		this.role = role;
	}

	public void updateLastLoginAt() {
		this.lastLoginAt = LocalDateTime.now();
	}

	public void updateNickname(String nickname) {
		this.nickname = nickname;
	}

	public void updatePassword(String encodedPassword) {
		this.password = encodedPassword;
	}
}