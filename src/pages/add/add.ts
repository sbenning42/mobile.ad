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
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AnnexesProvider } from '../../providers/annexes/annexes';

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

  article: Article = new Article();

  pictures$: Observable<string[]>;
  errors$: Observable<string[]>;
  checked = 0;

  private focus = '';
  private _focus$: BehaviorSubject<string> = new BehaviorSubject(this.focus);
  focus$: Observable<string> = this._focus$.asObservable();

  selected = {
    category: '', style: '', periods: '',
    condition: '', material: '', color: '',
    designer: '', brand: ''
  };

  steps = [
    {icon: 'camera', color: '#f44336'},
    {icon: 'book', color: '#f44336'},
    {icon: 'pin', color: '#f44336'},
    {icon: 'ribbon', color: '#4caf50'},
    {icon: 'document', color: '#4caf50'}
  ];
  step = 0;

  private items: {id: string, name: string}[] = [];
  private _items$: BehaviorSubject<{id: string, name: string}[]> = new BehaviorSubject(this.items);
  items$: Observable<{id: string, name: string}[]> = this._items$.asObservable();

  sub: Subscription;

  constructor(
    public navCtrl: NavController,
    public camera: CameraProvider,
    public modalCtrl: ModalController,
    public annexes: AnnexesProvider
  ) { }

  ionViewDidLoad() {
    this.sub = this.focus$.subscribe(focus => {
      this.items = focus ? [
        { id: '0', name: 'test1' },
        { id: '0', name: 'test2' },
        { id: '0', name: 'test3' },
        { id: '0', name: 'test4' }
      ] : [];
      this._items$.next(this.items);
    });
    this.pictures$ = this.camera.pictures$;
    this.errors$ = this.camera.errors$;
    this.takeLoop();
  }

  ionViewDidLeave() {
    this.sub.unsubscribe();
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

  remove(index: number) {
    this.camera.removePicture(index);
  }

  removeError(index: number) {
    this.camera.removeError(index);
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

  setFocus(key: string) {
    this.focus = key;
    this._focus$.next(key);
  }

  getItems(key: string, search: string) {
    this.items = this.items.filter(item => {
      return item.name.search(search) < 0 ? false : true;
    });
    this._items$.next(this.items);
  }

}
