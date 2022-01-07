import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

// Layouts
import { FullLayoutComponent } from './layouts/full-layout.component';

import { AuthServiceService as AuthGaurd} from './auth-service.service';
import { PagesRoutingModule } from './pages/pages-routing.module';
import { AuthorRoutingModule} from './author/author-routing.module';
import { PageLoadComponent } from './page-load/page-load.component';
import { WelcomeComponent } from './author/welcome/welcome.component';
import { SelectThemeComponent } from './author/select-theme/select-theme.component';
import { TimezoneSetupComponent } from './author/timezone-setup/timezone-setup.component';

export const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'home',
  //   pathMatch: 'full',
  //   canActivate: [AuthGaurd]
  // },
  {
    path: 'home',
    component:PageLoadComponent,
    canActivate: [AuthGaurd]
  },
  {
    path: 'welcome',
    component: WelcomeComponent,
    canActivate: [AuthGaurd]
  },

  {
    path: 'select-theme',
    component: SelectThemeComponent,
    canActivate: [AuthGaurd]
  },
  {
    path: 'select-timezone',
    component: TimezoneSetupComponent,
    canActivate: [AuthGaurd]
  },
  {
    path: '',
    component: FullLayoutComponent,
    children: [
      {
        path: 'author',
        loadChildren: './author/author.module#AuthorModule',
      },
      {
        path:'Items',
        loadChildren:'./item-menu/item-menu.module#ItemMenuModule',
      },
      {
        path:'ItemSets',
        loadChildren:'./itemset-menu/itemset-menu.module#ItemsetMenuModule'
      },
      {
        path:'Upload',
        loadChildren:'./upload-menu/upload-menu.module#UploadMenuModule'
      },
      {
        path:'Tests',
        loadChildren:'./test-menu/test-menu.module#TestMenuModule'
      },
      {
        path:'Tasks',
        loadChildren:'./task-menu/task-menu.module#TaskMenuModule'
      },
      {
        path:'pages',
        loadChildren:'./pages/pages.module#PagesModule'
      },
      {
        path:'as-an-author',
        loadChildren:'./as-an-author/as-an-author.module#AsAnAuthorModule'
      },
      {
        path:'as-a-reviewer',
        loadChildren:'./as-an-reviewer/as-a-reviewer.module#AsAReviewerModule'
      }
    ],
    canActivate: [AuthGaurd],
    data: {
      title: 'Author'
    },
  },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
