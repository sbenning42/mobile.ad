import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { basePicturesApi } from './../../api/api';

/**
 * Generated class for the SliderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-slider',
  templateUrl: 'slider.html',
})
export class SliderPage {

  pictures: string[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.pictures = this.navParams.get('pictures').map(pic => basePicturesApi + pic.url_img);
    const index = this.navParams.get('index');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SliderPage');
  }

}
