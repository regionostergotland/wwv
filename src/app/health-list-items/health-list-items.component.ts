import { Component, OnInit, Input } from '@angular/core';

const listItems: ListItem[] = [
  {header: 'Blodtryck',
    parts: [
      {comp: 1, data: '140/80'},
      {comp: 1, data: '120/80'},
      {comp: 1, data: '130/85'},
      {comp: 1, data: '140/80'},
      {comp: 1, data: '120/80'},
      {comp: 1, data: '130/85'},
      {comp: 1, data: '140/80'},
      {comp: 1, data: '120/80'},
      {comp: 1, data: '130/85'},
      {comp: 1, data: '140/80'},
      {comp: 1, data: '120/80'},
      {comp: 1, data: '130/85'},
      {comp: 1, data: '140/80'},
      {comp: 1, data: '120/80'},
      {comp: 1, data: '130/85'},
      {comp: 1, data: '140/80'},
      {comp: 1, data: '120/80'},
      {comp: 1, data: '130/85'},
      {comp: 1, data: '140/80'},
      {comp: 1, data: '120/80'},
      {comp: 1, data: '130/85'},
      {comp: 1, data: '140/80'},
      {comp: 1, data: '120/80'},
      {comp: 1, data: '130/85'}
    ]
  },
  {header: 'position',
    parts: [
      {comp: 3, data: 'Sittande,liggande'},
      {comp: 3, data: 'Sittande,liggande'},
      {comp: 3, data: 'Sittande,liggande'},
      {comp: 3, data: 'Sittande,liggande'},
      {comp: 3, data: 'Sittande,liggande'},
      {comp: 3, data: 'Sittande,liggande'},
      {comp: 3, data: 'Sittande,liggande'},
      {comp: 3, data: 'Sittande,liggande'},
      {comp: 3, data: 'Sittande,liggande'},
      {comp: 3, data: 'Sittande,liggande'},
      {comp: 3, data: 'Sittande,liggande'},
      {comp: 3, data: 'Sittande,liggande'},
      {comp: 3, data: 'Sittande,liggande'},
      {comp: 3, data: 'Sittande,liggande'},
      {comp: 3, data: 'Sittande,liggande'},
      {comp: 3, data: 'Sittande,liggande'},
      {comp: 3, data: 'Sittande,liggande'},
      {comp: 3, data: 'Sittande,liggande'},
      {comp: 3, data: 'Sittande,liggande'},
      {comp: 3, data: 'Sittande,liggande'},
      {comp: 3, data: 'Sittande,liggande'},
      {comp: 3, data: 'Sittande,liggande'},
      {comp: 3, data: 'Sittande,liggande'},
      {comp: 3, data: 'Sittande,liggande'}
    ]
  }
];

@Component({
  selector: 'app-health-list-items',
  templateUrl: './health-list-items.component.html',
  styleUrls: ['./health-list-items.component.scss']
})
export class HealthListItemsComponent implements OnInit {

  @Input() selectedCategory: string;

  dataSource = listItems;
  displayedColumns: string[] = [];
  constructor() {
    for (const item of listItems) {
      this.displayedColumns.push(item.header);
    }
    console.log(this.displayedColumns.toString());
    console.log(this.dataSource.toString());
  }

  ngOnInit() {
  }

}


export class ListItemPart {
  comp: number;
  data: string;
}

export class ListItem {
  header: string;
  parts: ListItemPart[];
}
