import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { GameScoreFormService, GameScoreFormGroup } from './game-score-form.service';
import { IGameScore } from '../game-score.model';
import { GameScoreService } from '../service/game-score.service';
import { IGameInfo } from 'app/entities/game-info/game-info.model';
import { GameInfoService } from 'app/entities/game-info/service/game-info.service';

@Component({
  selector: 'jhi-game-score-update',
  templateUrl: './game-score-update.component.html',
})
export class GameScoreUpdateComponent implements OnInit {
  isSaving = false;
  gameScore: IGameScore | null = null;

  gameInfosSharedCollection: IGameInfo[] = [];

  editForm: GameScoreFormGroup = this.gameScoreFormService.createGameScoreFormGroup();

  constructor(
    protected gameScoreService: GameScoreService,
    protected gameScoreFormService: GameScoreFormService,
    protected gameInfoService: GameInfoService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareGameInfo = (o1: IGameInfo | null, o2: IGameInfo | null): boolean => this.gameInfoService.compareGameInfo(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ gameScore }) => {
      this.gameScore = gameScore;
      if (gameScore) {
        this.updateForm(gameScore);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const gameScore = this.gameScoreFormService.getGameScore(this.editForm);
    if (gameScore.id !== null) {
      this.subscribeToSaveResponse(this.gameScoreService.update(gameScore));
    } else {
      this.subscribeToSaveResponse(this.gameScoreService.create(gameScore));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGameScore>>): void {
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

  protected updateForm(gameScore: IGameScore): void {
    this.gameScore = gameScore;
    this.gameScoreFormService.resetForm(this.editForm, gameScore);

    this.gameInfosSharedCollection = this.gameInfoService.addGameInfoToCollectionIfMissing<IGameInfo>(
      this.gameInfosSharedCollection,
      gameScore.gameInfo
    );
  }

  protected loadRelationshipsOptions(): void {
    this.gameInfoService
      .query()
      .pipe(map((res: HttpResponse<IGameInfo[]>) => res.body ?? []))
      .pipe(
        map((gameInfos: IGameInfo[]) =>
          this.gameInfoService.addGameInfoToCollectionIfMissing<IGameInfo>(gameInfos, this.gameScore?.gameInfo)
        )
      )
      .subscribe((gameInfos: IGameInfo[]) => (this.gameInfosSharedCollection = gameInfos));
  }
}
