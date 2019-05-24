import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './gui/home/home.component';
import { SourcesComponent } from './gui/sources/sources.component';
import { CategorySelectionComponent } from './gui/category-selection/category-selection.component';
import { InfoComponent } from './gui/info/info.component';
import { HelpComponent} from './gui/help/help.component';
import { InspectionComponent} from './gui/inspection/inspection.component';
import { SidebarComponent } from './gui/sidebar/sidebar.component';
import { DataViewerModule } from './gui/data-viewer/data-viewer.module';
const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'help', component: HelpComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'sources', component: SourcesComponent },
  { path: 'pick-categories/:platform', component: CategorySelectionComponent },
  { path: 'info', component: InfoComponent },
  { path: 'inspection', component: InspectionComponent },
  { path: 'edit', component: SidebarComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes), RouterModule, DataViewerModule ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
