import { Component, ViewChild, ElementRef } from '@angular/core';
import { App, IonicPage, NavController, NavParams } from 'ionic-angular';
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
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { ArticlePreviewPage } from '../article-preview/article-preview';
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the AddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

export class ImageDataConverter {
  constructor(public dataURI) {
    this.dataURI = dataURI;
  }
  getByteString() {
    let byteString;
    if (this.dataURI.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(this.dataURI.split(',')[1]);
    } else {
      byteString = decodeURI(this.dataURI.split(',')[1]);
    }
    return byteString;
  }
  getMimeString() {
    return this.dataURI.split(',')[0].split(':')[1].split(';')[0];
  }
  convertToTypedArray() {
    let byteString = this.getByteString();
    let ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return ia;
  }
  dataURItoBlob() {
    let mimeString = this.getMimeString();
    let intArray = this.convertToTypedArray();
    return new Blob([intArray], {type: mimeString});
  }
}

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
    {icon: 'ribbon', color: '#4caf50'}
  ];
  step = 0;

  sub: Subscription;
  saveSub: Subscription;

  constructor(
    public app: App,
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public camera: CameraProvider,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public api: ApiProvider,
    public annexes: AnnexesProvider
  ) { }

  ionViewWillEnter() {
    if (this.saveSub) { this.saveSub.unsubscribe(); }
  }

  ionViewDidLoad() {
    this.addresses$ = this.api.getUserAddresses();
    this.pictures$ = this.camera.pictures$;
    this.errors$ = this.camera.errors$;

    this.camera.errors$.subscribe((err) => {
      if (!(err && err[0])) { return ; }
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

  preview() {
    this.navCtrl.push(ArticlePreviewPage, {
      article: this.article,
      selected: this.selected,
      camera: this.camera,
      delegate: this
    });
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

  convertBase64Encoding(dataURL) {
    const blob = new ImageDataConverter(dataURL).dataURItoBlob();
    let data = new FormData();
    data.append('file_name', 'file');
    data.append('file', blob);
    data.append('fileName', 'unknow');
    data.append('fileSize', 'unknow');
    data.append('fileType', 'unknow');
    data.append('fileLastMod', 'unknow');
    return data;
  }

  saveDraft(observer?) {
    if (this.saveSub) { this.saveSub.unsubscribe(); }

    let picturesFiles;
  
    let stream$ = this.article.id
      ? this.pictures$.switchMap(pictures => {
          picturesFiles = pictures.map(picture => this.convertBase64Encoding(picture));
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
          file.append('article_id', this.article.id);
          return this.api.uploadArticlePicture(this.article, file)
        });
      });
    }

    let toast;
    observer = observer ? observer : {
      next: (data) => {
        toast = this.toastCtrl.create({
          message: this.article.id ? 'Product draft was edited successfully' : 'Product draft was created successfully',
          duration: 3000,
          cssClass: 'success-toast'
        });
        toast.present();
      },
      error: (err) => {
        toast = this.toastCtrl.create({
          message: this.article.id ? 'Product draft was not edited' : 'Product draft was not created. Title is missing',
          duration: 3000,
          cssClass: 'failure-toast'
        });
        toast.present();
      },
      complete: () => console.log('Task Completed!')
    };

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
        toast = this.toastCtrl.create({
          message: this.article.id ? 'Product was edited successfully' : 'Product was created successfully',
          duration: 3000,
          cssClass: 'success-toast'
        });
        toast.present();
        toast.onDidDismiss(() => {
          const nav = this.app.getRootNav();
          nav.setRoot(TabsPage, { index: 1 });
        });
      },
      error: (err) => {
        toast = this.toastCtrl.create({
          message: this.article.id ? 'Product was not edited' : 'Product was not created',
          duration: 3000,
          cssClass: 'failure-toast'
        });
        toast.present();
      },
      complete: () => {},
    };
    this.saveDraft(observer);
  }

  setFocus(key: string) {
    this.focus = key;
    this._focus$.next(key);
  }

  getItems(search: any) {
    const items = this.items.filter(item => item.name.search(search.name) < 0 ? false : true);
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
