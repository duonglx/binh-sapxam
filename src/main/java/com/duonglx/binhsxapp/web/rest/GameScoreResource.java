package com.duonglx.binhsxapp.web.rest;

import com.duonglx.binhsxapp.domain.GameScore;
import com.duonglx.binhsxapp.repository.GameScoreRepository;
import com.duonglx.binhsxapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.duonglx.binhsxapp.domain.GameScore}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class GameScoreResource {

    private final Logger log = LoggerFactory.getLogger(GameScoreResource.class);

    private static final String ENTITY_NAME = "gameScore";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GameScoreRepository gameScoreRepository;

    public GameScoreResource(GameScoreRepository gameScoreRepository) {
        this.gameScoreRepository = gameScoreRepository;
    }

    /**
     * {@code POST  /game-scores} : Create a new gameScore.
     *
     * @param gameScore the gameScore to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new gameScore, or with status {@code 400 (Bad Request)} if the gameScore has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/game-scores")
    public ResponseEntity<GameScore> createGameScore(@RequestBody GameScore gameScore) throws URISyntaxException {
        log.debug("REST request to save GameScore : {}", gameScore);
        if (gameScore.getId() != null) {
            throw new BadRequestAlertException("A new gameScore cannot already have an ID", ENTITY_NAME, "idexists");
        }
        GameScore result = gameScoreRepository.save(gameScore);
        return ResponseEntity
            .created(new URI("/api/game-scores/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /game-scores/:id} : Updates an existing gameScore.
     *
     * @param id the id of the gameScore to save.
     * @param gameScore the gameScore to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated gameScore,
     * or with status {@code 400 (Bad Request)} if the gameScore is not valid,
     * or with status {@code 500 (Internal Server Error)} if the gameScore couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/game-scores/{id}")
    public ResponseEntity<GameScore> updateGameScore(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody GameScore gameScore
    ) throws URISyntaxException {
        log.debug("REST request to update GameScore : {}, {}", id, gameScore);
        if (gameScore.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, gameScore.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!gameScoreRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        GameScore result = gameScoreRepository.save(gameScore);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, gameScore.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /game-scores/:id} : Partial updates given fields of an existing gameScore, field will ignore if it is null
     *
     * @param id the id of the gameScore to save.
     * @param gameScore the gameScore to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated gameScore,
     * or with status {@code 400 (Bad Request)} if the gameScore is not valid,
     * or with status {@code 404 (Not Found)} if the gameScore is not found,
     * or with status {@code 500 (Internal Server Error)} if the gameScore couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/game-scores/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<GameScore> partialUpdateGameScore(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody GameScore gameScore
    ) throws URISyntaxException {
        log.debug("REST request to partial update GameScore partially : {}, {}", id, gameScore);
        if (gameScore.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, gameScore.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!gameScoreRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<GameScore> result = gameScoreRepository
            .findById(gameScore.getId())
            .map(existingGameScore -> {
                if (gameScore.getgNo() != null) {
                    existingGameScore.setgNo(gameScore.getgNo());
                }
                if (gameScore.getPlayerScore1() != null) {
                    existingGameScore.setPlayerScore1(gameScore.getPlayerScore1());
                }
                if (gameScore.getPlayerScore2() != null) {
                    existingGameScore.setPlayerScore2(gameScore.getPlayerScore2());
                }
                if (gameScore.getPlayerScore3() != null) {
                    existingGameScore.setPlayerScore3(gameScore.getPlayerScore3());
                }
                if (gameScore.getPlayerScore4() != null) {
                    existingGameScore.setPlayerScore4(gameScore.getPlayerScore4());
                }
                if (gameScore.getCreatedDate() != null) {
                    existingGameScore.setCreatedDate(gameScore.getCreatedDate());
                }

                return existingGameScore;
            })
            .map(gameScoreRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, gameScore.getId().toString())
        );
    }

    /**
     * {@code GET  /game-scores} : get all the gameScores.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of gameScores in body.
     */
    @GetMapping("/game-scores")
    public ResponseEntity<List<GameScore>> getAllGameScores(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of GameScores");
        Page<GameScore> page = gameScoreRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /game-scores/:id} : get the "id" gameScore.
     *
     * @param id the id of the gameScore to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the gameScore, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/game-scores/{id}")
    public ResponseEntity<GameScore> getGameScore(@PathVariable Long id) {
        log.debug("REST request to get GameScore : {}", id);
        Optional<GameScore> gameScore = gameScoreRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(gameScore);
    }

    /**
     * {@code DELETE  /game-scores/:id} : delete the "id" gameScore.
     *
     * @param id the id of the gameScore to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/game-scores/{id}")
    public ResponseEntity<Void> deleteGameScore(@PathVariable Long id) {
        log.debug("REST request to delete GameScore : {}", id);
        gameScoreRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
