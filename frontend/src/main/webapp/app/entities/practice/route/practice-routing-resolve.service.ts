import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPractice } from '../practice.model';
import { PracticeService } from '../service/practice.service';

export const practiceResolve = (route: ActivatedRouteSnapshot): Observable<null | IPractice> => {
  const id = route.params['id'];
  if (id) {
    return inject(PracticeService)
      .find(id)
      .pipe(
        mergeMap((practice: HttpResponse<IPractice>) => {
          if (practice.body) {
            return of(practice.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default practiceResolve;
