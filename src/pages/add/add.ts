import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Article } from '../../models/article';
import { ApiProvider } from '../../providers/api/api';
import { CameraProvider } from '../../providers/camera/camera';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { PicturesLoopComponent } from '../../components/pictures-loop/pictures-loop';

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

  pictures$: Observable<string[]>;
  errors$: Observable<string[]>;
  checked = 0;

  settings: string;

  steps = [
    'camera', 'book', 'ribbon', 'pin', 'document'
  ];
  step = 0;

  constructor(public navCtrl: NavController, public camera: CameraProvider, public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    this.pictures$ = this.camera.pictures$;
    this.errors$ = this.camera.errors$;
    this.takeLoop();
  }

  takeLoop() {
    this.camera.takeOne();
    const loop = this.modalCtrl.create(PicturesLoopComponent);
    loop.onDidDismiss(finish => finish ? undefined : this.takeLoop())
    loop.present();
  }

  setPrincipale(index) {
    this.checked = index;
  }

  orderUp(index: number) {
    if (!index) {
      return ;
    }
    // TODO
  }

  orderDown(index: number) {
    // TODO
  }

  remove(index: number) {
    this.camera.removePicture(index);
  }

  stepUp() {
    this.step = (this.step + 1) % 4;
  }

  stepDown() {
    const step = (this.step - 1) % 4;
    this.step = step < 0 ? 0 : step;
  }

  gotoStep($event) {
    this.step = $event;
  }

  saveDraft() {
  }

  save() {
    this.saveDraft();
  }

}
