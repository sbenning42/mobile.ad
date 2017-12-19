import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Camera } from '@ionic-native/camera';

/*
  Generated class for the CameraProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CameraProvider {

  pictures: any[] = [];
  
  constructor(public camera: Camera) {
    console.log('Hello CameraProvider Provider');
  }
/*
  take(): any {
    this.camera.getPicture(cameraOptions).then((imageData) => {
      this.article.pictures.push(imageData);
      this.length = this.pictures.length;
     }, (err) => {});
  }*/

}
    /*const cameraOptions: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 1200,
      targetHeight: 1200,
    }*/
