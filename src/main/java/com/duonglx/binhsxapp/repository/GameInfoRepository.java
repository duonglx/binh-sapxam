package com.duonglx.binhsxapp.repository;

import com.duonglx.binhsxapp.domain.GameInfo;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the GameInfo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GameInfoRepository extends JpaRepository<GameInfo, Long> {}
