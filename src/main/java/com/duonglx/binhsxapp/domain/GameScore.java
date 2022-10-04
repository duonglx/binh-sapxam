package com.duonglx.binhsxapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A GameScore.
 */
@Entity
@Table(name = "game_score")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class GameScore implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "g_no")
    private Long gNo;

    @Column(name = "player_score_1")
    private Long playerScore1;

    @Column(name = "player_score_2")
    private Long playerScore2;

    @Column(name = "player_score_3")
    private Long playerScore3;

    @Column(name = "player_score_4")
    private Long playerScore4;

    @Column(name = "created_date")
    private Instant createdDate;

    @ManyToOne
    @JsonIgnoreProperties(value = { "gameScores" }, allowSetters = true)
    private GameInfo gameInfo;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public GameScore id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getgNo() {
        return this.gNo;
    }

    public GameScore gNo(Long gNo) {
        this.setgNo(gNo);
        return this;
    }

    public void setgNo(Long gNo) {
        this.gNo = gNo;
    }

    public Long getPlayerScore1() {
        return this.playerScore1;
    }

    public GameScore playerScore1(Long playerScore1) {
        this.setPlayerScore1(playerScore1);
        return this;
    }

    public void setPlayerScore1(Long playerScore1) {
        this.playerScore1 = playerScore1;
    }

    public Long getPlayerScore2() {
        return this.playerScore2;
    }

    public GameScore playerScore2(Long playerScore2) {
        this.setPlayerScore2(playerScore2);
        return this;
    }

    public void setPlayerScore2(Long playerScore2) {
        this.playerScore2 = playerScore2;
    }

    public Long getPlayerScore3() {
        return this.playerScore3;
    }

    public GameScore playerScore3(Long playerScore3) {
        this.setPlayerScore3(playerScore3);
        return this;
    }

    public void setPlayerScore3(Long playerScore3) {
        this.playerScore3 = playerScore3;
    }

    public Long getPlayerScore4() {
        return this.playerScore4;
    }

    public GameScore playerScore4(Long playerScore4) {
        this.setPlayerScore4(playerScore4);
        return this;
    }

    public void setPlayerScore4(Long playerScore4) {
        this.playerScore4 = playerScore4;
    }

    public Instant getCreatedDate() {
        return this.createdDate;
    }

    public GameScore createdDate(Instant createdDate) {
        this.setCreatedDate(createdDate);
        return this;
    }

    public void setCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
    }

    public GameInfo getGameInfo() {
        return this.gameInfo;
    }

    public void setGameInfo(GameInfo gameInfo) {
        this.gameInfo = gameInfo;
    }

    public GameScore gameInfo(GameInfo gameInfo) {
        this.setGameInfo(gameInfo);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof GameScore)) {
            return false;
        }
        return id != null && id.equals(((GameScore) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "GameScore{" +
            "id=" + getId() +
            ", gNo=" + getgNo() +
            ", playerScore1=" + getPlayerScore1() +
            ", playerScore2=" + getPlayerScore2() +
            ", playerScore3=" + getPlayerScore3() +
            ", playerScore4=" + getPlayerScore4() +
            ", createdDate='" + getCreatedDate() + "'" +
            "}";
    }
}
