import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IGameInfo } from '../game-info.model';
import { GameInfoService } from '../service/game-info.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './game-info-delete-dialog.component.html',
})
export class GameInfoDeleteDialogComponent {
  gameInfo?: IGameInfo;

  constructor(protected gameInfoService: GameInfoService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.gameInfoService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
