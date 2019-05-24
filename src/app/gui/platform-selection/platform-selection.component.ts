import { Component, OnInit } from '@angular/core';
import { Conveyor } from '../../conveyor.service';
import { Router } from '@angular/router';

interface Source {
  id: string;
  name: string;
  imageUrl: string;
}

const googleFit = 'google-fit';
const withings = 'withings';
const dummy = 'dummy';
const pickCategoriesLink = '/pick-categories';

const availableSources: Map<string, Source> = new Map<string, Source>([
  [googleFit, {
    id: googleFit,
    name: 'Google Fit',
    imageUrl: 'https://www.gstatic.com/images/branding/product/1x/gfit_512dp.png',
  }],
  [dummy, {
    id: dummy,
    name: 'Dummy service',
    imageUrl: '../assets/wwv.png',
  }],
  [withings, {
    id: withings,
    name: 'Withings',
    imageUrl: 'http://resources.mynewsdesk.com/image/upload/c_limit,dpr_1.0,f_auto,h_700,q_auto,w_690/jymhygjz5t7hzld9qe6j.jpg',
  }]]);

@Component({
  selector: 'app-platform-selection',
  templateUrl: './platform-selection.component.html',
  styleUrls: ['./platform-selection.component.scss']
})
export class PlatformSelectionComponent implements OnInit {
  sources: Source[] = [];

  constructor(
    private conveyor: Conveyor,
    private router: Router
  ) {
    const platforms = this.conveyor.getPlatforms();
    this.sources = [];
    for (const platform of platforms) {
      let source: Source;
      if (availableSources.has(platform)) {
        source = availableSources.get(platform);
      } else {
        this.sources.push({
          id: platform,
          name: platform,
          imageUrl: '',
        });
      }
      this.sources.push(source);
    }
  }

  ngOnInit() {}

  async selectPlatform(platformId: string) {
    await this.conveyor.signIn(platformId);
    this.router.navigate(['/pick-categories', platformId]);
  }
}
