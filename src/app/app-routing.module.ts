import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SourcesComponent } from './sources/sources.component';
import { CategoryPickerComponent } from './category-picker/category-picker.component';
import { InfoComponent } from './info/info.component';
import { HelpComponent} from './help/help.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import {HealthListItemsComponent} from './health-list-items/health-list-items.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'sources', component: SourcesComponent },
  { path: 'catpicker', component: CategoryPickerComponent },
  { path: 'info', component: InfoComponent },
  { path: 'help', component: HelpComponent },
  { path: 'sidebar', component: SidebarComponent },
  { path: 'sidebar/:id', component: SidebarComponent },
  { path: 'health-list', component: HealthListItemsComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes), RouterModule ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
