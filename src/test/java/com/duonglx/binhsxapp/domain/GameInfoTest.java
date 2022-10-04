package com.duonglx.binhsxapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.duonglx.binhsxapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class GameInfoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(GameInfo.class);
        GameInfo gameInfo1 = new GameInfo();
        gameInfo1.setId(1L);
        GameInfo gameInfo2 = new GameInfo();
        gameInfo2.setId(gameInfo1.getId());
        assertThat(gameInfo1).isEqualTo(gameInfo2);
        gameInfo2.setId(2L);
        assertThat(gameInfo1).isNotEqualTo(gameInfo2);
        gameInfo1.setId(null);
        assertThat(gameInfo1).isNotEqualTo(gameInfo2);
    }
}
