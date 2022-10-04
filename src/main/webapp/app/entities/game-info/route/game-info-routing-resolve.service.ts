import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGameInfo } from '../game-info.model';
import { GameInfoService } from '../service/game-info.service';

@Injectable({ providedIn: 'root' })
export class GameInfoRoutingResolveService implements Resolve<IGameInfo | null> {
  constructor(protected service: GameInfoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IGameInfo | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((gameInfo: HttpResponse<IGameInfo>) => {
          if (gameInfo.body) {
            return of(gameInfo.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
