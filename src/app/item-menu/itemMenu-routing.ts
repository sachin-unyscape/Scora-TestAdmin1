import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';
import { ViewItemsComponent } from './view-items/view-items.component';
import { AddNewComponent } from './add-new/add-new.component';
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';
import { BulkUploadItemsListComponent } from './bulk-upload-items-list/bulk-upload-items-list.component';
import { AuthServiceService as AuthGaurd} from '../auth-service.service';

const routes: Routes = [


      {
        path:'',
        children: [
          {
            path: 'viewitems/:bulkupload',
            component: ViewItemsComponent,
            canActivate: [AuthGaurd],
            data: {
              title: 'viewitems'
            }
          },
          {
            path: 'additem/:itemSetId/:sectionId/:path',
            component: AddNewComponent,
            canActivate: [AuthGaurd],
            data: {
              title: 'additem'
            }
          },
          {
            path: 'bulk-upload',
            component: BulkUploadComponent,
           
            canActivate: [AuthGaurd],
            data: {
              title: 'bulk-upload'
            }
          },
          {
            path: 'bulkuploadItems',
            component: BulkUploadItemsListComponent,
            canActivate: [AuthGaurd],
            data: {
              title: 'bulkuploadItems'
            }
          },
          
        ]
      },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemsRoutingModule {}
