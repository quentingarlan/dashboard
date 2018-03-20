import { Injectable } from '@angular/core';
import { HttpClient , HttpParams } from '@angular/common/http';

import { HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators';

import { HttpErrorHandler, HandleError } from '../http-error-handler.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Injectable()
export class ApiCallsService {

  baseUrl = 'http://localhost:8080'
  projectsUrl = '/api/project';  // URL to web api
  devicesUrl = '/api/device';  // URL to web api
  usersUrl = '/api/user';  // URL to web api
  authUrl = '/oauth/token';  // URL to web api
  private handleError: HandleError;

  constructor(
    private http: HttpClient ,
    httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('ApiCallsService');
  }

  /** GET projects from the server */
  getProjects (): Observable<string[]> {
    return this.http.get<string[]>(this.baseUrl + this.projectsUrl)
      .pipe(
        catchError(this.handleError('getProjects', []))
      );
  }

  /** GET users from the server */
  getUsers (): Observable<string[]> {
    return this.http.get<string[]>(this.baseUrl + this.usersUrl)
      .pipe(
        catchError(this.handleError('getUsers', []))
      );
  }

    /** GET devices from the server */
    getDevices (): Observable<string[]> {
      return this.http.get<string[]>(this.baseUrl + this.devicesUrl)
        .pipe(
          catchError(this.handleError('getDevices', []))
        );
    }

  //////// Save methods //////////

  /** POST Auth from the server */
  postAuth (): Observable<string | {}> {

    const body = new HttpParams()
    .set('grant_type', 'client_credentials')
    .set('client_id', 'tracking_client')
    .set('client_secret', 'qIuam8owBP1Uf7ZOBPP4iRlnMBAL9yk2eRcPRQdVNFYWVrHPFlnWJiBibgZwq8I6m/Dl0NQkEcYLlDN01c7AVQ==')
    .set('scope', 'tracking');

    const heads = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };

    console.log(this.baseUrl + this.authUrl);  
    console.log(body);  
    console.log(heads);  

    return this.http.post(this.baseUrl + this.authUrl, body, heads)
    .pipe(
      catchError(this.handleError('postTokenRequest'))
    );
  }

}
