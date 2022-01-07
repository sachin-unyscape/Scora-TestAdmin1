import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';

// authgaurd
import { AuthServiceService as AuthGaurd} from '../auth-service.service';

// Component Imports
import { ToReviewComponent } from "./to-review/to-review.component";
import { ChangeRequestedComponent } from "./change-requested/change-requested.component";
import { ApprovedComponent } from "./approved/approved.component";
import { RejectedComponent } from "./rejected/rejected.component";

const routes: Routes = [

{
    path:'',
    // component: ItemSetsComponent,
    children: [
      { path: 'to-review', component: ToReviewComponent, canActivate: [AuthGaurd],  data: { title: 'to-review' } },
      { path: 'change-requested', component: ChangeRequestedComponent, canActivate: [AuthGaurd],  data: { title: 'change-requested' } },
      { path: 'approved', component: ApprovedComponent, canActivate: [AuthGaurd],  data: { title: 'approved' } },
      { path: 'rejected', component: RejectedComponent, canActivate: [AuthGaurd],  data: { title: 'rejected' } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsAReviewerRoutingModule {}
