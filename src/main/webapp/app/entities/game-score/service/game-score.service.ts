import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGameScore, NewGameScore } from '../game-score.model';

export type PartialUpdateGameScore = Partial<IGameScore> & Pick<IGameScore, 'id'>;

type RestOf<T extends IGameScore | NewGameScore> = Omit<T, 'createdDate'> & {
  createdDate?: string | null;
};

export type RestGameScore = RestOf<IGameScore>;

export type NewRestGameScore = RestOf<NewGameScore>;

export type PartialUpdateRestGameScore = RestOf<PartialUpdateGameScore>;

export type EntityResponseType = HttpResponse<IGameScore>;
export type EntityArrayResponseType = HttpResponse<IGameScore[]>;

@Injectable({ providedIn: 'root' })
export class GameScoreService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/game-scores');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(gameScore: NewGameScore): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(gameScore);
    return this.http
      .post<RestGameScore>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(gameScore: IGameScore): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(gameScore);
    return this.http
      .put<RestGameScore>(`${this.resourceUrl}/${this.getGameScoreIdentifier(gameScore)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(gameScore: PartialUpdateGameScore): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(gameScore);
    return this.http
      .patch<RestGameScore>(`${this.resourceUrl}/${this.getGameScoreIdentifier(gameScore)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestGameScore>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestGameScore[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getGameScoreIdentifier(gameScore: Pick<IGameScore, 'id'>): number {
    return gameScore.id;
  }

  compareGameScore(o1: Pick<IGameScore, 'id'> | null, o2: Pick<IGameScore, 'id'> | null): boolean {
    return o1 && o2 ? this.getGameScoreIdentifier(o1) === this.getGameScoreIdentifier(o2) : o1 === o2;
  }

  addGameScoreToCollectionIfMissing<Type extends Pick<IGameScore, 'id'>>(
    gameScoreCollection: Type[],
    ...gameScoresToCheck: (Type | null | undefined)[]
  ): Type[] {
    const gameScores: Type[] = gameScoresToCheck.filter(isPresent);
    if (gameScores.length > 0) {
      const gameScoreCollectionIdentifiers = gameScoreCollection.map(gameScoreItem => this.getGameScoreIdentifier(gameScoreItem)!);
      const gameScoresToAdd = gameScores.filter(gameScoreItem => {
        const gameScoreIdentifier = this.getGameScoreIdentifier(gameScoreItem);
        if (gameScoreCollectionIdentifiers.includes(gameScoreIdentifier)) {
          return false;
        }
        gameScoreCollectionIdentifiers.push(gameScoreIdentifier);
        return true;
      });
      return [...gameScoresToAdd, ...gameScoreCollection];
    }
    return gameScoreCollection;
  }

  protected convertDateFromClient<T extends IGameScore | NewGameScore | PartialUpdateGameScore>(gameScore: T): RestOf<T> {
    return {
      ...gameScore,
      createdDate: gameScore.createdDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restGameScore: RestGameScore): IGameScore {
    return {
      ...restGameScore,
      createdDate: restGameScore.createdDate ? dayjs(restGameScore.createdDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestGameScore>): HttpResponse<IGameScore> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestGameScore[]>): HttpResponse<IGameScore[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
