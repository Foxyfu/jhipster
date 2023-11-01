import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { PracticeComponent } from './list/practice.component';
import { PracticeDetailComponent } from './detail/practice-detail.component';
import { PracticeUpdateComponent } from './update/practice-update.component';
import PracticeResolve from './route/practice-routing-resolve.service';

const practiceRoute: Routes = [
  {
    path: '',
    component: PracticeComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PracticeDetailComponent,
    resolve: {
      practice: PracticeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PracticeUpdateComponent,
    resolve: {
      practice: PracticeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PracticeUpdateComponent,
    resolve: {
      practice: PracticeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default practiceRoute;
