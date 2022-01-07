import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';

// authgaurd
import { AuthServiceService as AuthGaurd} from '../auth-service.service';

// Component Imports
import { ToCreateComponent } from "./to-create/to-create.component";
import { ToModifyComponent } from "./to-modify/to-modify.component";
import { InReviewComponent } from "./in-review/in-review.component";
import { ApprovedComponent } from "./approved/approved.component";
import { RejectedComponent } from "./rejected/rejected.component";

const routes: Routes = [

{
    path:'',
    // component: ItemSetsComponent,
    children: [
      { path: 'to-create', component: ToCreateComponent, canActivate: [AuthGaurd],  data: { title: 'to-create' } },
      { path: 'to-modify', component: ToModifyComponent, canActivate: [AuthGaurd],  data: { title: 'to-modify' } },
      { path: 'under-review', component: InReviewComponent, canActivate: [AuthGaurd],  data: { title: 'under-review' } },
      { path: 'approved', component: ApprovedComponent, canActivate: [AuthGaurd],  data: { title: 'approved' } },
      { path: 'rejected', component: RejectedComponent, canActivate: [AuthGaurd],  data: { title: 'rejected' } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsAnAuthorRoutingModule {}
