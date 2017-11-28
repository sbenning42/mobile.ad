import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { basePicturesApi } from '../../api/api';
import { GalleryProvider } from '../../providers/gallery/gallery';
import { GalleryModeProvider } from '../../providers/gallery-mode/gallery-mode';
import { ApiProvider } from './../../providers/api/api';
import { Article } from '../../models/article';
import { PageOptions } from '../../models/page-options';
import { ContactPage } from '../contact/contact';
import { GalleryDetailPage } from '../gallery-detail/gallery-detail';

/**
 * Generated class for the GalleryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-gallery',
  templateUrl: 'gallery.html',
})
export class GalleryPage {

  basePicturesApi = basePicturesApi;

  articles: Article[];
  pageOptions: PageOptions;

  mode$: Observable<string>;

  gallery$: Observable<Article[]>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private gallery: GalleryProvider,
    private galleryMode: GalleryModeProvider,
    private api: ApiProvider
  ) {
    this.mode$ = this.galleryMode.get();
    this.fetchData();
    /*this.gallery$ = this.api.getGallery(new PageOptions(0)).do(
      gallery => {
        console.log(JSON.stringify(gallery));
        gallery.products.forEach(article => article.pictures.sort((p1, p2) => p1.principal ? -1 : (p2.principal ? 1 : 0)));
      });*/
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GalleryPage');
    this.articles = [];
    this.fetchData();
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter GalleryPage');
  }

  fetchData() {
    console.log('Fetching data for GalleryPage');
    this.pageOptions = new PageOptions(0);
    const loader = this.presentLoading();
    this.gallery.get(this.pageOptions)
      .do(
        response => this.pageOptions.reNew(response.count)
      ).subscribe(
        response => this.getPrincipale(this.articles = response.products),
        error => {},
        () => {
          this.pageOptions.nextPage();
          this.dismissLoading(loader);
        }
      );
  }

  nextPage(infiniteScroll) {
    this.gallery.get(this.pageOptions)
      .do(response => infiniteScroll.complete())
      .subscribe(
        response => this.articles = this.articles.concat(this.getPrincipale(response.products)),
        error => {},
        () => this.pageOptions.nextPage()
      );
  }

  getPrincipale(articles: Article[]): Article[] {
    articles.forEach(article => {
      if (article.principale) { return ; }
      const principale = article['pictures'] ?
        article['pictures'].find(picture => +picture['principal'] === 1) :
        undefined;
      article.principale = principale ?
        basePicturesApi + principale.url_thumb :
        (article['pictures'] && article['pictures'][0] ?
          basePicturesApi + article['pictures'][0].url_thumb :
          'assets/imgs/addef.jpg');
      article.principaleB = principale ?
        basePicturesApi + principale.url_img :
        (article['pictures'] && article['pictures'][0] ?
            basePicturesApi + article['pictures'][0].url_img :
            'assets/imgs/addef.jpg');
    });
    return articles;
  }

  contact(article: Article) {
    this.navCtrl.push(ContactPage, {user: article['user']});
  }

  details(article: Article) {
    this.navCtrl.push(GalleryDetailPage, {article: article});
  }

  presentLoading() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    return loading;
  }

  dismissLoading(loading) {
    loading.dismiss();
  }

  changeGalleryMode() {
    this.galleryMode.change();
  }

}
