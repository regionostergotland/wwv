import {Component,
        OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

import {
         DataTypeEnum} from '../../ehr/datatype';
import { Conveyor } from '../../conveyor.service';
import { CompositionReceipt } from '../../ehr/ehr.service';
import { ConfigService } from 'src/app/config.service';

@Component({
  selector: 'app-inspection-view',
  templateUrl: './inspection-view.component.html',
  styleUrls: ['./inspection-view.component.scss']
})
export class InspectionViewComponent implements OnInit {
  dataTypeEnum = DataTypeEnum;

  dataSent = false;
  receipt: CompositionReceipt;

  constructor(
    public router: Router,
    private cfg: ConfigService,
    private snackBar: MatSnackBar,
    private conveyor: Conveyor,
  ) {}

  ngOnInit() {
    this.dataSent = false;
  }

  hasData(): boolean {
    const categories = this.conveyor.getCategoryIds();
    if (categories.length > 0) {
      for (const cat of categories) {
        if (!this.isCategoryEmpty(cat)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Checks if a category is empty.
   * @param categoryId the category to check values from.
   * @returns whether the category has no points in its list.
   */
  isCategoryEmpty(categoryId: string): boolean {
    if (this.conveyor.getDataList(categoryId)) {
      return this.getNumberOfValues(categoryId) < 1;
    }
    return false;
  }

  /**
   * Get the number of values in a chosen category.
   * @param category the category to get values from
   * @returns the number of values in the chosen category
   */
  getNumberOfValues(category: string) {
    let values = 0;
    const pointMap = this.conveyor.getDataList(category).getPoints();
    for (const points of pointMap.values()) {
      values += points.length;
    }
    return values;
  }

  /**
   * Send all the data stored in the conveyor.
   */
  sendData(pnr: string) {
    this.conveyor.sendData().
      subscribe(
        receipt => {
          this.dataSent = true;
          this.receipt = receipt;
          this.conveyor.clearData();
        },
        e => {
          if (this.cfg.getIsDebug()) { console.log(e); }
          this.snackBar.open(
            'Inrapporteringen misslyckades. Fel: "' + e.statusText + '"', 'OK',
            { duration: 100000000 }
          );
        }
    );
  }
}
