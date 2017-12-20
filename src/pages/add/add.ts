import { Component, ViewChild, ElementRef } from '@angular/core';
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

  @ViewChild('categoryInput', {read: ElementRef}) private categoryEl: ElementRef;
  @ViewChild('styleInput', {read: ElementRef}) private styleEl: ElementRef;
  @ViewChild('periodsInput', {read: ElementRef}) private periodsEl: ElementRef;
  @ViewChild('conditionInput', {read: ElementRef}) private conditionEl: ElementRef;
  @ViewChild('materialInput', {read: ElementRef}) private materialEl: ElementRef;
  @ViewChild('colorInput', {read: ElementRef}) private colorEl: ElementRef;
  @ViewChild('designerInput', {read: ElementRef}) private designerEl: ElementRef;
  @ViewChild('brandInput', {read: ElementRef}) private brandEl: ElementRef; 

  article: Article = new Article();

  addresses$: Observable<any[]>

  pictures$: Observable<string[]>;
  errors$: Observable<string[]>;
  checked = 0;

  private focus = '';
  private _focus$: BehaviorSubject<string> = new BehaviorSubject(this.focus);
  focus$: Observable<string> = this._focus$.asObservable();

  selected = {
    category: '', style: '', periods: '',
    condition: '', material: '', color: '',
    designer: '', brand: '', address: ''
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
    public api: ApiProvider,
    public annexes: AnnexesProvider
  ) { }

  ionViewDidLoad() {
    this.addresses$ = this.api.getUserAddresses();
    this.sub = this.focus$.switchMap(focus => {
      switch (focus) {
        case 'category': { this.categoryEl ? this.categoryEl.nativeElement.scrollIntoView() : undefined; this.items = this.annexes.categories; break ; }
        case 'style': { this.styleEl ? this.styleEl.nativeElement.scrollIntoView() : undefined; this.items = this.annexes.styles; break ; }
        case 'periods': { this.periodsEl ? this.periodsEl.nativeElement.scrollIntoView() : undefined; this.items = this.annexes.periods; break ; }
        case 'condition': { this.conditionEl ? this.conditionEl.nativeElement.scrollIntoView() : undefined; this.items = this.annexes.conditions; break ; }
        case 'material': { this.materialEl ? this.materialEl.nativeElement.scrollIntoView() : undefined; this.items = this.annexes.materials; break ; }
        case 'color': { this.colorEl ? this.colorEl.nativeElement.scrollIntoView() : undefined; this.items = this.annexes.colors; break ; }
        case 'designer': { this.designerEl ? this.designerEl.nativeElement.scrollIntoView() : undefined; this.items = this.annexes.designers; break ; }
        case 'brand': { this.brandEl ? this.brandEl.nativeElement.scrollIntoView() : undefined; this.items = this.annexes.brands; break ; }
        default: {
          this.items = [];
        }
      }
      this._items$.next(this.items);
      return this.items$;
    }).subscribe();
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

  getItems(search: string) {
    const items = this.items.filter(item => item.name.search(search) < 0 ? false : true);
    this._items$.next(items);
  }

}
