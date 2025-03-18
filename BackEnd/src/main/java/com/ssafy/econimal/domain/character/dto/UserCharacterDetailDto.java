package com.ssafy.econimal.domain.character.dto;

public record UserCharacterDetailDto(
	Long userCharacterId,
	String characterName,
	String summary,
	String description
){
}
