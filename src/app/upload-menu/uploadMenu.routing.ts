import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';
import { UserResponseComponent } from './user-response/user-response.component';
import { TestDetailsComponent } from './test-details/test-details.component';
import { MatchItemUploadComponent } from './match-item-upload/match-item-upload.component';
import { JobsComponent } from './jobs/jobs.component';

import { AuthServiceService as AuthGaurd} from '../auth-service.service';


const routes: Routes = [

{
    path:'',
    children: [
      {
        path: 'UploadedFiles',
        component: UserResponseComponent,
        canActivate: [AuthGaurd],
        data: {
          title: 'UserResponse'
        }
      },
      {
        path: 'FileUpload',
        component: TestDetailsComponent,
        canActivate: [AuthGaurd],
        data: {
          title: 'TestDetails'
        }
      },
      {
        path: 'ViewFileDetails',
        component: MatchItemUploadComponent,
        canActivate: [AuthGaurd],
        data: {
          title: 'MatchItem'
        }
      },
      {
        path :'Jobs',
        component: JobsComponent,
        canActivate: [AuthGaurd],
        data: {
          title: 'MatchItem'
        }
      }
    ]
  }
      
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UploadRoutingModule {}
