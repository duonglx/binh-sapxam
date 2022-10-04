import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGameInfo, NewGameInfo } from '../game-info.model';

export type PartialUpdateGameInfo = Partial<IGameInfo> & Pick<IGameInfo, 'id'>;

type RestOf<T extends IGameInfo | NewGameInfo> = Omit<T, 'gDatetime'> & {
  gDatetime?: string | null;
};

export type RestGameInfo = RestOf<IGameInfo>;

export type NewRestGameInfo = RestOf<NewGameInfo>;

export type PartialUpdateRestGameInfo = RestOf<PartialUpdateGameInfo>;

export type EntityResponseType = HttpResponse<IGameInfo>;
export type EntityArrayResponseType = HttpResponse<IGameInfo[]>;

@Injectable({ providedIn: 'root' })
export class GameInfoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/game-infos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(gameInfo: NewGameInfo): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(gameInfo);
    return this.http
      .post<RestGameInfo>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(gameInfo: IGameInfo): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(gameInfo);
    return this.http
      .put<RestGameInfo>(`${this.resourceUrl}/${this.getGameInfoIdentifier(gameInfo)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(gameInfo: PartialUpdateGameInfo): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(gameInfo);
    return this.http
      .patch<RestGameInfo>(`${this.resourceUrl}/${this.getGameInfoIdentifier(gameInfo)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestGameInfo>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestGameInfo[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getGameInfoIdentifier(gameInfo: Pick<IGameInfo, 'id'>): number {
    return gameInfo.id;
  }

  compareGameInfo(o1: Pick<IGameInfo, 'id'> | null, o2: Pick<IGameInfo, 'id'> | null): boolean {
    return o1 && o2 ? this.getGameInfoIdentifier(o1) === this.getGameInfoIdentifier(o2) : o1 === o2;
  }

  addGameInfoToCollectionIfMissing<Type extends Pick<IGameInfo, 'id'>>(
    gameInfoCollection: Type[],
    ...gameInfosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const gameInfos: Type[] = gameInfosToCheck.filter(isPresent);
    if (gameInfos.length > 0) {
      const gameInfoCollectionIdentifiers = gameInfoCollection.map(gameInfoItem => this.getGameInfoIdentifier(gameInfoItem)!);
      const gameInfosToAdd = gameInfos.filter(gameInfoItem => {
        const gameInfoIdentifier = this.getGameInfoIdentifier(gameInfoItem);
        if (gameInfoCollectionIdentifiers.includes(gameInfoIdentifier)) {
          return false;
        }
        gameInfoCollectionIdentifiers.push(gameInfoIdentifier);
        return true;
      });
      return [...gameInfosToAdd, ...gameInfoCollection];
    }
    return gameInfoCollection;
  }

  protected convertDateFromClient<T extends IGameInfo | NewGameInfo | PartialUpdateGameInfo>(gameInfo: T): RestOf<T> {
    return {
      ...gameInfo,
      gDatetime: gameInfo.gDatetime?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restGameInfo: RestGameInfo): IGameInfo {
    return {
      ...restGameInfo,
      gDatetime: restGameInfo.gDatetime ? dayjs(restGameInfo.gDatetime) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestGameInfo>): HttpResponse<IGameInfo> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestGameInfo[]>): HttpResponse<IGameInfo[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
