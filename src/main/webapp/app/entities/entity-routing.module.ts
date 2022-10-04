import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'game-info',
        data: { pageTitle: 'binhSapXamApp.gameInfo.home.title' },
        loadChildren: () => import('./game-info/game-info.module').then(m => m.GameInfoModule),
      },
      {
        path: 'game-score',
        data: { pageTitle: 'binhSapXamApp.gameScore.home.title' },
        loadChildren: () => import('./game-score/game-score.module').then(m => m.GameScoreModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
