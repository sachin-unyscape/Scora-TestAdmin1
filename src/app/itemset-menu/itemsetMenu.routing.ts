import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';
import { ViewItemSetsComponent } from './view-item-sets/view-item-sets.component';
import { AddItemSetsComponent } from './add-item-sets/add-item-sets.component';
// import { ItemSetHistoryComponent } from './item-set-history/item-set-history.component';
import { RequestedItemsetComponent } from './requested-itemset/requested-itemset.component';
import { EditItemSetComponent } from './edit-item-set/edit-item-set.component';

// authgaurd
import { AuthServiceService as AuthGaurd} from '../auth-service.service';

const routes: Routes = [

{
    path:'',
    // component: ItemSetsComponent,
    children: [
      {
        path: 'viewitemsets/:itemSetId/:sectionId/:path',
        component: ViewItemSetsComponent,
        data: {
          title: 'viewitemsets'
        },
        canActivate: [AuthGaurd]
      },
      {
        path: 'additemset',
        component: AddItemSetsComponent,
        canActivate: [AuthGaurd],
        data: {
          title: 'additemset'
        }
      },
      {
        path: 'edititemset',
        component: EditItemSetComponent,
        canActivate: [AuthGaurd],
        data: {
          title: 'edititemset'
        }
      },
    
      
      {
        path: 'RequestedItemsets',
        component: RequestedItemsetComponent,
        canActivate: [AuthGaurd],
        data: {
          title: 'RequestedItemsets'
        }
      },
      // {
      //   path: 'itemsethistory',
      //   component: ItemSetHistoryComponent,
      //   canActivate: [AuthGaurd],
      //   data: {
      //     title: 'itemsethistory'
      //   }
      // },

    

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemsetRoutingModule {}
