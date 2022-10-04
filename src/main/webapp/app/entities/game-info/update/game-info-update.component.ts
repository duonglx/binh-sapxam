import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { GameInfoFormService, GameInfoFormGroup } from './game-info-form.service';
import { IGameInfo } from '../game-info.model';
import { GameInfoService } from '../service/game-info.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IGameScore } from 'app/entities/game-score/game-score.model';
import { GameScoreService } from 'app/entities/game-score/service/game-score.service';

@Component({
  selector: 'jhi-game-info-update',
  templateUrl: './game-info-update.component.html',
})
export class GameInfoUpdateComponent implements OnInit {
  isSaving = false;
  gameInfo: IGameInfo | null = null;

  usersSharedCollection: IUser[] = [];
  gameScoresSharedCollection: IGameScore[] = [];

  editForm: GameInfoFormGroup = this.gameInfoFormService.createGameInfoFormGroup();

  constructor(
    protected gameInfoService: GameInfoService,
    protected gameInfoFormService: GameInfoFormService,
    protected userService: UserService,
    protected gameScoreService: GameScoreService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareGameScore = (o1: IGameScore | null, o2: IGameScore | null): boolean => this.gameScoreService.compareGameScore(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ gameInfo }) => {
      this.gameInfo = gameInfo;
      if (gameInfo) {
        this.updateForm(gameInfo);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const gameInfo = this.gameInfoFormService.getGameInfo(this.editForm);
    if (gameInfo.id !== null) {
      this.subscribeToSaveResponse(this.gameInfoService.update(gameInfo));
    } else {
      this.subscribeToSaveResponse(this.gameInfoService.create(gameInfo));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGameInfo>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(gameInfo: IGameInfo): void {
    this.gameInfo = gameInfo;
    this.gameInfoFormService.resetForm(this.editForm, gameInfo);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, gameInfo.user);
    this.gameScoresSharedCollection = this.gameScoreService.addGameScoreToCollectionIfMissing<IGameScore>(
      this.gameScoresSharedCollection,
      gameInfo.gameScore
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.gameInfo?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.gameScoreService
      .query()
      .pipe(map((res: HttpResponse<IGameScore[]>) => res.body ?? []))
      .pipe(
        map((gameScores: IGameScore[]) =>
          this.gameScoreService.addGameScoreToCollectionIfMissing<IGameScore>(gameScores, this.gameInfo?.gameScore)
        )
      )
      .subscribe((gameScores: IGameScore[]) => (this.gameScoresSharedCollection = gameScores));
  }
}
