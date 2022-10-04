import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { GameInfoFormService } from './game-info-form.service';
import { GameInfoService } from '../service/game-info.service';
import { IGameInfo } from '../game-info.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IGameScore } from 'app/entities/game-score/game-score.model';
import { GameScoreService } from 'app/entities/game-score/service/game-score.service';

import { GameInfoUpdateComponent } from './game-info-update.component';

describe('GameInfo Management Update Component', () => {
  let comp: GameInfoUpdateComponent;
  let fixture: ComponentFixture<GameInfoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let gameInfoFormService: GameInfoFormService;
  let gameInfoService: GameInfoService;
  let userService: UserService;
  let gameScoreService: GameScoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [GameInfoUpdateComponent],
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
      .overrideTemplate(GameInfoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GameInfoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    gameInfoFormService = TestBed.inject(GameInfoFormService);
    gameInfoService = TestBed.inject(GameInfoService);
    userService = TestBed.inject(UserService);
    gameScoreService = TestBed.inject(GameScoreService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const gameInfo: IGameInfo = { id: 456 };
      const user: IUser = { id: 53960 };
      gameInfo.user = user;

      const userCollection: IUser[] = [{ id: 41601 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ gameInfo });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call GameScore query and add missing value', () => {
      const gameInfo: IGameInfo = { id: 456 };
      const gameScore: IGameScore = { id: 99701 };
      gameInfo.gameScore = gameScore;

      const gameScoreCollection: IGameScore[] = [{ id: 6658 }];
      jest.spyOn(gameScoreService, 'query').mockReturnValue(of(new HttpResponse({ body: gameScoreCollection })));
      const additionalGameScores = [gameScore];
      const expectedCollection: IGameScore[] = [...additionalGameScores, ...gameScoreCollection];
      jest.spyOn(gameScoreService, 'addGameScoreToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ gameInfo });
      comp.ngOnInit();

      expect(gameScoreService.query).toHaveBeenCalled();
      expect(gameScoreService.addGameScoreToCollectionIfMissing).toHaveBeenCalledWith(
        gameScoreCollection,
        ...additionalGameScores.map(expect.objectContaining)
      );
      expect(comp.gameScoresSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const gameInfo: IGameInfo = { id: 456 };
      const user: IUser = { id: 34282 };
      gameInfo.user = user;
      const gameScore: IGameScore = { id: 18063 };
      gameInfo.gameScore = gameScore;

      activatedRoute.data = of({ gameInfo });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.gameScoresSharedCollection).toContain(gameScore);
      expect(comp.gameInfo).toEqual(gameInfo);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGameInfo>>();
      const gameInfo = { id: 123 };
      jest.spyOn(gameInfoFormService, 'getGameInfo').mockReturnValue(gameInfo);
      jest.spyOn(gameInfoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gameInfo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: gameInfo }));
      saveSubject.complete();

      // THEN
      expect(gameInfoFormService.getGameInfo).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(gameInfoService.update).toHaveBeenCalledWith(expect.objectContaining(gameInfo));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGameInfo>>();
      const gameInfo = { id: 123 };
      jest.spyOn(gameInfoFormService, 'getGameInfo').mockReturnValue({ id: null });
      jest.spyOn(gameInfoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gameInfo: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: gameInfo }));
      saveSubject.complete();

      // THEN
      expect(gameInfoFormService.getGameInfo).toHaveBeenCalled();
      expect(gameInfoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGameInfo>>();
      const gameInfo = { id: 123 };
      jest.spyOn(gameInfoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gameInfo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(gameInfoService.update).toHaveBeenCalled();
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

    describe('compareGameScore', () => {
      it('Should forward to gameScoreService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(gameScoreService, 'compareGameScore');
        comp.compareGameScore(entity, entity2);
        expect(gameScoreService.compareGameScore).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
