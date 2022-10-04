import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GameScoreDetailComponent } from './game-score-detail.component';

describe('GameScore Management Detail Component', () => {
  let comp: GameScoreDetailComponent;
  let fixture: ComponentFixture<GameScoreDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameScoreDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ gameScore: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(GameScoreDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(GameScoreDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load gameScore on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.gameScore).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
