package com.duonglx.binhsxapp.repository;

import com.duonglx.binhsxapp.domain.GameScore;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the GameScore entity.
 */
@Repository
public interface GameScoreRepository extends JpaRepository<GameScore, Long> {
    @Query("select gameScore from GameScore gameScore where gameScore.user.login = ?#{principal.username}")
    List<GameScore> findByUserIsCurrentUser();

    default Optional<GameScore> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<GameScore> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<GameScore> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct gameScore from GameScore gameScore left join fetch gameScore.user left join fetch gameScore.gameInfo",
        countQuery = "select count(distinct gameScore) from GameScore gameScore"
    )
    Page<GameScore> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct gameScore from GameScore gameScore left join fetch gameScore.user left join fetch gameScore.gameInfo")
    List<GameScore> findAllWithToOneRelationships();

    @Query(
        "select gameScore from GameScore gameScore left join fetch gameScore.user left join fetch gameScore.gameInfo where gameScore.id =:id"
    )
    Optional<GameScore> findOneWithToOneRelationships(@Param("id") Long id);
}
