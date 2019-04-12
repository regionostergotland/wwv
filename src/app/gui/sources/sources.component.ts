import { Component, OnInit } from '@angular/core';
import { Source } from '../../source';
import { Conveyor } from '../../conveyor.service';
import { Router } from '@angular/router';
import { GoogleAuthService } from 'ng-gapi';
import { GfitService } from '../../platform/gfit.service';

const googleFit = 'google-fit';
const withings = 'withings';
const dummy = 'dummy';

const availableSources: Map<string, Source> = new Map<string, Source>([
  [googleFit, {
    id: googleFit,
    name: 'Google Fit',
    imageUrl: 'https://www.gstatic.com/images/branding/product/1x/gfit_512dp.png',
    routerLink: '/pick-categories'
  }],
  [dummy, {
    id: dummy,
    name: 'Dummy service',
    imageUrl: '../assets/wwv.png',
    routerLink: '/catpicker'
  }],
  [withings, {
    id: withings,
    name: 'Withings',
    imageUrl: 'http://resources.mynewsdesk.com/image/upload/c_limit,dpr_1.0,f_auto,h_700,q_auto,w_690/jymhygjz5t7hzld9qe6j.jpg',
    routerLink: '/pick-categories'
  }]]);

@Component({
  selector: 'app-sources',
  templateUrl: './sources.component.html',
  styleUrls: ['./sources.component.scss']
})
export class SourcesComponent implements OnInit {

  sources: Source[] = [];

  constructor(
    private conveyor: Conveyor,
    private gfitService: GfitService,
    private router: Router,
    private googleAuth: GoogleAuthService) {
    this.addSources();
  }

  ngOnInit() {
  }

  /**
   * Adds all platforms of the conveyor to the sources list.
   */
  addSources() {
    const platforms = this.conveyor.getPlatforms();
    this.sources = [];
    for (const platform of platforms) {
      if (availableSources.has(platform)) {
        this.sources.push(availableSources.get(platform));
      } else {
        this.sources.push({
          id: platform,
          name: platform,
          imageUrl: '',
          routerLink: '/pick-categories/'
        });
      }
    }
  }

  async selectPlatform(platformId: string) {
    this.conveyor.selectPlatform(platformId);
    await this.conveyor.signIn(platformId);
    this.router.navigateByUrl('/pick-categories');
  }
}
