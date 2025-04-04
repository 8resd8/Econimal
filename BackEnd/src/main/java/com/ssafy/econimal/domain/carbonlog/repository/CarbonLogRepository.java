package com.ssafy.econimal.domain.carbonlog.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.econimal.domain.carbonlog.entity.CarbonLog;

public interface CarbonLogRepository extends JpaRepository<CarbonLog, Long> {

	@Query("select sum(cl.carbonQuantity) from CarbonLog cl "
		+ "join InfrastructureEvent ie on cl.infrastructureEvent.id = ie.id "
		+ "join Infrastructure i on ie.infrastructure.id = i.id "
		+ "join Facility f on i.facility.id = f.id "
		+ "where cl.user.id = :userId "
		+ "and f.ecoType != 'COURT'")
	Long getUserCarbonTotal(@Param("userId") Long userId);
}
