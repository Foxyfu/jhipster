import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PracticeDetailComponent } from './practice-detail.component';

describe('Practice Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PracticeDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: PracticeDetailComponent,
              resolve: { practice: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(PracticeDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load practice on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', PracticeDetailComponent);

      // THEN
      expect(instance.practice).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
