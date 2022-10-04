package com.duonglx.binhsxapp.repository;

import com.duonglx.binhsxapp.domain.GameInfo;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the GameInfo entity.
 */
@Repository
public interface GameInfoRepository extends JpaRepository<GameInfo, Long> {
    @Query("select gameInfo from GameInfo gameInfo where gameInfo.user.login = ?#{principal.username}")
    List<GameInfo> findByUserIsCurrentUser();

    default Optional<GameInfo> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<GameInfo> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<GameInfo> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct gameInfo from GameInfo gameInfo left join fetch gameInfo.user left join fetch gameInfo.gameScore",
        countQuery = "select count(distinct gameInfo) from GameInfo gameInfo"
    )
    Page<GameInfo> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct gameInfo from GameInfo gameInfo left join fetch gameInfo.user left join fetch gameInfo.gameScore")
    List<GameInfo> findAllWithToOneRelationships();

    @Query("select gameInfo from GameInfo gameInfo left join fetch gameInfo.user left join fetch gameInfo.gameScore where gameInfo.id =:id")
    Optional<GameInfo> findOneWithToOneRelationships(@Param("id") Long id);
}
