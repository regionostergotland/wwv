import { Component, Input, OnInit } from '@angular/core';
import { DataPoint, Filter, filterString } from 'src/app/ehr/datalist';
import { PeriodWidth } from 'src/app/shared/period';
import { Conveyor } from 'src/app/conveyor.service';

interface ChartPoint {
  name: string;
  value: number;
}

interface ChartData {
  name: string;
  series: ChartPoint[];
}

@Component({
  selector: 'app-data-chart',
  templateUrl: './data-chart.component.html',
  styleUrls: ['./data-chart.component.scss'],
})
export class DataChartComponent implements OnInit {
  @Input() width: PeriodWidth;
  @Input() category: string;

  @Input() set data(points: Map<Filter, DataPoint[]>) {
    this.chartData = points;
    this.ngOnInit();
  }

  view: number[];
  chartData: Map<Filter, DataPoint[]>;
  results: ChartData[];
  xAxisLabel = 'datum';
  yAxisLabel = 'yAxisLabel';

  constructor(private conveyor: Conveyor) {}

  getDataTypeUnit(key: string): string {
    const categorySpec = this.conveyor.getCategorySpec(this.category);
    if (!categorySpec.dataTypes.has(key)) {
      return '';
    }
    const dataType = categorySpec.dataTypes.get(key);
    return dataType.unit ? dataType.unit : '';
  }

  ngOnInit() {
    this.results = [];
    const res = {};
    this.yAxisLabel = '';

    const spec = this.conveyor.getCategorySpec(this.category);

    if (this.chartData && this.category) {
      for (const [filter, points] of this.chartData) {
        const filtStr =
          filter.width && filter.fn ? ' (' + filterString(filter) + ')' : '';
        points.forEach(point => {
          Array.from(point.keys()).forEach(key => {
            const label = spec.dataTypes.get(key).label;
            const val = point.get(key);
            const k = label + filtStr;
            if (typeof val === 'number') {
              if (!(k in res)) {
                res[k] = [];
              }

              res[k].push({
                name: point.get('time'),
                value: point.get(key),
              });

              if (this.yAxisLabel === '') {
                this.yAxisLabel = this.getDataTypeUnit(key);
              }
            }
          });
        });
      }

      Object.keys(res).forEach(key => {
        this.results.push({ name: key, series: res[key] });
      });
    }
  }
}
