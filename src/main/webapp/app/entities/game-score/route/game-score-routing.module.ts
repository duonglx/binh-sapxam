import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { GameScoreComponent } from '../list/game-score.component';
import { GameScoreDetailComponent } from '../detail/game-score-detail.component';
import { GameScoreUpdateComponent } from '../update/game-score-update.component';
import { GameScoreRoutingResolveService } from './game-score-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const gameScoreRoute: Routes = [
  {
    path: '',
    component: GameScoreComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GameScoreDetailComponent,
    resolve: {
      gameScore: GameScoreRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GameScoreUpdateComponent,
    resolve: {
      gameScore: GameScoreRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GameScoreUpdateComponent,
    resolve: {
      gameScore: GameScoreRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(gameScoreRoute)],
  exports: [RouterModule],
})
export class GameScoreRoutingModule {}
