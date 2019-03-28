import { Component, OnInit } from '@angular/core';
import { Source } from '../source';
import { Conveyor } from '../conveyor.service';

@Component({
  selector: 'app-sources',
  templateUrl: './sources.component.html',
  styleUrls: ['./sources.component.scss']
})
export class SourcesComponent implements OnInit {

  sources: Source[] = [];

  availableSources: Map<string, Source> = new Map<string, Source>([
    ['google-fit', {
      name: 'Google Fit',
      imageUrl: 'https://www.gstatic.com/images/branding/product/1x/gfit_512dp.png',
      routerLink: '/catpicker'
    }],
    ['withings', {
      name: 'Withings',
      imageUrl: 'http://resources.mynewsdesk.com/image/upload/c_limit,dpr_1.0,f_auto,h_700,q_auto,w_690/jymhygjz5t7hzld9qe6j.jpg',
      routerLink: '/catpicker'
    }]]);

  constructor(private conveyor: Conveyor) {
    this.addSources();
  }

  ngOnInit() {
  }

  addSources() {
    const platforms = this.conveyor.getPlatforms();
    this.sources = [];
    for (const platform of platforms) {
      if (this.availableSources.has(platform)) {
        this.sources.push(this.availableSources.get(platform));
      } else {
        this.sources.push({
          name: platform,
          imageUrl: '',
          routerLink: '/catpicker/'
        });
      }
    }
  }
}
