import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { Article } from '../../models/article';
import { PageOptions } from '../../models/page-options';
import { StockProvider } from '../../providers/stock/stock';
import { StockCountsProvider } from '../../providers/stock-counts/stock-counts';
import { StockFilterAllPage } from '../stock-filter-all/stock-filter-all';
import { StockFilterCreationPage } from '../stock-filter-creation/stock-filter-creation';
import { StockFilterSoldPage } from '../stock-filter-sold/stock-filter-sold';

/**
 * Generated class for the StockPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-stock',
  templateUrl: 'stock.html',
})
export class StockPage {

  stockFilterAll = StockFilterAllPage;
  stockFilterCreation = StockFilterCreationPage;
  stockFilterSold = StockFilterSoldPage;

  allCount: number;
  creationCount: number;
  soldCount: number;

  pageOptions: PageOptions;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public stockProvider: StockProvider,
    public stockCounts: StockCountsProvider
  ) { }

  initCounts(counts) {
    /*this.allCount = counts['all'];
    this.creationCount = counts['undefined'];
    this.soldCount = counts['sold'];
    this.stockCounts.setAll(counts['all']);
    this.stockCounts.setCreation(counts['creation']);
    this.stockCounts.setSold(counts['sold']);*/
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StockPage');
    this.pageOptions = new PageOptions(0);
    /*this.stockProvider.get(this.pageOptions).subscribe(
      response => this.initCounts(response.counts)
    );*/
  }

  ionViewWillLoad() {
    console.log('ionViewWillLoad StockPage');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter StockPage');
    this.fetchData();
  }

  fetchData() {
    console.log('Fetching data for StockPage');
  }

}
