import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SourcesComponent } from './sources/sources.component';
import { CategoryPickerComponent } from './category-picker/category-picker.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'sources', component: SourcesComponent },
  { path: 'catpicker', component: CategoryPickerComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
