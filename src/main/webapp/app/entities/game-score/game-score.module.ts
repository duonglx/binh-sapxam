import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { GameScoreComponent } from './list/game-score.component';
import { GameScoreDetailComponent } from './detail/game-score-detail.component';
import { GameScoreUpdateComponent } from './update/game-score-update.component';
import { GameScoreDeleteDialogComponent } from './delete/game-score-delete-dialog.component';
import { GameScoreRoutingModule } from './route/game-score-routing.module';

@NgModule({
  imports: [SharedModule, GameScoreRoutingModule],
  declarations: [GameScoreComponent, GameScoreDetailComponent, GameScoreUpdateComponent, GameScoreDeleteDialogComponent],
})
export class GameScoreModule {}
