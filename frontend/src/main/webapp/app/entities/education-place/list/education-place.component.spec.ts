import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { EducationPlaceService } from '../service/education-place.service';

import { EducationPlaceComponent } from './education-place.component';

describe('EducationPlace Management Component', () => {
  let comp: EducationPlaceComponent;
  let fixture: ComponentFixture<EducationPlaceComponent>;
  let service: EducationPlaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'education-place', component: EducationPlaceComponent }]),
        HttpClientTestingModule,
        EducationPlaceComponent,
      ],
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
              }),
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(EducationPlaceComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EducationPlaceComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(EducationPlaceService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        }),
      ),
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.educationPlaces?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to educationPlaceService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getEducationPlaceIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getEducationPlaceIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
