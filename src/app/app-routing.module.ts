import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './gui/home/home.component';
import { SourcesComponent } from './gui/sources/sources.component';
import { CategoryPickerComponent } from './gui/category-picker/category-picker.component';
import { InfoComponent } from './gui/info/info.component';
import { HelpComponent} from './gui/help/help.component';
import { InspectionComponent} from './gui/inspection/inspection.component';
import { SidebarComponent } from './gui/sidebar/sidebar.component';
import {HealthListItemsComponent} from './gui/health-list-items/health-list-items.component';
import { ConfirmationComponent } from './gui/confirmation/confirmation.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'sources', component: SourcesComponent },
  { path: 'pick-categories/:platform', component: CategoryPickerComponent },
  { path: 'pick-categories', component: CategoryPickerComponent },
  { path: 'info', component: InfoComponent },
  { path: 'help', component: HelpComponent },
  { path: 'inspection', component: InspectionComponent },
  { path: 'edit', component: SidebarComponent },
  { path: 'edit/:id', component: SidebarComponent },
  { path: 'health-list', component: HealthListItemsComponent },
  { path: 'confirmation', component: ConfirmationComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes), RouterModule ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
