package com.ssafy.econimal.domain.user.entity;

import com.ssafy.econimal.domain.product.entity.Product;
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
@Table(name = "user_background")
public class UserBackground extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_background_id")
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "product_id", nullable = false)
	private Product product;

	@Column(name = "is_main", nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
	private boolean isMain;

	@Column(name = "user_background_name")
	private String name;

	@Builder
	private UserBackground(User user, Product product, boolean isMain, String name) {
		this.user = user;
		this.product = product;
		this.isMain = isMain;
		this.name = name;
	}

	/**
	 * 기본 생성시 isMain = false
	 * @param user 만드는유저
	 * @param product 제품
	 * @param name 제품 이름
	 * @return
	 */
	public static UserBackground createUserBackground(User user, Product product, String name) {
		return UserBackground.builder()
			.user(user)
			.isMain(false)
			.product(product)
			.name(name)
			.build();
	}

	public void updateIsMain(boolean isMain) {
		this.isMain = isMain;
	}
}