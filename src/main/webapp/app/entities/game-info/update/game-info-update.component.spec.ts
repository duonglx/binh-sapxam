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

import { GameInfoUpdateComponent } from './game-info-update.component';

describe('GameInfo Management Update Component', () => {
  let comp: GameInfoUpdateComponent;
  let fixture: ComponentFixture<GameInfoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let gameInfoFormService: GameInfoFormService;
  let gameInfoService: GameInfoService;

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

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const gameInfo: IGameInfo = { id: 456 };

      activatedRoute.data = of({ gameInfo });
      comp.ngOnInit();

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
});
