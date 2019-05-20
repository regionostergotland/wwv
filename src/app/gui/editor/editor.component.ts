import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { DataPoint, Filter } from 'src/app/ehr/datalist';
import { Conveyor } from 'src/app/conveyor.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  @Input() editable: boolean;

  @Input() set selectCategory(value: string) {
    if (this.selectedCategory) {
      this.selectedCategory = value;
      this.ngOnInit();
    } else {
      this.selectedCategory = value;
    }
  }

  //isEditable: boolean;
  selectedCategory: string;
  dataList: Map<Filter, MatTableDataSource<DataPoint>>;

  constructor(private conveyor: Conveyor) { }

  ngOnInit() {
    this.dataList = new Map<Filter, MatTableDataSource<DataPoint>>();
    for (let [filter, points] of this.conveyor.getDataList(this.selectedCategory).getPoints().entries()) {
      this.dataList.set(filter, new MatTableDataSource<DataPoint>(points));
    }
  }

}
