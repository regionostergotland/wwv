import { Component, OnInit } from '@angular/core';
import { Source } from '../source'

@Component({
  selector: 'app-wwv-sources',
  templateUrl: './wwv-sources.component.html',
  styleUrls: ['./wwv-sources.component.scss']
})
export class WwvSourcesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  sources : Source[] = [
    {name: 'Google Fit', imageUrl: 'https://www.gstatic.com/images/branding/product/1x/gfit_512dp.png'},
    {name: 'Withings', imageUrl: 'http://resources.mynewsdesk.com/image/upload/c_limit,dpr_1.0,f_auto,h_700,q_auto,w_690/jymhygjz5t7hzld9qe6j.jpg'}
  ];

}
