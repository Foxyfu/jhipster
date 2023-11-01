import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEducationPlace } from '../education-place.model';
import { EducationPlaceService } from '../service/education-place.service';

export const educationPlaceResolve = (route: ActivatedRouteSnapshot): Observable<null | IEducationPlace> => {
  const id = route.params['id'];
  if (id) {
    return inject(EducationPlaceService)
      .find(id)
      .pipe(
        mergeMap((educationPlace: HttpResponse<IEducationPlace>) => {
          if (educationPlace.body) {
            return of(educationPlace.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default educationPlaceResolve;
