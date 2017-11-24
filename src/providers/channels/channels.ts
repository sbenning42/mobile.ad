import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { channelsApi, channelsPublishApi } from '../../api/api';
import { HttpProvider } from '../../providers/http/http';

/*
  Generated class for the ChannelsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ChannelsProvider {

  constructor(public http: HttpProvider) {
    console.log('Hello ChannelsProvider Provider');
  }

  get(): Observable<any> {
    return this.http.get(channelsApi);
  }

  publish(article, channel): Observable<any> {
    return this.http.post(channelsPublishApi, { product: { id: article.id }, marketplace: channel.name });
  }

}
