package com.ssafy.econimal.domain.user.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.entity.UserChecklist;

public interface UserChecklistRepository extends JpaRepository<UserChecklist, Long> {

	List<UserChecklist> findByUser(User user);
}
