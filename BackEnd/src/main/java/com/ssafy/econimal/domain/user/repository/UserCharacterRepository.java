package com.ssafy.econimal.domain.user.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.econimal.domain.character.dto.UserCharacterDetailDto;
import com.ssafy.econimal.domain.character.dto.UserCharacterDto;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.entity.UserCharacter;

public interface UserCharacterRepository extends JpaRepository<UserCharacter, Long> {

	List<UserCharacter> findByUser(User user);

	// 유저가 보유한 캐릭터 목록 조회(id, 이름, summary)
	@Query("select new com.ssafy.econimal.domain.character.dto.UserCharacterDto(uc.id, uc.character.name, uc.character.summary) from UserCharacter uc where uc.user = :user")
	List<UserCharacterDto> findCharacterDtoByUser(User user);

	// 유저가 보유한 캐릭터 상세 조회
	@Query("select new com.ssafy.econimal.domain.character.dto.UserCharacterDetailDto(uc.id, uc.character.name, uc.character.summary, uc.character.description) from UserCharacter uc where uc.user = :user and uc.character.id = :characterId")
	UserCharacterDetailDto findCharacterDetailByUser(@Param("user") User user, @Param("characterId") Long characterId);

	// 캐릭터 대표(메인) 찾기
	@Query("select uc from UserCharacter uc where uc.user = :user and uc.isMain = true")
	Optional<UserCharacter> findByUserAndMainIsTrue(@Param("user") User user);

	// Id로 UserCharacter 찾기
	Optional<UserCharacter> findByUserAndId(User user, Long userCharacterId);

	// Id 목록 찾기
	@Query("select uc.id from UserCharacter uc where uc.user = :user")
	List<Long> findUserBackgroundIds(User user);
}
