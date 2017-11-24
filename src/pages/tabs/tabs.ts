import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AuthProvider } from '../../providers/auth/auth';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { GalleryPage } from '../gallery/gallery';
import { AddPage } from '../add/add';
import { StockPage } from '../stock/stock';
import { AccountPage } from '../account/account';
import { LoginPage } from '../login/login';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  homeRoot = HomePage;
  galleryRoot = GalleryPage;
  addRoot = AddPage;
  stockRoot = StockPage;
  accountRoot = AccountPage;
  loginRoot = LoginPage;

  logged$: Observable<boolean>;

  constructor(
    private auth: AuthProvider
  ) {
    this.logged$ = this.auth.isLoggedStream();
  }
}
