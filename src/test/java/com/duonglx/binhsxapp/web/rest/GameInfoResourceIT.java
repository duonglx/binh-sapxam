package com.duonglx.binhsxapp.web.rest;

import static com.duonglx.binhsxapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.duonglx.binhsxapp.IntegrationTest;
import com.duonglx.binhsxapp.domain.GameInfo;
import com.duonglx.binhsxapp.domain.User;
import com.duonglx.binhsxapp.repository.GameInfoRepository;
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
 * Integration tests for the {@link GameInfoResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class GameInfoResourceIT {

    private static final ZonedDateTime DEFAULT_G_DATETIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_G_DATETIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_G_DESC = "AAAAAAAAAA";
    private static final String UPDATED_G_DESC = "BBBBBBBBBB";

    private static final String DEFAULT_PLAYER_NAME_1 = "AAAAAAAAAA";
    private static final String UPDATED_PLAYER_NAME_1 = "BBBBBBBBBB";

    private static final String DEFAULT_PLAYER_NAME_2 = "AAAAAAAAAA";
    private static final String UPDATED_PLAYER_NAME_2 = "BBBBBBBBBB";

    private static final String DEFAULT_PLAYER_NAME_3 = "AAAAAAAAAA";
    private static final String UPDATED_PLAYER_NAME_3 = "BBBBBBBBBB";

    private static final String DEFAULT_PLAYER_NAME_4 = "AAAAAAAAAA";
    private static final String UPDATED_PLAYER_NAME_4 = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/game-infos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private GameInfoRepository gameInfoRepository;

    @Mock
    private GameInfoRepository gameInfoRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restGameInfoMockMvc;

    private GameInfo gameInfo;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GameInfo createEntity(EntityManager em) {
        GameInfo gameInfo = new GameInfo()
            .gDatetime(DEFAULT_G_DATETIME)
            .gDesc(DEFAULT_G_DESC)
            .playerName1(DEFAULT_PLAYER_NAME_1)
            .playerName2(DEFAULT_PLAYER_NAME_2)
            .playerName3(DEFAULT_PLAYER_NAME_3)
            .playerName4(DEFAULT_PLAYER_NAME_4);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        gameInfo.setUser(user);
        return gameInfo;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GameInfo createUpdatedEntity(EntityManager em) {
        GameInfo gameInfo = new GameInfo()
            .gDatetime(UPDATED_G_DATETIME)
            .gDesc(UPDATED_G_DESC)
            .playerName1(UPDATED_PLAYER_NAME_1)
            .playerName2(UPDATED_PLAYER_NAME_2)
            .playerName3(UPDATED_PLAYER_NAME_3)
            .playerName4(UPDATED_PLAYER_NAME_4);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        gameInfo.setUser(user);
        return gameInfo;
    }

    @BeforeEach
    public void initTest() {
        gameInfo = createEntity(em);
    }

    @Test
    @Transactional
    void createGameInfo() throws Exception {
        int databaseSizeBeforeCreate = gameInfoRepository.findAll().size();
        // Create the GameInfo
        restGameInfoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(gameInfo)))
            .andExpect(status().isCreated());

        // Validate the GameInfo in the database
        List<GameInfo> gameInfoList = gameInfoRepository.findAll();
        assertThat(gameInfoList).hasSize(databaseSizeBeforeCreate + 1);
        GameInfo testGameInfo = gameInfoList.get(gameInfoList.size() - 1);
        assertThat(testGameInfo.getgDatetime()).isEqualTo(DEFAULT_G_DATETIME);
        assertThat(testGameInfo.getgDesc()).isEqualTo(DEFAULT_G_DESC);
        assertThat(testGameInfo.getPlayerName1()).isEqualTo(DEFAULT_PLAYER_NAME_1);
        assertThat(testGameInfo.getPlayerName2()).isEqualTo(DEFAULT_PLAYER_NAME_2);
        assertThat(testGameInfo.getPlayerName3()).isEqualTo(DEFAULT_PLAYER_NAME_3);
        assertThat(testGameInfo.getPlayerName4()).isEqualTo(DEFAULT_PLAYER_NAME_4);
    }

    @Test
    @Transactional
    void createGameInfoWithExistingId() throws Exception {
        // Create the GameInfo with an existing ID
        gameInfo.setId(1L);

        int databaseSizeBeforeCreate = gameInfoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restGameInfoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(gameInfo)))
            .andExpect(status().isBadRequest());

        // Validate the GameInfo in the database
        List<GameInfo> gameInfoList = gameInfoRepository.findAll();
        assertThat(gameInfoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkgDatetimeIsRequired() throws Exception {
        int databaseSizeBeforeTest = gameInfoRepository.findAll().size();
        // set the field null
        gameInfo.setgDatetime(null);

        // Create the GameInfo, which fails.

        restGameInfoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(gameInfo)))
            .andExpect(status().isBadRequest());

        List<GameInfo> gameInfoList = gameInfoRepository.findAll();
        assertThat(gameInfoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkgDescIsRequired() throws Exception {
        int databaseSizeBeforeTest = gameInfoRepository.findAll().size();
        // set the field null
        gameInfo.setgDesc(null);

        // Create the GameInfo, which fails.

        restGameInfoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(gameInfo)))
            .andExpect(status().isBadRequest());

        List<GameInfo> gameInfoList = gameInfoRepository.findAll();
        assertThat(gameInfoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllGameInfos() throws Exception {
        // Initialize the database
        gameInfoRepository.saveAndFlush(gameInfo);

        // Get all the gameInfoList
        restGameInfoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(gameInfo.getId().intValue())))
            .andExpect(jsonPath("$.[*].gDatetime").value(hasItem(sameInstant(DEFAULT_G_DATETIME))))
            .andExpect(jsonPath("$.[*].gDesc").value(hasItem(DEFAULT_G_DESC)))
            .andExpect(jsonPath("$.[*].playerName1").value(hasItem(DEFAULT_PLAYER_NAME_1)))
            .andExpect(jsonPath("$.[*].playerName2").value(hasItem(DEFAULT_PLAYER_NAME_2)))
            .andExpect(jsonPath("$.[*].playerName3").value(hasItem(DEFAULT_PLAYER_NAME_3)))
            .andExpect(jsonPath("$.[*].playerName4").value(hasItem(DEFAULT_PLAYER_NAME_4)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllGameInfosWithEagerRelationshipsIsEnabled() throws Exception {
        when(gameInfoRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restGameInfoMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(gameInfoRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllGameInfosWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(gameInfoRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restGameInfoMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(gameInfoRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getGameInfo() throws Exception {
        // Initialize the database
        gameInfoRepository.saveAndFlush(gameInfo);

        // Get the gameInfo
        restGameInfoMockMvc
            .perform(get(ENTITY_API_URL_ID, gameInfo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(gameInfo.getId().intValue()))
            .andExpect(jsonPath("$.gDatetime").value(sameInstant(DEFAULT_G_DATETIME)))
            .andExpect(jsonPath("$.gDesc").value(DEFAULT_G_DESC))
            .andExpect(jsonPath("$.playerName1").value(DEFAULT_PLAYER_NAME_1))
            .andExpect(jsonPath("$.playerName2").value(DEFAULT_PLAYER_NAME_2))
            .andExpect(jsonPath("$.playerName3").value(DEFAULT_PLAYER_NAME_3))
            .andExpect(jsonPath("$.playerName4").value(DEFAULT_PLAYER_NAME_4));
    }

    @Test
    @Transactional
    void getNonExistingGameInfo() throws Exception {
        // Get the gameInfo
        restGameInfoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingGameInfo() throws Exception {
        // Initialize the database
        gameInfoRepository.saveAndFlush(gameInfo);

        int databaseSizeBeforeUpdate = gameInfoRepository.findAll().size();

        // Update the gameInfo
        GameInfo updatedGameInfo = gameInfoRepository.findById(gameInfo.getId()).get();
        // Disconnect from session so that the updates on updatedGameInfo are not directly saved in db
        em.detach(updatedGameInfo);
        updatedGameInfo
            .gDatetime(UPDATED_G_DATETIME)
            .gDesc(UPDATED_G_DESC)
            .playerName1(UPDATED_PLAYER_NAME_1)
            .playerName2(UPDATED_PLAYER_NAME_2)
            .playerName3(UPDATED_PLAYER_NAME_3)
            .playerName4(UPDATED_PLAYER_NAME_4);

        restGameInfoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedGameInfo.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedGameInfo))
            )
            .andExpect(status().isOk());

        // Validate the GameInfo in the database
        List<GameInfo> gameInfoList = gameInfoRepository.findAll();
        assertThat(gameInfoList).hasSize(databaseSizeBeforeUpdate);
        GameInfo testGameInfo = gameInfoList.get(gameInfoList.size() - 1);
        assertThat(testGameInfo.getgDatetime()).isEqualTo(UPDATED_G_DATETIME);
        assertThat(testGameInfo.getgDesc()).isEqualTo(UPDATED_G_DESC);
        assertThat(testGameInfo.getPlayerName1()).isEqualTo(UPDATED_PLAYER_NAME_1);
        assertThat(testGameInfo.getPlayerName2()).isEqualTo(UPDATED_PLAYER_NAME_2);
        assertThat(testGameInfo.getPlayerName3()).isEqualTo(UPDATED_PLAYER_NAME_3);
        assertThat(testGameInfo.getPlayerName4()).isEqualTo(UPDATED_PLAYER_NAME_4);
    }

    @Test
    @Transactional
    void putNonExistingGameInfo() throws Exception {
        int databaseSizeBeforeUpdate = gameInfoRepository.findAll().size();
        gameInfo.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGameInfoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, gameInfo.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(gameInfo))
            )
            .andExpect(status().isBadRequest());

        // Validate the GameInfo in the database
        List<GameInfo> gameInfoList = gameInfoRepository.findAll();
        assertThat(gameInfoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchGameInfo() throws Exception {
        int databaseSizeBeforeUpdate = gameInfoRepository.findAll().size();
        gameInfo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGameInfoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(gameInfo))
            )
            .andExpect(status().isBadRequest());

        // Validate the GameInfo in the database
        List<GameInfo> gameInfoList = gameInfoRepository.findAll();
        assertThat(gameInfoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamGameInfo() throws Exception {
        int databaseSizeBeforeUpdate = gameInfoRepository.findAll().size();
        gameInfo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGameInfoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(gameInfo)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the GameInfo in the database
        List<GameInfo> gameInfoList = gameInfoRepository.findAll();
        assertThat(gameInfoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateGameInfoWithPatch() throws Exception {
        // Initialize the database
        gameInfoRepository.saveAndFlush(gameInfo);

        int databaseSizeBeforeUpdate = gameInfoRepository.findAll().size();

        // Update the gameInfo using partial update
        GameInfo partialUpdatedGameInfo = new GameInfo();
        partialUpdatedGameInfo.setId(gameInfo.getId());

        partialUpdatedGameInfo
            .gDatetime(UPDATED_G_DATETIME)
            .gDesc(UPDATED_G_DESC)
            .playerName2(UPDATED_PLAYER_NAME_2)
            .playerName3(UPDATED_PLAYER_NAME_3)
            .playerName4(UPDATED_PLAYER_NAME_4);

        restGameInfoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGameInfo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGameInfo))
            )
            .andExpect(status().isOk());

        // Validate the GameInfo in the database
        List<GameInfo> gameInfoList = gameInfoRepository.findAll();
        assertThat(gameInfoList).hasSize(databaseSizeBeforeUpdate);
        GameInfo testGameInfo = gameInfoList.get(gameInfoList.size() - 1);
        assertThat(testGameInfo.getgDatetime()).isEqualTo(UPDATED_G_DATETIME);
        assertThat(testGameInfo.getgDesc()).isEqualTo(UPDATED_G_DESC);
        assertThat(testGameInfo.getPlayerName1()).isEqualTo(DEFAULT_PLAYER_NAME_1);
        assertThat(testGameInfo.getPlayerName2()).isEqualTo(UPDATED_PLAYER_NAME_2);
        assertThat(testGameInfo.getPlayerName3()).isEqualTo(UPDATED_PLAYER_NAME_3);
        assertThat(testGameInfo.getPlayerName4()).isEqualTo(UPDATED_PLAYER_NAME_4);
    }

    @Test
    @Transactional
    void fullUpdateGameInfoWithPatch() throws Exception {
        // Initialize the database
        gameInfoRepository.saveAndFlush(gameInfo);

        int databaseSizeBeforeUpdate = gameInfoRepository.findAll().size();

        // Update the gameInfo using partial update
        GameInfo partialUpdatedGameInfo = new GameInfo();
        partialUpdatedGameInfo.setId(gameInfo.getId());

        partialUpdatedGameInfo
            .gDatetime(UPDATED_G_DATETIME)
            .gDesc(UPDATED_G_DESC)
            .playerName1(UPDATED_PLAYER_NAME_1)
            .playerName2(UPDATED_PLAYER_NAME_2)
            .playerName3(UPDATED_PLAYER_NAME_3)
            .playerName4(UPDATED_PLAYER_NAME_4);

        restGameInfoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGameInfo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGameInfo))
            )
            .andExpect(status().isOk());

        // Validate the GameInfo in the database
        List<GameInfo> gameInfoList = gameInfoRepository.findAll();
        assertThat(gameInfoList).hasSize(databaseSizeBeforeUpdate);
        GameInfo testGameInfo = gameInfoList.get(gameInfoList.size() - 1);
        assertThat(testGameInfo.getgDatetime()).isEqualTo(UPDATED_G_DATETIME);
        assertThat(testGameInfo.getgDesc()).isEqualTo(UPDATED_G_DESC);
        assertThat(testGameInfo.getPlayerName1()).isEqualTo(UPDATED_PLAYER_NAME_1);
        assertThat(testGameInfo.getPlayerName2()).isEqualTo(UPDATED_PLAYER_NAME_2);
        assertThat(testGameInfo.getPlayerName3()).isEqualTo(UPDATED_PLAYER_NAME_3);
        assertThat(testGameInfo.getPlayerName4()).isEqualTo(UPDATED_PLAYER_NAME_4);
    }

    @Test
    @Transactional
    void patchNonExistingGameInfo() throws Exception {
        int databaseSizeBeforeUpdate = gameInfoRepository.findAll().size();
        gameInfo.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGameInfoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, gameInfo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(gameInfo))
            )
            .andExpect(status().isBadRequest());

        // Validate the GameInfo in the database
        List<GameInfo> gameInfoList = gameInfoRepository.findAll();
        assertThat(gameInfoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchGameInfo() throws Exception {
        int databaseSizeBeforeUpdate = gameInfoRepository.findAll().size();
        gameInfo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGameInfoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(gameInfo))
            )
            .andExpect(status().isBadRequest());

        // Validate the GameInfo in the database
        List<GameInfo> gameInfoList = gameInfoRepository.findAll();
        assertThat(gameInfoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamGameInfo() throws Exception {
        int databaseSizeBeforeUpdate = gameInfoRepository.findAll().size();
        gameInfo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGameInfoMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(gameInfo)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the GameInfo in the database
        List<GameInfo> gameInfoList = gameInfoRepository.findAll();
        assertThat(gameInfoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteGameInfo() throws Exception {
        // Initialize the database
        gameInfoRepository.saveAndFlush(gameInfo);

        int databaseSizeBeforeDelete = gameInfoRepository.findAll().size();

        // Delete the gameInfo
        restGameInfoMockMvc
            .perform(delete(ENTITY_API_URL_ID, gameInfo.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<GameInfo> gameInfoList = gameInfoRepository.findAll();
        assertThat(gameInfoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
