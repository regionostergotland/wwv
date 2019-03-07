import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-health-list-items',
  templateUrl: './health-list-items.component.html',
  styleUrls: ['./health-list-items.component.scss']
})
export class HealthListItemsComponent implements OnInit {

  @Input() selectedCategory: string;

  listItems: ListItem[] = [
    {parts: [
        {comp: 2, data: 'Blodtryck'},
        {comp: 2, data: '140/80'},
        {comp: 1, data: 'Sittande, liggande'}
      ]
    },
    {parts: [
        {comp: 2, data: 'Blodtryck'},
        {comp: 2, data: '120/80'},
        {comp: 1, data: 'Sittande, liggande'}
      ]
    },
    {parts: [
        {comp: 2, data: 'Blodtryck'},
        {comp: 2, data: '130/85'},
        {comp: 1, data: 'Sittande, liggande'}
      ]
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}


export class ListItemPart {
  comp: number;
  data: string;
}

export class ListItem {
  parts: ListItemPart[];
}
