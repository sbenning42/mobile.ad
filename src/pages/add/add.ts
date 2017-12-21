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
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { TabsPage } from '../tabs/tabs';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';

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
  selected = {
    category: {id: '0', name: ''}, style: {id: '0', name: ''}, periods: {id: '0', name: ''},
    condition: {id: '0', name: ''}, material: {id: '0', name: ''}, color: {id: '0', name: ''},
    designer: {id: '0', name: ''}, brand: {id: '0', name: ''}, address: {id: '0', name: ''}
  };
  pictures$: Observable<string[]>;

  addresses$: Observable<any[]>;
  errors$: Observable<string[]>;

  focus = '';
  items: {id: string, name: string}[] = [];

  private _focus$: BehaviorSubject<string> = new BehaviorSubject(this.focus);
  private _items$: BehaviorSubject<{id: string, name: string}[]> = new BehaviorSubject(this.items);
  focus$: Observable<string> = this._focus$.asObservable();
  items$: Observable<{id: string, name: string}[]> = this._items$.asObservable();

  steps = [
    {icon: 'camera', color: '#f44336'},
    {icon: 'book', color: '#f44336'},
    {icon: 'pin', color: '#f44336'},
    {icon: 'ribbon', color: '#4caf50'},
    {icon: 'document', color: '#4caf50'}
  ];
  step = 0;

  sub: Subscription;
  saveSub: Subscription;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public camera: CameraProvider,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public api: ApiProvider,
    public annexes: AnnexesProvider
  ) { }

  ionViewDidLoad() {
    this.addresses$ = this.api.getUserAddresses();
    this.pictures$ = this.camera.pictures$;
    this.errors$ = this.camera.errors$;

    this.camera.errors$.subscribe(() => {
      const toast = this.toastCtrl.create({
        message: 'No Picture to add',
        duration: 3000
      });
      toast.present();
    });
  
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
  
    this.takeOne();
  }

  ionViewDidLeave() {
    this.sub.unsubscribe();
  }

  takeOne() {
    this.camera.takeOne();
  }

  takeLoop() {
    this.camera.takeOne();
    const loop = this.modalCtrl.create(PicturesLoopComponent);
    loop.onDidDismiss(finish => finish ? undefined : this.takeLoop())
    loop.present();
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

  aggregateArticleAndSelection() {
    this.article.address_id = this.selected.address.id;
    this.article.brand_id = this.selected.brand.id;
    this.article.category_id = this.selected.category.id;
    this.article.color_id = this.selected.color.id;
    this.article.condition_id = this.selected.condition.id;
    this.article.designer_id = this.selected.designer.id;
    this.article.periods_id = this.selected.periods.id;
    this.article.material_id = this.selected.material.id;
    this.article.style_id = this.selected.style.id;

  }

  saveDraft(observer?) {
    if (this.saveSub) { this.saveSub.unsubscribe(); }

    let picturesFiles;
  
    let stream$ = this.article.id
      ? this.pictures$.switchMap(pictures => {
          picturesFiles = pictures.map(picture => picture);
          return this.api.putProduct(this.article);
        })
      : this.pictures$.switchMap(pictures => {
          picturesFiles = pictures.map(picture => picture);
          return this.api.addProduct(this.article);
        }).switchMap(apiArticle => {
          this.article.id = apiArticle.id;
          return this.api.putProduct(this.article);
        });
    
    this.aggregateArticleAndSelection();
    
    if (picturesFiles) {
      picturesFiles.foreach((file, index) => {
        stream$ = stream$.switchMap(apiData => {
          console.log((index ? 'Picture: ' : 'Product: ') + JSON.stringify(apiData));
          return this.api.uploadArticlePicture(this.article, file);
        });
      });
    }

    this.saveSub = stream$.subscribe(observer);

    /**
     * Steps for saving:
     * 
     * User should get a feedback on the advance of the following proccess:
     * 
     * 1) save the name to get a valid edition id.
     * 2) aggregate the relationals ids in the this.article: Article object.
     *    All those ids lands on this.selected: { ... } literal object.
     * 3) Once the edition id and the aggregate are done, edit the article.
     * 4) Loop througth this.camera.pictures$: Observable<string[]> object to map
     *    it to get valid part-data form for the backend to accept the files.
     * 5) Save thoses files one by one
     */

    
  }

  save() {
    let toast;
    const observer = {
      next: (data) => {
        console.log(`${this.article.id} has been saved!`);
        toast = this.toastCtrl.create({
          message: this.article.id ? 'Product was edited successfully' : 'Product was created successfully',
          duration: 3000
        });
        toast.cssClass = 'success-toast';
        toast.present();
      },
      error: (err) => {
        console.log(`A error occured while saving article: ` + JSON.stringify(err));
        toast = this.toastCtrl.create({
          message: this.article.id ? 'Product was not edited' : 'Product was not created',
          duration: 3000
        });
        toast.cssClass = 'failure-toast';
        toast.present();
      },
      complete: () => {
        console.log('Task Completed!');
        toast.onDidDismiss(() => this.navCtrl.setRoot(TabsPage));
      },
    };
    this.saveDraft(observer);
  }

  setFocus(key: string) {
    this.focus = key;
    this._focus$.next(key);
  }

  getItems(search: string) {
    const items = this.items.filter(item => item.name.search(search) < 0 ? false : true);
    this._items$.next(items);
  }

  toggleAutocomp() {
    if (this.focus && this.items && this.items[0]) {
      this._focus$.next('');
    } else {
      this._focus$.next(this.focus);
    }
  }

}
