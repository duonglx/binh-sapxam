import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGameInfo } from '../game-info.model';

@Component({
  selector: 'jhi-game-info-detail',
  templateUrl: './game-info-detail.component.html',
})
export class GameInfoDetailComponent implements OnInit {
  gameInfo: IGameInfo | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ gameInfo }) => {
      this.gameInfo = gameInfo;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
