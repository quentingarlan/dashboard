import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Injectable } from '@angular/core';
import { HttpClient , HttpParams } from '@angular/common/http';

import { HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators';

import { HttpErrorHandler, HandleError } from './http-error-handler.service';

import { Token } from './token';
import { Device } from './device';
import { Project } from './project';
import { User } from './user';
import { Logger, I18nService } from '@app/core';
import { AppComponent } from './app.component';

const log = new Logger('App');

@Injectable()
export class ApiCallsService {

  constructor(
    private http: HttpClient ) {
  }

  serverRestApiUrl = 'http://localhost:8080'
  projectsUrl = '/api/project';  // URL to web api
  devicesUrl = '/api/device';  // URL to web api
  usersUrl = '/api/user';  // URL to web api
  authUrl = '/oauth/token';  // URL to web api
  projByCountryUrl = '/api/project/country/';  // URL to web api
  private handleError: HandleError;
  
  getProjectsByCountry (accessToken : Token,
              countryId : string): Observable<Array<Project>> {
    return this.http.get<Array<Project>>(this.serverRestApiUrl + this.projByCountryUrl, 
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer ' + accessToken.access_token
        },
         params: {
          ':country_id': countryId
        }
        }
    );
  }

  getProjectsById (accessToken : Token,
    projectId : string): Observable<Array<Project>> {
        return this.http.get<Array<Project>>(this.serverRestApiUrl + this.projectsUrl, 
        {
              headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + accessToken.access_token
              },
                params: {
                    ':country_id': projectId
                }
              }
        );
}
  
  /** GET users from the server */
  getUsers (accessToken : Token): Observable<Array<User>> {
    console.log('get users');
    var headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + accessToken.access_token
      })
    };
    return this.http.get<Array<User>>(this.serverRestApiUrl + this.projectsUrl, headers) ;
  }
  
  /** GET devices from the server */
  getDevices (accessToken : Token): Observable<Array<Device>> {
    var headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + accessToken.access_token
      })
    };
    return this.http.get<Array<Device>>(this.serverRestApiUrl + this.projectsUrl, headers);      
  }

  getProjects (accessToken : Token)
  {
    console.log('get projs');
  
    var headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + accessToken.access_token
      })
    };

    var promise = new Promise((resolve, reject) => {
      this.http.get<Array<Project>>(this.serverRestApiUrl + this.projectsUrl, headers)
        .toPromise()
        .then(
          res=>{
            resolve(res);
          }
        ).catch(function(e){
          console.log("error while getting projects");
          throw(e);
        });
      });
      return promise;
   }

  /** POST Auth from the server */
  postAuth () {
    const body = new HttpParams()
    .set('grant_type', 'client_credentials')
    .set('client_id', 'root_client')
    .set('client_secret', 'rootclientsecret')
    .set('scope', 'root');
  
    const heads = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    }; 

    var promise = new Promise((resolve, reject) => {
      this.http.post(this.serverRestApiUrl + this.authUrl, body, heads)
        .toPromise()
        .then(
          res => { // Success
            console.log("success auth promise");
            resolve(res);
          }
        )
        .catch(function(e){
          console.log("error while getting authentication token");
          throw(e);
        });
    });
    return promise;
  }
}
