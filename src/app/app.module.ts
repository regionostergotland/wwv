import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { WwvToolbarComponent } from './wwv-toolbar/wwv-toolbar.component';
import { MatButtonModule } from '@angular/material/button';
import { WwvHomeComponent } from './wwv-home/wwv-home.component';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule} from '@angular/material/grid-list';
import { WwvSourcesComponent } from './wwv-sources/wwv-sources.component';
import { AppRoutingModule } from './app-routing.module';
import { WwvCategoryPickerComponent } from './wwv-category-picker/wwv-category-picker.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatNativeDateModule, } from "@angular/material";
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    WwvToolbarComponent,
    WwvHomeComponent,
    WwvSourcesComponent,
    WwvCategoryPickerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    AppRoutingModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatNativeDateModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
