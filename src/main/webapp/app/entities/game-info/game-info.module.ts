import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { GameInfoComponent } from './list/game-info.component';
import { GameInfoDetailComponent } from './detail/game-info-detail.component';
import { GameInfoUpdateComponent } from './update/game-info-update.component';
import { GameInfoDeleteDialogComponent } from './delete/game-info-delete-dialog.component';
import { GameInfoRoutingModule } from './route/game-info-routing.module';

@NgModule({
  imports: [SharedModule, GameInfoRoutingModule],
  declarations: [GameInfoComponent, GameInfoDetailComponent, GameInfoUpdateComponent, GameInfoDeleteDialogComponent],
})
export class GameInfoModule {}
