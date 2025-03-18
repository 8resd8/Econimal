package com.ssafy.econimal.domain.character.dto;

public record UserCharacterDto(
	Long userCharacterId,
	String characterName,
	String summary
){
}
