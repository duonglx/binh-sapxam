package com.duonglx.binhsxapp.web.rest;

import com.duonglx.binhsxapp.domain.GameInfo;
import com.duonglx.binhsxapp.repository.GameInfoRepository;
import com.duonglx.binhsxapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.duonglx.binhsxapp.domain.GameInfo}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class GameInfoResource {

    private final Logger log = LoggerFactory.getLogger(GameInfoResource.class);

    private static final String ENTITY_NAME = "gameInfo";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GameInfoRepository gameInfoRepository;

    public GameInfoResource(GameInfoRepository gameInfoRepository) {
        this.gameInfoRepository = gameInfoRepository;
    }

    /**
     * {@code POST  /game-infos} : Create a new gameInfo.
     *
     * @param gameInfo the gameInfo to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new gameInfo, or with status {@code 400 (Bad Request)} if the gameInfo has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/game-infos")
    public ResponseEntity<GameInfo> createGameInfo(@RequestBody GameInfo gameInfo) throws URISyntaxException {
        log.debug("REST request to save GameInfo : {}", gameInfo);
        if (gameInfo.getId() != null) {
            throw new BadRequestAlertException("A new gameInfo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        GameInfo result = gameInfoRepository.save(gameInfo);
        return ResponseEntity
            .created(new URI("/api/game-infos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /game-infos/:id} : Updates an existing gameInfo.
     *
     * @param id the id of the gameInfo to save.
     * @param gameInfo the gameInfo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated gameInfo,
     * or with status {@code 400 (Bad Request)} if the gameInfo is not valid,
     * or with status {@code 500 (Internal Server Error)} if the gameInfo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/game-infos/{id}")
    public ResponseEntity<GameInfo> updateGameInfo(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody GameInfo gameInfo
    ) throws URISyntaxException {
        log.debug("REST request to update GameInfo : {}, {}", id, gameInfo);
        if (gameInfo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, gameInfo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!gameInfoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        GameInfo result = gameInfoRepository.save(gameInfo);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, gameInfo.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /game-infos/:id} : Partial updates given fields of an existing gameInfo, field will ignore if it is null
     *
     * @param id the id of the gameInfo to save.
     * @param gameInfo the gameInfo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated gameInfo,
     * or with status {@code 400 (Bad Request)} if the gameInfo is not valid,
     * or with status {@code 404 (Not Found)} if the gameInfo is not found,
     * or with status {@code 500 (Internal Server Error)} if the gameInfo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/game-infos/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<GameInfo> partialUpdateGameInfo(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody GameInfo gameInfo
    ) throws URISyntaxException {
        log.debug("REST request to partial update GameInfo partially : {}, {}", id, gameInfo);
        if (gameInfo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, gameInfo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!gameInfoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<GameInfo> result = gameInfoRepository
            .findById(gameInfo.getId())
            .map(existingGameInfo -> {
                if (gameInfo.getgDatetime() != null) {
                    existingGameInfo.setgDatetime(gameInfo.getgDatetime());
                }
                if (gameInfo.getgDesc() != null) {
                    existingGameInfo.setgDesc(gameInfo.getgDesc());
                }
                if (gameInfo.getPlayerName1() != null) {
                    existingGameInfo.setPlayerName1(gameInfo.getPlayerName1());
                }
                if (gameInfo.getPlayerName2() != null) {
                    existingGameInfo.setPlayerName2(gameInfo.getPlayerName2());
                }
                if (gameInfo.getPlayerName3() != null) {
                    existingGameInfo.setPlayerName3(gameInfo.getPlayerName3());
                }
                if (gameInfo.getPlayerName4() != null) {
                    existingGameInfo.setPlayerName4(gameInfo.getPlayerName4());
                }
                if (gameInfo.getCreatedBy() != null) {
                    existingGameInfo.setCreatedBy(gameInfo.getCreatedBy());
                }

                return existingGameInfo;
            })
            .map(gameInfoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, gameInfo.getId().toString())
        );
    }

    /**
     * {@code GET  /game-infos} : get all the gameInfos.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of gameInfos in body.
     */
    @GetMapping("/game-infos")
    public List<GameInfo> getAllGameInfos(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all GameInfos");
        if (eagerload) {
            return gameInfoRepository.findAllWithEagerRelationships();
        } else {
            return gameInfoRepository.findAll();
        }
    }

    /**
     * {@code GET  /game-infos/:id} : get the "id" gameInfo.
     *
     * @param id the id of the gameInfo to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the gameInfo, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/game-infos/{id}")
    public ResponseEntity<GameInfo> getGameInfo(@PathVariable Long id) {
        log.debug("REST request to get GameInfo : {}", id);
        Optional<GameInfo> gameInfo = gameInfoRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(gameInfo);
    }

    /**
     * {@code DELETE  /game-infos/:id} : delete the "id" gameInfo.
     *
     * @param id the id of the gameInfo to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/game-infos/{id}")
    public ResponseEntity<Void> deleteGameInfo(@PathVariable Long id) {
        log.debug("REST request to delete GameInfo : {}", id);
        gameInfoRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
