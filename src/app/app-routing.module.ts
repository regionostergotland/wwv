import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './gui/home-page/home-page.component';
import { PlatformSelectionComponent } from './gui/platform-selection/platform-selection.component';
import { CategorySelectionComponent } from './gui/category-selection/category-selection.component';
import { InfoPageComponent } from './gui/info-page/info-page.component';
import { HelpPageComponent} from './gui/help-page/help-page.component';
import { InspectionViewComponent} from './gui/inspection-view/inspection-view.component';
import { EditorViewComponent } from './gui/editor-view/editor-view.component';
import { DataViewerModule } from './gui/data-viewer/data-viewer.module';
const routes: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: 'help', component: HelpPageComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'platform-selection', component: PlatformSelectionComponent },
  { path: 'category-selection/:platform', component: CategorySelectionComponent },
  { path: 'info', component: InfoPageComponent },
  { path: 'inspection', component: InspectionViewComponent },
  { path: 'edit', component: EditorViewComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes), RouterModule, DataViewerModule ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
