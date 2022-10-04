import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { GameScoreFormService } from './game-score-form.service';
import { GameScoreService } from '../service/game-score.service';
import { IGameScore } from '../game-score.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IGameInfo } from 'app/entities/game-info/game-info.model';
import { GameInfoService } from 'app/entities/game-info/service/game-info.service';

import { GameScoreUpdateComponent } from './game-score-update.component';

describe('GameScore Management Update Component', () => {
  let comp: GameScoreUpdateComponent;
  let fixture: ComponentFixture<GameScoreUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let gameScoreFormService: GameScoreFormService;
  let gameScoreService: GameScoreService;
  let userService: UserService;
  let gameInfoService: GameInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [GameScoreUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(GameScoreUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GameScoreUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    gameScoreFormService = TestBed.inject(GameScoreFormService);
    gameScoreService = TestBed.inject(GameScoreService);
    userService = TestBed.inject(UserService);
    gameInfoService = TestBed.inject(GameInfoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const gameScore: IGameScore = { id: 456 };
      const user: IUser = { id: 80869 };
      gameScore.user = user;

      const userCollection: IUser[] = [{ id: 54377 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ gameScore });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call GameInfo query and add missing value', () => {
      const gameScore: IGameScore = { id: 456 };
      const gameInfo: IGameInfo = { id: 47839 };
      gameScore.gameInfo = gameInfo;

      const gameInfoCollection: IGameInfo[] = [{ id: 3059 }];
      jest.spyOn(gameInfoService, 'query').mockReturnValue(of(new HttpResponse({ body: gameInfoCollection })));
      const additionalGameInfos = [gameInfo];
      const expectedCollection: IGameInfo[] = [...additionalGameInfos, ...gameInfoCollection];
      jest.spyOn(gameInfoService, 'addGameInfoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ gameScore });
      comp.ngOnInit();

      expect(gameInfoService.query).toHaveBeenCalled();
      expect(gameInfoService.addGameInfoToCollectionIfMissing).toHaveBeenCalledWith(
        gameInfoCollection,
        ...additionalGameInfos.map(expect.objectContaining)
      );
      expect(comp.gameInfosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const gameScore: IGameScore = { id: 456 };
      const user: IUser = { id: 34435 };
      gameScore.user = user;
      const gameInfo: IGameInfo = { id: 91211 };
      gameScore.gameInfo = gameInfo;

      activatedRoute.data = of({ gameScore });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.gameInfosSharedCollection).toContain(gameInfo);
      expect(comp.gameScore).toEqual(gameScore);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGameScore>>();
      const gameScore = { id: 123 };
      jest.spyOn(gameScoreFormService, 'getGameScore').mockReturnValue(gameScore);
      jest.spyOn(gameScoreService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gameScore });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: gameScore }));
      saveSubject.complete();

      // THEN
      expect(gameScoreFormService.getGameScore).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(gameScoreService.update).toHaveBeenCalledWith(expect.objectContaining(gameScore));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGameScore>>();
      const gameScore = { id: 123 };
      jest.spyOn(gameScoreFormService, 'getGameScore').mockReturnValue({ id: null });
      jest.spyOn(gameScoreService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gameScore: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: gameScore }));
      saveSubject.complete();

      // THEN
      expect(gameScoreFormService.getGameScore).toHaveBeenCalled();
      expect(gameScoreService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGameScore>>();
      const gameScore = { id: 123 };
      jest.spyOn(gameScoreService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gameScore });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(gameScoreService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareGameInfo', () => {
      it('Should forward to gameInfoService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(gameInfoService, 'compareGameInfo');
        comp.compareGameInfo(entity, entity2);
        expect(gameInfoService.compareGameInfo).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
