import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { Article } from '../../models/article';
import { ChannelsProvider } from '../../providers/channels/channels';

/**
 * Generated class for the StockDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-stock-detail',
  templateUrl: 'stock-detail.html',
})
export class StockDetailPage {

  article: Article;

  myChannels: any[];

  mkChannels: any[];
  feChannels: any[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public channelsProvider: ChannelsProvider
  ) {
    this.article = this.navParams.get('article');
    this.channelsProvider.get().subscribe(
      response => {
        this.mkChannels = response.filter(chMk => chMk.type === 1).map(chMk => { return {ch: chMk, status: this.searchStatusName(chMk)}; });
        this.feChannels = response.filter(chFe => chFe.type === 2).map(chFe => { return {ch: chFe, status: this.searchStatusName(chFe)}; });
        
      }
    );
  }

  searchStatusName(channel): string {
    if (!this.article['marketplaces']) { return ''; }
    const mk = this.article['marketplaces'].find(ch => +ch.id === +channel.id);
    return mk && mk.status ? mk.status.name : '';
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad StockDetailPage');
  }

  handlePublicationOn(channel) {
    this.channelsProvider.publish(this.article, channel.ch).subscribe(
      response => {
        this.navParams.get('from').majArticle(response);
        this.mkChannels.forEach(mk => mk.status = this.searchStatusName(mk));
        this.feChannels.forEach(fe => fe.status = this.searchStatusName(fe));
      }
    );
  }

}
