import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';
import { CreateTestComponent } from './create-test/create-test.component';
import { ManageTestComponent } from './manage-test/manage-test.component';
// import { TestHistoryComponent } from './test-history/test-history.component';
import { TestTrackingComponent } from './test-tracking/test-tracking.component';

import { AuthServiceService as AuthGaurd} from '../auth-service.service';


const routes: Routes = [

{
    path:'',
    children: [
      {
        path: 'createTest/:edit',
        component: CreateTestComponent,
        canActivate: [AuthGaurd],
        data: {
          title: 'createTest'
        }
      },
      {
        path: 'ManageTests',
        component: ManageTestComponent,
        canActivate: [AuthGaurd],
        data: {
          title: 'ManageTests'
        }
      },
      {
        path: 'TestTackingDetails',
        component: TestTrackingComponent,
        canActivate: [AuthGaurd],
        data: {
          title: 'TestTackingDetails'
        }
      },
      // {
      //   path: 'testHistory',
      //   component: TestHistoryComponent,
      //   canActivate: [AuthGaurd],
      //   data: {
      //     title: 'testHistory'
      //   }
      // },
    ],
    canActivate: [AuthGaurd]
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestRoutingModule {}
