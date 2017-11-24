import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { AuthProvider } from '../../providers/auth/auth';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  logged$: Observable<boolean>;

  constructor(
    public navCtrl: NavController,
    private auth: AuthProvider
  ) {
    this.logged$ = this.auth.isLoggedStream();
  }

  logout() {
    this.auth.logout();
  }
}
