package com.ssafy.econimal.domain.user.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.entity.UserChecklist;

public interface UserChecklistRepository extends JpaRepository<UserChecklist, Long> {

	List<UserChecklist> findByUser(User user);

	Optional<UserChecklist> findByUserAndChecklistId(User user, Long checklistId);

	@Modifying
	@Query("UPDATE UserChecklist uc SET uc.isComplete = true WHERE uc.id = :checklistId")
	void completeChecklist(@Param("checklistId") Long checklistId);
}
