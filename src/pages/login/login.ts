import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { LoginModalPage } from './../../pages/login-modal/login-modal';
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modelCtrl: ModalController
  ) { }

  ionViewWillLoad() {
    const modal = this.modelCtrl.create(LoginModalPage);
    modal.present();
    console.log('ionViewDidLoad LoginPage');
  }

}
