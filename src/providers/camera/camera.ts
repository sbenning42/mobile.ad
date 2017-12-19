import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';

/*
  Generated class for the CameraProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CameraProvider {

  pictures: any[] = [];
  options: CameraOptions;
  
  constructor(public camera: Camera) {
    console.log('Hello CameraProvider Provider');
    this.options = <CameraOptions>{
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 600,
      targetHeight: 600,
    };
  }

  take(then: (imageData: any) => void, err: (errors: any) => void): any {
    this.camera.getPicture(this.options).then(then, err);
  }

}
