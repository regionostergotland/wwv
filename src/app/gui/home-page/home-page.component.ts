import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/config.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  assetUrl: string;

  constructor(cfg: ConfigService) {
    this.assetUrl = cfg.getAssetUrl();
  }

  ngOnInit() { }
}
