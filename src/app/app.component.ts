import { Component } from '@angular/core';

import { Conveyor } from './conveyor.service';
import { DataList, DataPoint } from './ehr/datalist';
import { GfitService } from './platform/gfit.service';
import { ProgressBarComponent} from './gui/progress-bar/progress-bar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {}
