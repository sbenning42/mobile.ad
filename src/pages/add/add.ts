import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Article } from '../../models/article';
import { ApiProvider } from '../../providers/api/api';
import { CameraProvider } from '../../providers/camera/camera';

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

  length: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    // public camera: Camera,
    public camera: CameraProvider,
    public api: ApiProvider
  ) {
    this.article = new Article();
    this.article.pictures = [];
    this.length = 0;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPage');
    this.takePicture();
  }

  takePicture() {
    this.camera.take((imageData) => {
      this.article.pictures.push(imageData);
      this.length = this.article.pictures.length;
     }, (err) => {
       console.log(JSON.stringify(err));
     });
  }

  submit() {
    const pictures = this.article.pictures;
    const sub = this.api.addProduct(this.article).switchMap(article => {
      this.article = article;
      return this.api.uploadArticlePicture(this.article, pictures);
    }).subscribe()
  }

}
