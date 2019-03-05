import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WwvHomeComponent } from './wwv-home/wwv-home.component';
import { WwvSourcesComponent } from './wwv-sources/wwv-sources.component';
import { WwvCategoryPickerComponent } from './wwv-category-picker/wwv-category-picker.component';

const routes: Routes = [
  { path: 'home', component: WwvHomeComponent },
  { path: 'sources', component: WwvSourcesComponent },
  { path: 'catpicker', component: WwvCategoryPickerComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
