package com.duonglx.binhsxapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import javax.validation.constraints.*;
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

    @Min(value = 2)
    @Max(value = 3)
    @Column(name = "player_score_1")
    private Integer playerScore1;

    @Min(value = 2)
    @Max(value = 3)
    @Column(name = "player_score_2")
    private Integer playerScore2;

    @Min(value = 2)
    @Max(value = 3)
    @Column(name = "player_score_3")
    private Integer playerScore3;

    @Min(value = 2)
    @Max(value = 3)
    @Column(name = "player_score_4")
    private Integer playerScore4;

    @NotNull
    @Column(name = "created_date", nullable = false)
    private ZonedDateTime createdDate;

    @ManyToOne(optional = false)
    @NotNull
    private User user;

    @ManyToOne
    @JsonIgnoreProperties(value = { "gameScores", "user" }, allowSetters = true)
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

    public Integer getPlayerScore1() {
        return this.playerScore1;
    }

    public GameScore playerScore1(Integer playerScore1) {
        this.setPlayerScore1(playerScore1);
        return this;
    }

    public void setPlayerScore1(Integer playerScore1) {
        this.playerScore1 = playerScore1;
    }

    public Integer getPlayerScore2() {
        return this.playerScore2;
    }

    public GameScore playerScore2(Integer playerScore2) {
        this.setPlayerScore2(playerScore2);
        return this;
    }

    public void setPlayerScore2(Integer playerScore2) {
        this.playerScore2 = playerScore2;
    }

    public Integer getPlayerScore3() {
        return this.playerScore3;
    }

    public GameScore playerScore3(Integer playerScore3) {
        this.setPlayerScore3(playerScore3);
        return this;
    }

    public void setPlayerScore3(Integer playerScore3) {
        this.playerScore3 = playerScore3;
    }

    public Integer getPlayerScore4() {
        return this.playerScore4;
    }

    public GameScore playerScore4(Integer playerScore4) {
        this.setPlayerScore4(playerScore4);
        return this;
    }

    public void setPlayerScore4(Integer playerScore4) {
        this.playerScore4 = playerScore4;
    }

    public ZonedDateTime getCreatedDate() {
        return this.createdDate;
    }

    public GameScore createdDate(ZonedDateTime createdDate) {
        this.setCreatedDate(createdDate);
        return this;
    }

    public void setCreatedDate(ZonedDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public GameScore user(User user) {
        this.setUser(user);
        return this;
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
            ", playerScore1=" + getPlayerScore1() +
            ", playerScore2=" + getPlayerScore2() +
            ", playerScore3=" + getPlayerScore3() +
            ", playerScore4=" + getPlayerScore4() +
            ", createdDate='" + getCreatedDate() + "'" +
            "}";
    }
}
