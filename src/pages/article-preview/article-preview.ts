import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Article } from '../../models/article';
import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the ArticlePreviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-article-preview',
  templateUrl: 'article-preview.html',
})
export class ArticlePreviewPage {

  article: Article;
  selected: { [key: string]: { id: string, name: string } };
  pictures$: Observable<string[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ArticlePreviewPage');
    this.article = this.navParams.get('article');
    console.log('article: ' + this.article);
    this.selected = this.navParams.get('selected');
    console.log('selected: ' + this.selected);
    this.pictures$ = this.navParams.get('pictures$');
    console.log('pictures$: ' + this.pictures$);
  }

  goto(x) {
    const delegate = this.navParams.get('delegate');
    delegate.gotoStep(x);
    this.navCtrl.pop();
  }

}
