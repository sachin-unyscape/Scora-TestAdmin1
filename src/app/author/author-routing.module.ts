import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';
//import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { MetaDataComponent } from './meta-data/meta-data.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { UserGroupsComponent } from './user-groups/user-groups.component';
import { ScoringComponent } from './scoring/scoring.component'
import { DefaultComponent } from "./default/default.component";
import { AuthServiceService as AuthGaurd} from '../auth-service.service';
import { TrashItemsComponent } from "./trash-items/trash-items.component";

import { PrintCertificatesComponent } from './print-certificates/print-certificates.component';
import { ReportsComponent } from './reports/reports.component';
import { DataTemplatesComponent } from './data-templates/data-templates.component';
import { AddUserGroupComponent } from './add-user-group/add-user-group.component';
import { ViewUserGroupComponent } from './view-user-group/view-user-group.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { SelectThemeComponent } from './select-theme/select-theme.component';
import { TimezoneSetupComponent } from './timezone-setup/timezone-setup.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component'; 

import { DatatemplatesComponent } from './datatemplates/datatemplates.component';
import { AnswerPoolComponent } from '../item-menu/add-new/answer-pool.component';
import { ComprehensionComponent } from '../item-menu/add-new/comprehension.component';
import { DRODPOWNComponent } from '../item-menu/add-new/drop-down.component';
import { FileUploadComponent } from '../item-menu/add-new/file-upload.component';
import { FreeTextComponent } from '../item-menu/add-new/free-text.component';
import { InterchangeComponent } from '../item-menu/add-new/interchange.component';
import { MatrixComponent } from '../item-menu/add-new/matrix.component';
import { MCQComponent } from '../item-menu/add-new/mcq.component';
import { SelectionComponent } from '../item-menu/add-new/selection.component';
import { TRUEFALSEComponent } from '../item-menu/add-new/true-false.component';
import { RubricListingComponent } from './test-admin1/rubric-listing/rubric-listing.component';
import { CreateRubricComponent } from './test-admin1/create-rubric/create-rubric.component';
import { ViewRubricComponent } from './test-admin1/view-rubric/view-rubric.component';
import { TestbankListingComponent } from './test-admin1/testbank-listing/testbank-listing.component';
import { ViewItemsComponent } from './test-admin1/view-items/view-items.component';
import { ViewItemsEditComponent } from './test-admin1/view-items-edit/view-items-edit.component';
import { CreateTestSchemaComponent } from './test-admin1/create-test-schema/create-test-schema.component';
import { MarkingSchemaComponent } from './test-admin1/marking-schema/marking-schema.component';

