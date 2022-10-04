package com.duonglx.binhsxapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A GameInfo.
 */
@Entity
@Table(name = "game_info")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class GameInfo implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "g_no")
    private Long gNo;

    @Column(name = "g_datetime")
    private Instant gDatetime;

    @Column(name = "g_desc")
    private String gDesc;

    @Column(name = "player_1")
    private String player1;

    @Column(name = "player_2")
    private String player2;

    @Column(name = "player_3")
    private String player3;

    @Column(name = "player_4")
    private String player4;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "created_date")
    private Instant createdDate;

    @OneToMany(mappedBy = "gameInfo")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "gameInfo" }, allowSetters = true)
    private Set<GameScore> gameScores = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public GameInfo id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getgNo() {
        return this.gNo;
    }

    public GameInfo gNo(Long gNo) {
        this.setgNo(gNo);
        return this;
    }

    public void setgNo(Long gNo) {
        this.gNo = gNo;
    }

    public Instant getgDatetime() {
        return this.gDatetime;
    }

    public GameInfo gDatetime(Instant gDatetime) {
        this.setgDatetime(gDatetime);
        return this;
    }

    public void setgDatetime(Instant gDatetime) {
        this.gDatetime = gDatetime;
    }

    public String getgDesc() {
        return this.gDesc;
    }

    public GameInfo gDesc(String gDesc) {
        this.setgDesc(gDesc);
        return this;
    }

    public void setgDesc(String gDesc) {
        this.gDesc = gDesc;
    }

    public String getPlayer1() {
        return this.player1;
    }

    public GameInfo player1(String player1) {
        this.setPlayer1(player1);
        return this;
    }

    public void setPlayer1(String player1) {
        this.player1 = player1;
    }

    public String getPlayer2() {
        return this.player2;
    }

    public GameInfo player2(String player2) {
        this.setPlayer2(player2);
        return this;
    }

    public void setPlayer2(String player2) {
        this.player2 = player2;
    }

    public String getPlayer3() {
        return this.player3;
    }

    public GameInfo player3(String player3) {
        this.setPlayer3(player3);
        return this;
    }

    public void setPlayer3(String player3) {
        this.player3 = player3;
    }

    public String getPlayer4() {
        return this.player4;
    }

    public GameInfo player4(String player4) {
        this.setPlayer4(player4);
        return this;
    }

    public void setPlayer4(String player4) {
        this.player4 = player4;
    }

    public String getCreatedBy() {
        return this.createdBy;
    }

    public GameInfo createdBy(String createdBy) {
        this.setCreatedBy(createdBy);
        return this;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public Instant getCreatedDate() {
        return this.createdDate;
    }

    public GameInfo createdDate(Instant createdDate) {
        this.setCreatedDate(createdDate);
        return this;
    }

    public void setCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
    }

    public Set<GameScore> getGameScores() {
        return this.gameScores;
    }

    public void setGameScores(Set<GameScore> gameScores) {
        if (this.gameScores != null) {
            this.gameScores.forEach(i -> i.setGameInfo(null));
        }
        if (gameScores != null) {
            gameScores.forEach(i -> i.setGameInfo(this));
        }
        this.gameScores = gameScores;
    }

    public GameInfo gameScores(Set<GameScore> gameScores) {
        this.setGameScores(gameScores);
        return this;
    }

    public GameInfo addGameScore(GameScore gameScore) {
        this.gameScores.add(gameScore);
        gameScore.setGameInfo(this);
        return this;
    }

    public GameInfo removeGameScore(GameScore gameScore) {
        this.gameScores.remove(gameScore);
        gameScore.setGameInfo(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof GameInfo)) {
            return false;
        }
        return id != null && id.equals(((GameInfo) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "GameInfo{" +
            "id=" + getId() +
            ", gNo=" + getgNo() +
            ", gDatetime='" + getgDatetime() + "'" +
            ", gDesc='" + getgDesc() + "'" +
            ", player1='" + getPlayer1() + "'" +
            ", player2='" + getPlayer2() + "'" +
            ", player3='" + getPlayer3() + "'" +
            ", player4='" + getPlayer4() + "'" +
            ", createdBy='" + getCreatedBy() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            "}";
    }
}
