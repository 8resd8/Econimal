package com.ssafy.econimal.domain.user.entity;

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
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "users")
public class User extends BaseTimeEntity {

	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_id")
	private Long id;

	@OneToOne(fetch = FetchType.LAZY)
	private Town town;

	@Column(name = "user_email")
	private String email;

	@Column(name = "user_name")
	private String name;

	@Column(name = "birth")
	private LocalDateTime birth;

	@Column(name = "nickname")
	private String nickname;

	@Column(name = "password")
	private String password;

	@Column(name = "is_admin")
	@Enumerated(EnumType.STRING)
	private UserType role;

	@Column(name = "coin")
	private long coin;

	@Column(name = "last_login_at")
	private LocalDateTime lastLoginAt;

}
