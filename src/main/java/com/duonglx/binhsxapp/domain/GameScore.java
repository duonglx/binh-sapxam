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

    @Column(name = "player_1")
    private String player1;

    @Column(name = "player_2")
    private String player2;

    @Column(name = "player_3")
    private String player3;

    @Column(name = "player_4")
    private String player4;

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

    public String getPlayer1() {
        return this.player1;
    }

    public GameScore player1(String player1) {
        this.setPlayer1(player1);
        return this;
    }

    public void setPlayer1(String player1) {
        this.player1 = player1;
    }

    public String getPlayer2() {
        return this.player2;
    }

    public GameScore player2(String player2) {
        this.setPlayer2(player2);
        return this;
    }

    public void setPlayer2(String player2) {
        this.player2 = player2;
    }

    public String getPlayer3() {
        return this.player3;
    }

    public GameScore player3(String player3) {
        this.setPlayer3(player3);
        return this;
    }

    public void setPlayer3(String player3) {
        this.player3 = player3;
    }

    public String getPlayer4() {
        return this.player4;
    }

    public GameScore player4(String player4) {
        this.setPlayer4(player4);
        return this;
    }

    public void setPlayer4(String player4) {
        this.player4 = player4;
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
            ", player1='" + getPlayer1() + "'" +
            ", player2='" + getPlayer2() + "'" +
            ", player3='" + getPlayer3() + "'" +
            ", player4='" + getPlayer4() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            "}";
    }
}
