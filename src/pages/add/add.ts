import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Article } from '../../models/article';
import { ApiProvider } from '../../providers/api/api';
import { CameraProvider } from '../../providers/camera/camera';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

/**
 * Generated class for the AddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add',
  templateUrl: 'add.html',
})
export class AddPage {

  article: Article;
  error: string;

  sub: Subscription;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public camera: CameraProvider,
    public api: ApiProvider
  ) {
    this.article = new Article();
    this.article.pictures = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPage');
    this.sub = this.camera.cameraError$
      .switchMap((errors: string[]) => {
        this.error = errors && errors.length ? errors[errors.length - 1] : '';
        return this.camera.pictures$;
      }).subscribe((pictures: string[]) => this.article.pictures = pictures);
    this.takePicture();
  }

  ionViewWillLeave() {
    this.sub.unsubscribe();
  }

  takePicture() {
    this.camera.takeShot();
  }

  submit() {
    const pictures = this.article.pictures;
    const sub = this.api.addProduct(this.article)
      .switchMap(article => {
        this.article = article;
        return Observable.of(1);// this.api.uploadArticlePicture(this.article, pictures);
      }).subscribe()
  }

}
