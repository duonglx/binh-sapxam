package com.duonglx.binhsxapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import javax.validation.constraints.*;
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

    @NotNull
    @Column(name = "g_datetime", nullable = false)
    private ZonedDateTime gDatetime;

    @NotNull
    @Size(min = 3)
    @Column(name = "g_desc", nullable = false)
    private String gDesc;

    @Column(name = "player_name_1")
    private String playerName1;

    @Column(name = "player_name_2")
    private String playerName2;

    @Column(name = "player_name_3")
    private String playerName3;

    @Column(name = "player_name_4")
    private String playerName4;

    @ManyToOne(optional = false)
    @NotNull
    private User user;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user" }, allowSetters = true)
    private GameScore gameScore;

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

    public ZonedDateTime getgDatetime() {
        return this.gDatetime;
    }

    public GameInfo gDatetime(ZonedDateTime gDatetime) {
        this.setgDatetime(gDatetime);
        return this;
    }

    public void setgDatetime(ZonedDateTime gDatetime) {
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

    public String getPlayerName1() {
        return this.playerName1;
    }

    public GameInfo playerName1(String playerName1) {
        this.setPlayerName1(playerName1);
        return this;
    }

    public void setPlayerName1(String playerName1) {
        this.playerName1 = playerName1;
    }

    public String getPlayerName2() {
        return this.playerName2;
    }

    public GameInfo playerName2(String playerName2) {
        this.setPlayerName2(playerName2);
        return this;
    }

    public void setPlayerName2(String playerName2) {
        this.playerName2 = playerName2;
    }

    public String getPlayerName3() {
        return this.playerName3;
    }

    public GameInfo playerName3(String playerName3) {
        this.setPlayerName3(playerName3);
        return this;
    }

    public void setPlayerName3(String playerName3) {
        this.playerName3 = playerName3;
    }

    public String getPlayerName4() {
        return this.playerName4;
    }

    public GameInfo playerName4(String playerName4) {
        this.setPlayerName4(playerName4);
        return this;
    }

    public void setPlayerName4(String playerName4) {
        this.playerName4 = playerName4;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public GameInfo user(User user) {
        this.setUser(user);
        return this;
    }

    public GameScore getGameScore() {
        return this.gameScore;
    }

    public void setGameScore(GameScore gameScore) {
        this.gameScore = gameScore;
    }

    public GameInfo gameScore(GameScore gameScore) {
        this.setGameScore(gameScore);
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
            ", gDatetime='" + getgDatetime() + "'" +
            ", gDesc='" + getgDesc() + "'" +
            ", playerName1='" + getPlayerName1() + "'" +
            ", playerName2='" + getPlayerName2() + "'" +
            ", playerName3='" + getPlayerName3() + "'" +
            ", playerName4='" + getPlayerName4() + "'" +
            "}";
    }
}
