import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { Article } from '../../models/article';
import { PageOptions } from '../../models/page-options';
import { StockProvider } from '../../providers/stock/stock';
import { StockModeProvider } from '../../providers/stock-mode/stock-mode';
import { StockCountsProvider } from '../../providers/stock-counts/stock-counts';

import { basePicturesApi } from '../../api/api';
import { GalleryProvider } from '../../providers/gallery/gallery';
import { GalleryModeProvider } from '../../providers/gallery-mode/gallery-mode';
import { ApiProvider } from './../../providers/api/api';
import { ContactPage } from '../contact/contact';
import { StockDetailPage } from '../stock-detail/stock-detail';
import { StoreMyArticlesProvider } from '../../providers/store-my-articles/store-my-articles';
import { AddPage } from '../add/add';
import { ChannelsProvider } from '../../providers/channels/channels';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

/**
 * Generated class for the StockPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

class Movement {
  
  active: boolean;
  originalPoint: Touch;
  point: Touch;

  direction: number;

  eventKey: string

  start($event: any) {
    this.active = true;
    this.point = $event.touches.item(0);
    this.originalPoint = this.point;
  }

  move($event: any) {
    const newPoint = $event.touches.item(0);
    this.direction = (newPoint.clientX === this.originalPoint.clientX
      ? 0
      : (newPoint.clientX > this.originalPoint.clientX ? 1 : -1));
    this.point = newPoint;
  }

  end($event: any) {
    this.eventKey = (this.direction === undefined
      ? 'click'
      : (this.direction === 1 ? 'swiperight' : 'swipeleft'));
    this.active = false;
    this.originalPoint = undefined;
    this.point = undefined;
    this.direction = undefined;
  }

}

@IonicPage()
@Component({
  selector: 'page-stock',
  templateUrl: 'stock.html',
})
export class StockPage {

  pageOptions: PageOptions;
  articles: Article[];
  styles: any[];
  mode$: Observable<string>;

  channels: any[];

  detail: number;

  managed: Article;

  movement: Movement = new Movement();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public stockProvider: StockProvider,
    public stockMode: StockModeProvider,
    public stockCounts: StockCountsProvider,
    private api: ApiProvider,
    private articlesStore: StoreMyArticlesProvider,
    public channelsProvider: ChannelsProvider
  ) {
    this.mode$ = this.stockMode.get();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StockPage');
    this.pageOptions = new PageOptions(0);
    // this.api.getContractedChannels()
    this.channelsProvider.get()
      .do(response => {
        this.channels = response;
      })
      .switchMap(() => this.stockProvider.get(this.pageOptions))
      .do(
        response => this.pageOptions.reNew(response.count)
      )
      .subscribe(
        response => {
          this.articles = this.getPrincipalePicture(response.products);
          // this.styles = this.articles.map(art => 'translateX(0)');
          this.styles = this.articles.map(art => ({contain: {}, left: {}, right: {}}));
          console.log('Got a next in index ' + this.pageOptions.index);
          this.pageOptions.nextPage();
          console.log('completed with index: ' + this.pageOptions.index);
        },
        error => {
          console.log('Got an error in index ' + this.pageOptions.index);
        },
        () => {
        });
  }

  touchstart($event, article, index) {
    this.movement.start($event);
  }

  touchend($event, article, index) {
    this.movement.end($event);
    switch (this.movement.eventKey) {
      case 'click':
        this.details(article, index);
        break ;
      case 'swipeleft':
        this.styles = this.articles.map(art => ({contain: {}, left: {}, right: {}}));
        this.styles[index] = {contain: {}, left: {transform: 'translateX(-80px)'}, right: {width: '80px'}};
        this.managed = article;
        break ;
      case 'swiperight':
        this.styles = this.articles.map(art => ({contain: {}, left: {}, right: {}}));
        this.managed = undefined;
        break ;
      default:
        this.styles = this.articles.map(art => ({contain: {}, left: {}, right: {}}));
        break ;
    }
  }

  touchmove($event, article, index) {
    this.movement.move($event);
    const el = <HTMLElement>$event.target;
    const left = (-(this.movement.originalPoint.clientX - this.movement.point.clientX));
    switch (this.movement.direction) {
      case -1:
        this.styles = this.articles.map(art => ({contain: {}, left: {}, right: {}}));
        this.styles[index] = {contain: {}, left: {transform: 'translateX(' + (left < 0 ? (left > -80 ? left : -80) : 0) + 'px)'}, right: {width: -(left < 0 ? (left > -80 ? left : -80) : 0) + 'px'}};
        break ;
      case 1:
        this.styles = this.articles.map(art => ({contain: {}, left: {}, right: {}}));
        this.styles[index] = {contain: {}, left: {transform: 'translateX(' + (left < 0 ? (left > -80 ? left : -80) : 0) + 'px)'}, right: {width: -(left < 0 ? (left > -80 ? left : -80) : 0) + 'px'}};
        break ;
    }
  }

  read() {
    const key = 'r';
    const data = new PageOptions(0, 5, 1);
    this.articlesStore.apply({key, data});
  }

  create() {

  }

  update() {

  }

  alreadySold(article: Article): boolean {
    let alreadySold = false;
    article['marketplaces'].forEach(ch => {
      if (!ch.status) { return ; }
      const name = ch.status.name;
      alreadySold = alreadySold || name === 'Sold';
    });
    return alreadySold;
  }

  deleteHook(article: Article) {
    if (this.alreadySold(article)) { return ; }
    if (!confirm('Are you surte you want to delete that article?')) { return ; }
    this.channelsProvider.delete(article).subscribe(response => this.delete(article));
  }

  modifyHook(article: Article) {
    this.navCtrl.push(AddPage, { article: article });
  }

  getPrincipalePicture(products: Article[]): Article[] {
    products.forEach((product: Article) => {
      if (product.principale) { return ; }
      const principale = product['pictures'] ?
      product['pictures'].find(picture => +picture['principal'] === 1) :
        undefined;
        product.principale = principale ?
        basePicturesApi + principale.url_thumb :
        (product['pictures'] && product['pictures'][0] ?
          basePicturesApi + product['pictures'][0].url_thumb :
          '../assets/imgs/addef.jpg');
        product.principaleB = principale ?
          basePicturesApi + principale.url_img :
          (product['pictures'] && product['pictures'][0] ?
            basePicturesApi + product['pictures'][0].url_img :
            '../assets/imgs/addef.jpg');
    });
    return products;
  }

  nextPage(infiniteScroll) {
    this.stockProvider.get(this.pageOptions)
      .do(response => infiniteScroll.complete())
      .subscribe(
        response => this.articles = this.articles.concat(this.getPrincipalePicture(response.products)),
        error => {},
        () => this.pageOptions.nextPage()
      );
  }

  changeGalleryMode() {
    this.stockMode.change();
  }

  reload(infiniteScroll) {
    this.pageOptions = new PageOptions(0);
    this.stockProvider.get(this.pageOptions)
      .do(
        response => this.pageOptions.reNew(response.count)
      ).do(response => infiniteScroll.complete())
        .subscribe(
        response => this.getPrincipalePicture(this.articles = response.products),
        error => {},
        () => this.pageOptions.nextPage()
      );
  }

  details(article: Article, index) {
    this.detail = index;
    this.navCtrl.push(StockDetailPage, {article: article, channels: this.channels, delegate: this});
  }

  manage(article: Article, index: number) {

  }

  maj(article: Article) {
    console.log('Have to maj ' + article);
    this.articles[this.detail] = article;
  }

  delete(article: Article) {
    this.articles = this.articles.filter(art => +art.id !== +article.id);
    this.pageOptions.reNew(this.pageOptions.count - 1);
  }

  ionViewWillLoad() {
    console.log('ionViewWillLoad StockPage');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter StockPage');
  }

  consolog(m) {
    console.log(m);
  }

}
