import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGameScore } from '../game-score.model';
import { GameScoreService } from '../service/game-score.service';

@Injectable({ providedIn: 'root' })
export class GameScoreRoutingResolveService implements Resolve<IGameScore | null> {
  constructor(protected service: GameScoreService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IGameScore | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((gameScore: HttpResponse<IGameScore>) => {
          if (gameScore.body) {
            return of(gameScore.body);
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
