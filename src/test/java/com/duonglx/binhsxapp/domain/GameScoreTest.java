package com.duonglx.binhsxapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.duonglx.binhsxapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class GameScoreTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(GameScore.class);
        GameScore gameScore1 = new GameScore();
        gameScore1.setId(1L);
        GameScore gameScore2 = new GameScore();
        gameScore2.setId(gameScore1.getId());
        assertThat(gameScore1).isEqualTo(gameScore2);
        gameScore2.setId(2L);
        assertThat(gameScore1).isNotEqualTo(gameScore2);
        gameScore1.setId(null);
        assertThat(gameScore1).isNotEqualTo(gameScore2);
    }
}
