import { Component, NgZone } from '@angular/core';

import { NavController, Platform } from 'ionic-angular';
import { DBMeter } from 'ionic-native';
import 'rxjs/Rx';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public loudness: number = 0;
  public currentSec: number[] = [];
  public timeout: any;

  constructor(public navCtrl: NavController, public platform: Platform, public zone: NgZone) {
    this.platform.ready().then(() => {
      DBMeter.start().subscribe(data => {
        this.zone.run(() => {
          // console.log(data);s
          if (this.loudness != 0) {
            this.currentSec.push(data);
          }else {
            this.loudness = data;
          }
        });
      });
    });
    this.applyValues();
  }

  applyValues() {
    setTimeout(() => {
      if (this.currentSec.length) {
        let sum = 0;
        for (let num of this.currentSec) {
          sum += num;
        }
        this.loudness = Number((sum / this.currentSec.length).toFixed(0));
        this.currentSec = [];
      }
      this.applyValues();
    }, 1000);
  }
}
