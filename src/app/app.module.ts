import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { MyApp } from './app.component';

import 'rxjs/add/observable/of';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { GalleryPage } from '../pages/gallery/gallery';
import { GalleryDetailPage } from '../pages/gallery-detail/gallery-detail';
import { AddPage } from '../pages/add/add';
import { StockPage } from '../pages/stock/stock';
import { StockFilterAllPage } from '../pages/stock-filter-all/stock-filter-all';
import { StockFilterCreationPage } from '../pages/stock-filter-creation/stock-filter-creation';
import { StockFilterSoldPage } from '../pages/stock-filter-sold/stock-filter-sold';
import { StockDetailPage } from '../pages/stock-detail/stock-detail';
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { LoginModalPage } from '../pages/login-modal/login-modal';
import { SliderPage } from '../pages/slider/slider';

import { StockProvider } from '../providers/stock/stock';
import { GalleryProvider } from '../providers/gallery/gallery';
import { AuthProvider } from '../providers/auth/auth';
import { HttpProvider } from '../providers/http/http';
import { StockModeProvider } from '../providers/stock-mode/stock-mode';
import { GalleryModeProvider } from '../providers/gallery-mode/gallery-mode';
import { AnnexesProvider } from '../providers/annexes/annexes';
import { StockCountsProvider } from '../providers/stock-counts/stock-counts';
import { ChannelsProvider } from '../providers/channels/channels';
import { ApiProvider } from '../providers/api/api';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    TabsPage,
    HomePage,
    GalleryPage,
    GalleryDetailPage,
    AddPage,
    StockPage,
    StockFilterAllPage,
    StockFilterCreationPage,
    StockFilterSoldPage,
    StockDetailPage,
    AccountPage,
    LoginPage,
    LoginModalPage,
    SliderPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    TabsPage,
    HomePage,
    GalleryPage,
    GalleryDetailPage,
    AddPage,
    StockPage,
    StockFilterAllPage,
    StockFilterCreationPage,
    StockFilterSoldPage,
    StockDetailPage,
    AccountPage,
    LoginPage,
    LoginModalPage,
    SliderPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    StockProvider,
    GalleryProvider,
    AuthProvider,
    HttpProvider,
    StockModeProvider,
    GalleryModeProvider,
    AnnexesProvider,
    StockCountsProvider,
    ChannelsProvider,
    ApiProvider
  ]
})
export class AppModule {}
