import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { normalizeURL } from 'ionic-angular/util/util';

/*
  Generated class for the CameraProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CameraProvider {

  private options: CameraOptions = {
    quality: 100,
    targetWidth: 1200,
    targetHeight: 1200,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    saveToPhotoAlbum: false,
    allowEdit: true,
    sourceType: 1
  }

  private specialOptions: CameraOptions = {
    quality: 100,
    targetWidth: 1200,
    targetHeight: 1200,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    saveToPhotoAlbum: false,
    allowEdit: true,
    sourceType: 1
  }

  private pictures: string[] = [];
  private _pictures$: BehaviorSubject<string[]> = new BehaviorSubject(this.pictures);
  pictures$: Observable<string[]> = this._pictures$.asObservable();

  private errors: string[] = [];
  private _errors$: BehaviorSubject<string[]> = new BehaviorSubject(this.errors);
  errors$: Observable<string[]> = this._errors$.asObservable();

  constructor(private camera: Camera) {
    console.log('Hello CameraProvider Provider');
  }

  private publishPictures(picture?: string) {
    if (picture) {
      this.pictures.push(picture);
    }
    this._pictures$.next(this.pictures);
  }

  private publishErrors(error?: string) {
    if (error) {
      this.errors.push(error);
    }
    this._errors$.next(this.errors);
  }

  takeOne() {
    this.camera.getPicture(this.options).then(
      imageData => this.publishPictures('data:image/jpeg;base64,' + imageData),
      error => this.publishErrors('CameraProvider@takeOne,err: ' + JSON.stringify(error)));
  }

  takeOneSpecial() {
    this.camera.getPicture(this.specialOptions).then(
      imageData => {
        getDataUri(imageData, function(dataUri) {
          this.publishPictures(dataUri);
        });
      },
      error => this.publishErrors('CameraProvider@takeOne,err: ' + JSON.stringify(error)));
  }

  removePicture(index: number) {
    this.pictures = this.pictures.filter((picture, i) => i !== index);
    this.publishPictures();
  }

  removeError(index: number) {
    this.errors = this.errors.filter((error, i) => i !== index);
  }

  deploy(): string[] {
    const pictures = this.pictures;
    this.pictures = [];
    this.errors = [];
    this.publishPictures();
    this.publishErrors();
    return pictures;
  }

  has(): boolean {
    return this.pictures && this.pictures.length > 0;
  }

}

function getDataUri(url, callback) {
  var image = new Image();

  image.onload = function () {
      var canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth; // or 'width' if you want a special/scaled size
      canvas.height = image.naturalHeight; // or 'height' if you want a special/scaled size
      canvas.getContext('2d').drawImage(<HTMLImageElement>image, 0, 0);
      callback(canvas.toDataURL('image/png'));
  };

  image.src = url;
}