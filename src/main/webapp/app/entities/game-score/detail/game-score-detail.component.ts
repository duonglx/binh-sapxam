import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGameScore } from '../game-score.model';

@Component({
  selector: 'jhi-game-score-detail',
  templateUrl: './game-score-detail.component.html',
})
export class GameScoreDetailComponent implements OnInit {
  gameScore: IGameScore | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ gameScore }) => {
      this.gameScore = gameScore;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
