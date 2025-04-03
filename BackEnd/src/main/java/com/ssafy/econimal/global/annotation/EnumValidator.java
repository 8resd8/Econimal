package com.ssafy.econimal.global.annotation;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class EnumValidator implements ConstraintValidator<EnumValid, Enum<?>> {

	private Set<String> annotationValues;

	@Override
	public void initialize(EnumValid annotation) {
		annotationValues = Arrays.stream(annotation.enumClass().getEnumConstants())
			.map(Enum::name)
			.collect(Collectors.toSet());
	}

	@Override
	public boolean isValid(Enum<?> value, ConstraintValidatorContext context) {
		return value == null || annotationValues.contains(value.name());
	}

}
