import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './gui/home/home.component';
import { PlatformSelectionComponent } from './gui/platform-selection/platform-selection.component';
import { CategorySelectionComponent } from './gui/category-selection/category-selection.component';
import { InfoPageComponent } from './gui/info-page/info-page.component';
import { HelpPageComponent} from './gui/help-page/help-page.component';
import { InspectionComponent} from './gui/inspection/inspection.component';
import { SidebarComponent } from './gui/sidebar/sidebar.component';
import { DataViewerModule } from './gui/data-viewer/data-viewer.module';
const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'help', component: HelpPageComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'platform-selection', component: PlatformSelectionComponent },
  { path: 'category-selection/:platform', component: CategorySelectionComponent },
  { path: 'info', component: InfoPageComponent },
  { path: 'inspection', component: InspectionComponent },
  { path: 'edit', component: SidebarComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes), RouterModule, DataViewerModule ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
