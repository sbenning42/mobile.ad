import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { basePicturesApi, baseApi } from './../../api/api';
import { User } from '../../models/user'
import { AuthProvider } from './../../providers/auth/auth';
import { ApiProvider } from './../../providers/api/api';

@Component({
  selector: 'page-a-ccount',
  templateUrl: 'a-ccount.html'
})
export class ACcountPage {

  user: User;
  account: any;
  role: string;

  userSince: string;
  dateStart: string;
  dateEnd: string;

  channels: any[];

  basePictureApi = basePicturesApi;

  constructor(
    public navCtrl: NavController,
    private auth: AuthProvider,
    private api: ApiProvider
  ) { }

  ionViewWillLoad() {
    this.api.getUser()
      .do(user => {
        this.user = user;
        this.role = +user.role_id === 2 ?
          'Sponsor' :
          +user.role_id === 3 ?
            'Partner' :
            +user.role_id === 1 ?'Admin' : 'None';
        this.userSince = user['created_at'];
      }).switchMap(() => this.api.getUserAccount(+this.user.id))
      .do(account => {
        this.account = account;
        this.dateStart = account.start_account;
        this.dateEnd = account.end_account;
      }).switchMap(() => this.api.getChannels())
        .do(channels => this.channels = channels.filter(ch => ch.name !== 'Gallery').map(ch => {
          const mk = this.user['marketplaces'].find(mk => mk.name === ch.name);
          ch['checked'] = false;
          if (! mk) { return ch; }
          ch['checked'] = mk.status.name === 'Contracted' ? true : false;
        return ch;
      })).subscribe();
  }
  
}
