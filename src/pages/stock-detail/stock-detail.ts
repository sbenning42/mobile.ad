import { Component, Output, EventEmitter } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { basePicturesApi } from './../../api/api';
import { Article } from '../../models/article';
import { ChannelsProvider } from '../../providers/channels/channels';

/**
 * Generated class for the StockDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

class StatusMatch {
  constructor(
    public key: string,
    public status: Status
  ) {}
}

class Status {
  constructor(
    public name: string,
    public checked: boolean,
    public disabled: boolean
  ) {}
}

@IonicPage()
@Component({
  selector: 'page-stock-detail',
  templateUrl: 'stock-detail.html',
})
export class StockDetailPage {

  sub: Subscription;
  article: Article;
  alreadySold: boolean;

  channels: any[];

  mkChannels: any[];
  feChannels: any[];

  status: StatusMatch[] = [];

  busy: boolean;
  delegate: any;

  updated = new EventEmitter();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public channelsProvider: ChannelsProvider
  ) {
    this.article = this.navParams.get('article');
    this.channels = this.navParams.get('channels');
    this.delegate = this.navParams.get('delegate');
    this.computeStatus();
    /*this.channelsProvider.get().subscribe(
      response => {
        this.mkChannels = response.filter(chMk => chMk.type === 1).map(chMk => { return {ch: chMk, status: this.searchStatusName(chMk)}; });
        this.feChannels = response.filter(chFe => chFe.type === 2).map(chFe => { return {ch: chFe, status: this.searchStatusName(chFe)}; });
        
      }
    );*/
  }

  computeStatus() {
    this.status = [];
    this.mkChannels = [];
    this.feChannels = [];
    this.channels.forEach(ch => {
      this.status.push(new StatusMatch(ch.name, undefined));
      if (+ch.type === 1) {
        this.mkChannels.push(ch);
      } else {
        this.feChannels.push(ch);
      }
    });
    if (!this.article['marketplaces']) { return ; }
    this.article['marketplaces'].forEach(ch => {
      const status = this.status.find(s => s.key === ch.name);
      if (!status) { return ; }
      const name = ch.status ? ch.status.name : undefined;
      this.alreadySold = this.alreadySold || name === 'Sold';
      const disabled = this.alreadySold ? true : false;
      const checked = name && name !== 'Remove' ? true : false;
      status.status = new Status(name, checked, disabled);
    });
  }

  getStatus(name: string) {
    const status = this.status.find(s => {
      return s.key === name;
    });
    return status ? status.status : undefined;
  }

  register(channel) {
    console.log('Got called');
    if (this.busy) { return ; }
    console.log('Actually do work');
    this.busy = true;
    this.sub = this.channelsProvider.publish(this.article, channel).subscribe(
      response => {
        this.article = this.getPrincipale(response);
        this.computeStatus();
        this.delegate.maj(this.article);
      },
      error => {},
      () => {this.busy = false;}
    );
  }

  getPrincipale(product: Article): Article {
    if (product.principale) { return ; }
    const principale = product['pictures'] ?
    product['pictures'].find(picture => +picture['principal'] === 1) :
      undefined;
      product.principale = principale ?
      basePicturesApi + principale.url_thumb :
      (product['pictures'] && product['pictures'][0] ?
        basePicturesApi + product['pictures'][0].url_thumb :
        'assets/imgs/addef.jpg');
      product.principaleB = principale ?
        basePicturesApi + principale.url_img :
        (product['pictures'] && product['pictures'][0] ?
          basePicturesApi + product['pictures'][0].url_img :
          'assets/imgs/addef.jpg');
    return product;
  }





  ionWillLeave() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }






  searchStatusName(channel): string {
    if (!this.article['marketplaces']) { return ''; }
    const mk = this.article['marketplaces'].find(ch => +ch.id === +channel.id);
    return mk && mk.status ? mk.status.name : '';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StockDetailPage');
  }

}
