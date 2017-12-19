import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the CameraProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CameraProvider {

  options: CameraOptions = <CameraOptions>{
    quality: 100,
    targetWidth: 900,
    targetHeight: 600,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    saveToPhotoAlbum: false,
    allowEdit: true,
    sourceType: 1
  };

  private pictures: string[] = [];
  private errors: string[] = [];

  private _pictures$: BehaviorSubject<string[]> = new BehaviorSubject(this.pictures);
  pictures$: Observable<string[]> = this._pictures$.asObservable();

  private _cameraError$: BehaviorSubject<string[]> = new BehaviorSubject(this.errors);
  cameraError$: Observable<string[]> = this._cameraError$.asObservable();
  
  constructor(public camera: Camera) {
    console.log('Hello CameraProvider Provider');
  }

  takeShot(): any {
    this.camera.getPicture(this.options).then((imageData) => {
      const base64Image = 'data:image/jpeg;base64,' + imageData;
      this.pictures.push(base64Image);
      this._pictures$.next(this.pictures);
    }, err => {
      const stringError = JSON.stringify(err);
      this.errors.push(stringError);
      this._cameraError$.next(this.errors);
    });
  }

}
