import { Component, Input, OnInit } from '@angular/core';
import { DataPoint, Filter } from 'src/app/ehr/datalist';
import { PeriodWidth } from 'src/app/shared/period';
import { Conveyor } from 'src/app/conveyor.service';
import { MathFunctionEnum } from 'src/app/ehr/datatype';

interface ChartPoint {
  name: string;
  value: number;
}

interface ChartData {
  name: string;
  series: ChartPoint[];
}

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  @Input() width: PeriodWidth;

  @Input() category: string;

  @Input() isEditable: boolean;

  @Input() set data(points: Map<Filter, DataPoint[]>) {
    this.chartData = points;
    this.ngOnInit();
  }

  mathOptions: Map<MathFunctionEnum, string> = new Map<MathFunctionEnum, string>([
    [MathFunctionEnum.MAX, 'Maximalt '],
    [MathFunctionEnum.MEAN, 'Medelvärde '],
    [MathFunctionEnum.MEDIAN, 'Median '],
    [MathFunctionEnum.MIN, 'Minimalt '],
    [MathFunctionEnum.TOTAL, 'Totalt '],
  ]);

  intervalOptions: Map<PeriodWidth, string> = new Map<PeriodWidth, string>([
    [PeriodWidth.HOUR, 'per timme'],
    [PeriodWidth.DAY, 'per dygn'],
    [PeriodWidth.WEEK, 'per vecka'],
    [PeriodWidth.MONTH, 'per månad'],
    [PeriodWidth.YEAR, 'per år'],
  ]);

  view: number[];
  chartData: Map<Filter, DataPoint[]>;
  results: ChartData[];
  xAxisLabel = 'datum';
  yAxisLabel = 'yAxisLabel';


  constructor(private conveyor: Conveyor) {  }

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

    for (const [filter, points] of this.chartData) {
      let name = this.mathOptions.get(filter.fn) ? this.mathOptions.get(filter.fn) : '';
      name += this.intervalOptions.get(filter.width) ? this.intervalOptions.get(filter.width) : '';
      points.forEach(point => {
        Array.from(point.keys()).forEach(key => {
          const val = point.get(key);
          const k = name + key;
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
