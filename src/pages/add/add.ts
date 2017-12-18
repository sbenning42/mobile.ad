import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

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

  message;

  pictures: string[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public camera: Camera
  ) {
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
      this.pictures.push(imageData);
     }, (err) => {});
  }

}
