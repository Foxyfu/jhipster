import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { EducationPlaceComponent } from './list/education-place.component';
import { EducationPlaceDetailComponent } from './detail/education-place-detail.component';
import { EducationPlaceUpdateComponent } from './update/education-place-update.component';
import EducationPlaceResolve from './route/education-place-routing-resolve.service';

const educationPlaceRoute: Routes = [
  {
    path: '',
    component: EducationPlaceComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EducationPlaceDetailComponent,
    resolve: {
      educationPlace: EducationPlaceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EducationPlaceUpdateComponent,
    resolve: {
      educationPlace: EducationPlaceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EducationPlaceUpdateComponent,
    resolve: {
      educationPlace: EducationPlaceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default educationPlaceRoute;
