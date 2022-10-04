import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { GameInfoComponent } from '../list/game-info.component';
import { GameInfoDetailComponent } from '../detail/game-info-detail.component';
import { GameInfoUpdateComponent } from '../update/game-info-update.component';
import { GameInfoRoutingResolveService } from './game-info-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const gameInfoRoute: Routes = [
  {
    path: '',
    component: GameInfoComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GameInfoDetailComponent,
    resolve: {
      gameInfo: GameInfoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GameInfoUpdateComponent,
    resolve: {
      gameInfo: GameInfoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GameInfoUpdateComponent,
    resolve: {
      gameInfo: GameInfoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(gameInfoRoute)],
  exports: [RouterModule],
})
export class GameInfoRoutingModule {}
