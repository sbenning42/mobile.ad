import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { Article } from '../../models/article';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';

/**
 * Generated class for the NewTitleArticlePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-title-article',
  templateUrl: 'new-title-article.html',
})
export class NewTitleArticlePage {

  name: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: ApiProvider, public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewTitleArticlePage');
  }

  toaster(message, duration, cssClass, callback?) {
    const toast = this.toastCtrl.create({message, duration, cssClass});
    callback ? toast.onDidDismiss(callback) : undefined;
    toast.present();
  }

  save() {
    this.api.addProduct(<Article>{ name: this.name }).subscribe(
      apiArticle => {
        this.navParams.get('delegate').article.id = apiArticle.id;
        this.navCtrl.pop();
      },
      errors => {
        this.toaster(
          'Article Title must be at least 4 characters long.',
          1500, 'failure-toat');
      }
    );
  }

}
