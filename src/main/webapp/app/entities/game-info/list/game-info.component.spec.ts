import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { GameInfoService } from '../service/game-info.service';

import { GameInfoComponent } from './game-info.component';

describe('GameInfo Management Component', () => {
  let comp: GameInfoComponent;
  let fixture: ComponentFixture<GameInfoComponent>;
  let service: GameInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'game-info', component: GameInfoComponent }]), HttpClientTestingModule],
      declarations: [GameInfoComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(GameInfoComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GameInfoComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(GameInfoService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.gameInfos?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to gameInfoService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getGameInfoIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getGameInfoIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
