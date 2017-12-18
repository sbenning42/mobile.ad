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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public camera: Camera
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPage');
    const cameraOptions: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(cameraOptions).then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;
     }, (err) => {
       console.log(JSON.stringify(err));
     });
  }

}
