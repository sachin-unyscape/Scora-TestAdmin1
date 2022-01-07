import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';
import { ToCreateComponent } from './to-create/to-create.component';
import { ToReviewComponent } from './to-review/to-review.component';
import { UnderReviewComponent } from './under-review/under-review.component';

import { AuthServiceService as AuthGaurd} from '../auth-service.service';


const routes: Routes = [

{
    path:'',
    children: [
     
      {
        path: 'tocreate/:itemSetId/:sectionId/:path',
        component: ToCreateComponent,
        canActivate: [AuthGaurd],
        data: {
          title: 'tocreate'
        }
      },
      
      {
        path: 'ToReview',
        component: ToReviewComponent,
        canActivate: [AuthGaurd],
        data: {
          title: 'ToReview'
        }
      },
      {
        path: 'underReview/:itemSetId/:sectionId/:path',
        component: UnderReviewComponent,
        canActivate: [AuthGaurd],
        data: {
          title: 'underReview'
        }
      },
      
    ]
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskRoutingModule {}
