package com.duonglx.binhsxapp.web.rest;

import static com.duonglx.binhsxapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.duonglx.binhsxapp.IntegrationTest;
import com.duonglx.binhsxapp.domain.GameScore;
import com.duonglx.binhsxapp.domain.User;
import com.duonglx.binhsxapp.repository.GameScoreRepository;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link GameScoreResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class GameScoreResourceIT {

    private static final Integer DEFAULT_PLAYER_SCORE_1 = 2;
    private static final Integer UPDATED_PLAYER_SCORE_1 = 3;

    private static final Integer DEFAULT_PLAYER_SCORE_2 = 2;
    private static final Integer UPDATED_PLAYER_SCORE_2 = 3;

    private static final Integer DEFAULT_PLAYER_SCORE_3 = 2;
    private static final Integer UPDATED_PLAYER_SCORE_3 = 3;

    private static final Integer DEFAULT_PLAYER_SCORE_4 = 2;
    private static final Integer UPDATED_PLAYER_SCORE_4 = 3;

    private static final ZonedDateTime DEFAULT_CREATED_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/game-scores";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private GameScoreRepository gameScoreRepository;

    @Mock
    private GameScoreRepository gameScoreRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restGameScoreMockMvc;

    private GameScore gameScore;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GameScore createEntity(EntityManager em) {
        GameScore gameScore = new GameScore()
            .playerScore1(DEFAULT_PLAYER_SCORE_1)
            .playerScore2(DEFAULT_PLAYER_SCORE_2)
            .playerScore3(DEFAULT_PLAYER_SCORE_3)
            .playerScore4(DEFAULT_PLAYER_SCORE_4)
            .createdDate(DEFAULT_CREATED_DATE);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        gameScore.setUser(user);
        return gameScore;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GameScore createUpdatedEntity(EntityManager em) {
        GameScore gameScore = new GameScore()
            .playerScore1(UPDATED_PLAYER_SCORE_1)
            .playerScore2(UPDATED_PLAYER_SCORE_2)
            .playerScore3(UPDATED_PLAYER_SCORE_3)
            .playerScore4(UPDATED_PLAYER_SCORE_4)
            .createdDate(UPDATED_CREATED_DATE);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        gameScore.setUser(user);
        return gameScore;
    }

    @BeforeEach
    public void initTest() {
        gameScore = createEntity(em);
    }

    @Test
    @Transactional
    void createGameScore() throws Exception {
        int databaseSizeBeforeCreate = gameScoreRepository.findAll().size();
        // Create the GameScore
        restGameScoreMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(gameScore)))
            .andExpect(status().isCreated());

        // Validate the GameScore in the database
        List<GameScore> gameScoreList = gameScoreRepository.findAll();
        assertThat(gameScoreList).hasSize(databaseSizeBeforeCreate + 1);
        GameScore testGameScore = gameScoreList.get(gameScoreList.size() - 1);
        assertThat(testGameScore.getPlayerScore1()).isEqualTo(DEFAULT_PLAYER_SCORE_1);
        assertThat(testGameScore.getPlayerScore2()).isEqualTo(DEFAULT_PLAYER_SCORE_2);
        assertThat(testGameScore.getPlayerScore3()).isEqualTo(DEFAULT_PLAYER_SCORE_3);
        assertThat(testGameScore.getPlayerScore4()).isEqualTo(DEFAULT_PLAYER_SCORE_4);
        assertThat(testGameScore.getCreatedDate()).isEqualTo(DEFAULT_CREATED_DATE);
    }

    @Test
    @Transactional
    void createGameScoreWithExistingId() throws Exception {
        // Create the GameScore with an existing ID
        gameScore.setId(1L);

        int databaseSizeBeforeCreate = gameScoreRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restGameScoreMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(gameScore)))
            .andExpect(status().isBadRequest());

        // Validate the GameScore in the database
        List<GameScore> gameScoreList = gameScoreRepository.findAll();
        assertThat(gameScoreList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkCreatedDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = gameScoreRepository.findAll().size();
        // set the field null
        gameScore.setCreatedDate(null);

        // Create the GameScore, which fails.

        restGameScoreMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(gameScore)))
            .andExpect(status().isBadRequest());

        List<GameScore> gameScoreList = gameScoreRepository.findAll();
        assertThat(gameScoreList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllGameScores() throws Exception {
        // Initialize the database
        gameScoreRepository.saveAndFlush(gameScore);

        // Get all the gameScoreList
        restGameScoreMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(gameScore.getId().intValue())))
            .andExpect(jsonPath("$.[*].playerScore1").value(hasItem(DEFAULT_PLAYER_SCORE_1)))
            .andExpect(jsonPath("$.[*].playerScore2").value(hasItem(DEFAULT_PLAYER_SCORE_2)))
            .andExpect(jsonPath("$.[*].playerScore3").value(hasItem(DEFAULT_PLAYER_SCORE_3)))
            .andExpect(jsonPath("$.[*].playerScore4").value(hasItem(DEFAULT_PLAYER_SCORE_4)))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(sameInstant(DEFAULT_CREATED_DATE))));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllGameScoresWithEagerRelationshipsIsEnabled() throws Exception {
        when(gameScoreRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restGameScoreMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(gameScoreRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllGameScoresWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(gameScoreRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restGameScoreMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(gameScoreRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getGameScore() throws Exception {
        // Initialize the database
        gameScoreRepository.saveAndFlush(gameScore);

        // Get the gameScore
        restGameScoreMockMvc
            .perform(get(ENTITY_API_URL_ID, gameScore.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(gameScore.getId().intValue()))
            .andExpect(jsonPath("$.playerScore1").value(DEFAULT_PLAYER_SCORE_1))
            .andExpect(jsonPath("$.playerScore2").value(DEFAULT_PLAYER_SCORE_2))
            .andExpect(jsonPath("$.playerScore3").value(DEFAULT_PLAYER_SCORE_3))
            .andExpect(jsonPath("$.playerScore4").value(DEFAULT_PLAYER_SCORE_4))
            .andExpect(jsonPath("$.createdDate").value(sameInstant(DEFAULT_CREATED_DATE)));
    }

    @Test
    @Transactional
    void getNonExistingGameScore() throws Exception {
        // Get the gameScore
        restGameScoreMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingGameScore() throws Exception {
        // Initialize the database
        gameScoreRepository.saveAndFlush(gameScore);

        int databaseSizeBeforeUpdate = gameScoreRepository.findAll().size();

        // Update the gameScore
        GameScore updatedGameScore = gameScoreRepository.findById(gameScore.getId()).get();
        // Disconnect from session so that the updates on updatedGameScore are not directly saved in db
        em.detach(updatedGameScore);
        updatedGameScore
            .playerScore1(UPDATED_PLAYER_SCORE_1)
            .playerScore2(UPDATED_PLAYER_SCORE_2)
            .playerScore3(UPDATED_PLAYER_SCORE_3)
            .playerScore4(UPDATED_PLAYER_SCORE_4)
            .createdDate(UPDATED_CREATED_DATE);

        restGameScoreMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedGameScore.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedGameScore))
            )
            .andExpect(status().isOk());

        // Validate the GameScore in the database
        List<GameScore> gameScoreList = gameScoreRepository.findAll();
        assertThat(gameScoreList).hasSize(databaseSizeBeforeUpdate);
        GameScore testGameScore = gameScoreList.get(gameScoreList.size() - 1);
        assertThat(testGameScore.getPlayerScore1()).isEqualTo(UPDATED_PLAYER_SCORE_1);
        assertThat(testGameScore.getPlayerScore2()).isEqualTo(UPDATED_PLAYER_SCORE_2);
        assertThat(testGameScore.getPlayerScore3()).isEqualTo(UPDATED_PLAYER_SCORE_3);
        assertThat(testGameScore.getPlayerScore4()).isEqualTo(UPDATED_PLAYER_SCORE_4);
        assertThat(testGameScore.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingGameScore() throws Exception {
        int databaseSizeBeforeUpdate = gameScoreRepository.findAll().size();
        gameScore.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGameScoreMockMvc
            .perform(
                put(ENTITY_API_URL_ID, gameScore.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(gameScore))
            )
            .andExpect(status().isBadRequest());

        // Validate the GameScore in the database
        List<GameScore> gameScoreList = gameScoreRepository.findAll();
        assertThat(gameScoreList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchGameScore() throws Exception {
        int databaseSizeBeforeUpdate = gameScoreRepository.findAll().size();
        gameScore.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGameScoreMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(gameScore))
            )
            .andExpect(status().isBadRequest());

        // Validate the GameScore in the database
        List<GameScore> gameScoreList = gameScoreRepository.findAll();
        assertThat(gameScoreList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamGameScore() throws Exception {
        int databaseSizeBeforeUpdate = gameScoreRepository.findAll().size();
        gameScore.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGameScoreMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(gameScore)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the GameScore in the database
        List<GameScore> gameScoreList = gameScoreRepository.findAll();
        assertThat(gameScoreList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateGameScoreWithPatch() throws Exception {
        // Initialize the database
        gameScoreRepository.saveAndFlush(gameScore);

        int databaseSizeBeforeUpdate = gameScoreRepository.findAll().size();

        // Update the gameScore using partial update
        GameScore partialUpdatedGameScore = new GameScore();
        partialUpdatedGameScore.setId(gameScore.getId());

        partialUpdatedGameScore.playerScore2(UPDATED_PLAYER_SCORE_2).playerScore4(UPDATED_PLAYER_SCORE_4).createdDate(UPDATED_CREATED_DATE);

        restGameScoreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGameScore.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGameScore))
            )
            .andExpect(status().isOk());

        // Validate the GameScore in the database
        List<GameScore> gameScoreList = gameScoreRepository.findAll();
        assertThat(gameScoreList).hasSize(databaseSizeBeforeUpdate);
        GameScore testGameScore = gameScoreList.get(gameScoreList.size() - 1);
        assertThat(testGameScore.getPlayerScore1()).isEqualTo(DEFAULT_PLAYER_SCORE_1);
        assertThat(testGameScore.getPlayerScore2()).isEqualTo(UPDATED_PLAYER_SCORE_2);
        assertThat(testGameScore.getPlayerScore3()).isEqualTo(DEFAULT_PLAYER_SCORE_3);
        assertThat(testGameScore.getPlayerScore4()).isEqualTo(UPDATED_PLAYER_SCORE_4);
        assertThat(testGameScore.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
    }

    @Test
    @Transactional
    void fullUpdateGameScoreWithPatch() throws Exception {
        // Initialize the database
        gameScoreRepository.saveAndFlush(gameScore);

        int databaseSizeBeforeUpdate = gameScoreRepository.findAll().size();

        // Update the gameScore using partial update
        GameScore partialUpdatedGameScore = new GameScore();
        partialUpdatedGameScore.setId(gameScore.getId());

        partialUpdatedGameScore
            .playerScore1(UPDATED_PLAYER_SCORE_1)
            .playerScore2(UPDATED_PLAYER_SCORE_2)
            .playerScore3(UPDATED_PLAYER_SCORE_3)
            .playerScore4(UPDATED_PLAYER_SCORE_4)
            .createdDate(UPDATED_CREATED_DATE);

        restGameScoreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGameScore.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGameScore))
            )
            .andExpect(status().isOk());

        // Validate the GameScore in the database
        List<GameScore> gameScoreList = gameScoreRepository.findAll();
        assertThat(gameScoreList).hasSize(databaseSizeBeforeUpdate);
        GameScore testGameScore = gameScoreList.get(gameScoreList.size() - 1);
        assertThat(testGameScore.getPlayerScore1()).isEqualTo(UPDATED_PLAYER_SCORE_1);
        assertThat(testGameScore.getPlayerScore2()).isEqualTo(UPDATED_PLAYER_SCORE_2);
        assertThat(testGameScore.getPlayerScore3()).isEqualTo(UPDATED_PLAYER_SCORE_3);
        assertThat(testGameScore.getPlayerScore4()).isEqualTo(UPDATED_PLAYER_SCORE_4);
        assertThat(testGameScore.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingGameScore() throws Exception {
        int databaseSizeBeforeUpdate = gameScoreRepository.findAll().size();
        gameScore.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGameScoreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, gameScore.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(gameScore))
            )
            .andExpect(status().isBadRequest());

        // Validate the GameScore in the database
        List<GameScore> gameScoreList = gameScoreRepository.findAll();
        assertThat(gameScoreList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchGameScore() throws Exception {
        int databaseSizeBeforeUpdate = gameScoreRepository.findAll().size();
        gameScore.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGameScoreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(gameScore))
            )
            .andExpect(status().isBadRequest());

        // Validate the GameScore in the database
        List<GameScore> gameScoreList = gameScoreRepository.findAll();
        assertThat(gameScoreList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamGameScore() throws Exception {
        int databaseSizeBeforeUpdate = gameScoreRepository.findAll().size();
        gameScore.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGameScoreMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(gameScore))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the GameScore in the database
        List<GameScore> gameScoreList = gameScoreRepository.findAll();
        assertThat(gameScoreList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteGameScore() throws Exception {
        // Initialize the database
        gameScoreRepository.saveAndFlush(gameScore);

        int databaseSizeBeforeDelete = gameScoreRepository.findAll().size();

        // Delete the gameScore
        restGameScoreMockMvc
            .perform(delete(ENTITY_API_URL_ID, gameScore.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<GameScore> gameScoreList = gameScoreRepository.findAll();
        assertThat(gameScoreList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
