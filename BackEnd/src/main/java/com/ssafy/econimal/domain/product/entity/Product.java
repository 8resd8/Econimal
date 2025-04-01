package com.ssafy.econimal.domain.product.entity;

import java.util.ArrayList;
import java.util.List;

import com.ssafy.econimal.domain.character.entity.Character;
import com.ssafy.econimal.domain.user.entity.UserBackground;
import com.ssafy.econimal.global.common.entity.BaseTimeEntity;
import com.ssafy.econimal.global.common.enums.ProductType;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "product")
public class Product extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "product_id")
	private Long id;

	@Column(name = "product_type")
	@Enumerated(EnumType.STRING)
	private ProductType type;

	@Column(name = "price", nullable = false, columnDefinition = "INT DEFAULT 0 CHECK (price >= 0) COMMENT '상품 가격'")
	private int price;

	@Column(name = "product_name")
	private String name;

	@OneToOne(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
	private Character character;

	@OneToMany(mappedBy = "product") // 양방향 매핑 추가
	private List<UserBackground> userBackgrounds = new ArrayList<>();

	@Builder
	private Product(ProductType type, int price, String name) {
		this.type = type;
		this.price = price;
		this.name = name;
	}

	public static Product createProduct(ProductType type, int price, String productName) {
		return Product.builder()
			.type(type)
			.price(price)
			.name(productName)
			.build();
	}
}
