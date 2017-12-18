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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public camera: Camera
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPage');
  }

  takePicture() {
    const cameraOptions: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 600,
      targetHeight: 600,
    }
    this.message = 'Trying to lauch camera...';
    this.camera.getPicture(cameraOptions).then((imageData) => {
      this.message = 'SUCCESS: '  + JSON.stringify(imageData);
      console.log('SUCCESS: '  + JSON.stringify(imageData));
      let base64Image = 'data:image/jpeg;base64,' + imageData;
     }, (err) => {
       this.message = 'FAILURE: ' + JSON.stringify(err);
       console.log('FAILURE: ' + JSON.stringify(err));
     });
  }

}
