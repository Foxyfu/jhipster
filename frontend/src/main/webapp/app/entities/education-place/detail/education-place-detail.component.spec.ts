import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { EducationPlaceDetailComponent } from './education-place-detail.component';

describe('EducationPlace Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EducationPlaceDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: EducationPlaceDetailComponent,
              resolve: { educationPlace: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(EducationPlaceDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load educationPlace on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', EducationPlaceDetailComponent);

      // THEN
      expect(instance.educationPlace).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