const routes: Routes = [
  {
    path: 'author',
    redirectTo: 'home',
    canActivate: [AuthGaurd],
  },
    // children: [
      // { path: '', redirectTo: 'home', pathMatch: 'full', canActivate: [AuthGaurd] },
      // { path: '', redirectTo: 'welcome', pathMatch: 'full', canActivate: [AuthGaurd] },
      {
        path: 'home',
        component: DefaultComponent,
        data: {
          title: 'home'
        },
        canActivate: [AuthGaurd],
        runGuardsAndResolvers: 'always',
      },
      // {
        // path: 'dashboard',
        // component: DashboardComponent,
        // data: {
          // title: 'dashboard'
        // },
        // canActivate: [AuthGaurd],
        // runGuardsAndResolvers: 'always',
      // },
      {
        path: 'userGroups',
        component: UserGroupsComponent,
        canActivate: [AuthGaurd],
        data: {
          title: 'userGroups'
        }
      },
      {
        path: 'print-certificates',
        component: PrintCertificatesComponent,
        canActivate: [AuthGaurd],
        data: {
          title: 'print-certificates'
        }
      },
      {
        path: 'reports',
        component: ReportsComponent,
        canActivate: [AuthGaurd],
        data: {
          title: 'reports'
        }
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGaurd],
        data: {
          title: 'ProfileComponent'
        }
      },
      {
        path: 'MetaData',
        component: MetaDataComponent,
        canActivate: [AuthGaurd],
        data: {
          title: 'MetaData'
        }
      },
      {
        path: 'ManageUsers',
        component: ManageUsersComponent,
        canActivate: [AuthGaurd],
        data: {
          title: 'ManageUsers'
        }
      },
      {
        path: 'Scoring',
        component: ScoringComponent,
        canActivate: [AuthGaurd],
        data: {
          title: 'Scoring'
        }
      },
	  {
        path: 'admin-dashboard',
        component: AdminDashboardComponent,
        data: {
          title: 'admin-dashboard'
        },
        canActivate: [AuthGaurd],
        runGuardsAndResolvers: 'always',
      },  
      {
        path: 'trash',
        component: TrashItemsComponent,
        canActivate: [AuthGaurd],
        data: {
          title: 'Trash'
        }
      },
      {
        path: 'data-templates',
        component: DataTemplatesComponent,
        canActivate: [AuthGaurd],
        data: {
          title: 'data-templates'
        }
      },
      {
        path: 'add-user-group/:id/:grp_name',
        component: AddUserGroupComponent,
        canActivate: [AuthGaurd],
        data: {
          title: 'add-user-group'
        }
      },
      {
        path: 'view-user-group/:id/:grp_name',
        component: ViewUserGroupComponent,
        canActivate: [AuthGaurd],
        data: {
          title: 'view-user-group'
        }
      },
      {
        path: 'createitem',
        component: MCQComponent,
        canActivate: [AuthGaurd],
        data: {
          title: 'createitem'
        }
      }, 
  {
    path: 'trueorfalse',
    component: TRUEFALSEComponent,
    canActivate: [AuthGaurd],
    data: {
      title: 'trueorfalse'
    }
  },
  {
    path: 'selection',
    component: SelectionComponent,
    canActivate: [AuthGaurd],
    data: {
      title: 'selection'
    }
  },
  {
    path: 'matrix',
    component: MatrixComponent,
    canActivate: [AuthGaurd],
    data: {
      title: 'matrix'
    }
  },
  {
    path: 'interchange',
    component: InterchangeComponent,
    canActivate: [AuthGaurd],
    data: {
      title: 'interchange'
    }
  },
  {
    path: 'freetext',
    component: FreeTextComponent,
    canActivate: [AuthGaurd],
    data: {
      title: 'freetext'
    }
  },
  {
    path: 'fileupload',
    component: FileUploadComponent,
    canActivate: [AuthGaurd],
    data: {
      title: 'fileupload'
    }
  },
  {
    path: 'dropdown',
    component: DRODPOWNComponent,
    canActivate: [AuthGaurd],
    data: {
      title: 'dropdown'
    }
  },
  {
    path: 'comprehension',
    component: ComprehensionComponent,
    canActivate: [AuthGaurd],
    data: {
      title: 'comprehension'
    }
  },

  {
    path: 'answerpool',
    component: AnswerPoolComponent,
    data: {
      title: 'answerpool'
    }
  },
  {
    path: 'rubric',
    component: RubricListingComponent,
    data: {
      title: 'rubric-listing'
    }
  },
  {
    path: 'create-rubric/:itemID',
    component: CreateRubricComponent,
    data: {
      title: 'create-rubric'
    },
    pathMatch: 'full'
  },
  {
    path: 'view-rubric/:Item_Type_ID/:Item_ID/:version',
    component: ViewRubricComponent,
    data: {
      title: 'view-listing'
    }
  },
  {
    path: 'test-bank',
    component: TestbankListingComponent,
    data: {
      title: 'test-bank'
    }
  },
  {
    path: 'view-items/:ItemSet_ID',
    component: ViewItemsComponent,
    data: {
      title: 'view-items'
    }
  },
  {
    path: 'view-items-edit',
    component: ViewItemsEditComponent,
    data: {
      title: 'view-items-edit'
    }
  },
  {
    path: 'create-test-schema',
    component: CreateTestSchemaComponent,
    data: {
      title: 'view-items-edit'
    }
  },
  {
    path: 'marking-schema/:itemset_id',
    component: MarkingSchemaComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthorRoutingModule {}
