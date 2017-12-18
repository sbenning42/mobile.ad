import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Article } from '../../models/article';
import { ApiProvider } from '../../providers/api/api';

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

  pictures: string[] = [];
  length: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public camera: Camera,
    public api: ApiProvider
  ) {
    this.article = new Article();
    this.article.pictures = ['test'];
    this.length = 1;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPage');
    this.takePicture();
  }

  takePicture() {
    const cameraOptions: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 1200,
      targetHeight: 1200,
    }
    this.camera.getPicture(cameraOptions).then((imageData) => {
      this.article.pictures.push(imageData);
      this.length = this.pictures.length;
     }, (err) => {});
  }

  submit() {
    this.pictures = this.article.pictures;
    const sub = this.api.addProduct(this.article).switchMap(article => {
      this.article = article;
      return this.api.uploadArticlePicture(this.article, this.pictures);
    }).subscribe()
  }

}
