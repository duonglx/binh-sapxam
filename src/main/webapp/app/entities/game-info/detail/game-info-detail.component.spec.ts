import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GameInfoDetailComponent } from './game-info-detail.component';

describe('GameInfo Management Detail Component', () => {
  let comp: GameInfoDetailComponent;
  let fixture: ComponentFixture<GameInfoDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameInfoDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ gameInfo: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(GameInfoDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(GameInfoDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load gameInfo on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.gameInfo).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
