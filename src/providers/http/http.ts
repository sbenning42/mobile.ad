import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the HttpProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HttpProvider {

  constructor(public http: HttpClient) {
    console.log('Hello HttpProvider Provider');
  }

  private makeHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    const headers = token ?
      new HttpHeaders().set('Authorization', `Bearer ${token}`) :
      new HttpHeaders();
    return { headers: headers };
  }

  get(endpoint: string, id = 0): Observable<any> {
    const url = id ? `${endpoint}/${id}` : endpoint;
    return this.http.get(url, this.makeHeaders());
  }

  post(endpoint: string, params?: any): Observable<any> {
    const url = endpoint;
    return this.http.post(url, params, this.makeHeaders());
  }

  put(endpoint: string, id = 0, params?: any): Observable<any> {
    const url = id ? `${endpoint}/${id}` : endpoint;
    return this.http.put(url, params, this.makeHeaders());
  }

  delete(endpoint: string, id = 0): Observable<any> {
    const url = id ? `${endpoint}/${id}` : endpoint;
    return this.http.delete(url, this.makeHeaders());
  }

}