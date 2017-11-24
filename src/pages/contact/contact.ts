import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { basePicturesApi } from './../../api/api';
import { User } from './../../models/user';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  
  contact: User;
  basePicturesApi = basePicturesApi;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.contact = this.navParams.data.user;
  }

  dismiss() {
    this.navCtrl.pop();
  }

}
