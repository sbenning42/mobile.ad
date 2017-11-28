import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { basePicturesApi } from './../../api/api';
import { User } from './../../models/user';
import { Article } from './../../models/article';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  
  articles: Article[];
  contact: User;
  basePicturesApi = basePicturesApi;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.contact = this.navParams.data.user;
    this.articles = this.navParams.data.articles;
  }

  dismiss() {
    this.navCtrl.pop();
  }

}
