import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { GameScoreFormService, GameScoreFormGroup } from './game-score-form.service';
import { IGameScore } from '../game-score.model';
import { GameScoreService } from '../service/game-score.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-game-score-update',
  templateUrl: './game-score-update.component.html',
})
export class GameScoreUpdateComponent implements OnInit {
  isSaving = false;
  gameScore: IGameScore | null = null;

  usersSharedCollection: IUser[] = [];

  editForm: GameScoreFormGroup = this.gameScoreFormService.createGameScoreFormGroup();

  constructor(
    protected gameScoreService: GameScoreService,
    protected gameScoreFormService: GameScoreFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

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

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, gameScore.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.gameScore?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
