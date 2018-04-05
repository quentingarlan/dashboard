import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Injectable } from '@angular/core';
import { HttpClient , HttpParams } from '@angular/common/http';

import { HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators';

import { HttpErrorHandler, HandleError } from './http-error-handler.service';

import { Token } from './interfaces/token';
import { Device } from './interfaces/device';
import { Project } from './interfaces/project';
import { User } from './interfaces/user';
import { Logger, I18nService } from '@app/core';
import { AppComponent } from './app.component';

const log = new Logger('App');

@Injectable()
export class ApiCallsService {

  constructor(
    private http: HttpClient ) {
  }

  serverRestApiUrl = 'http://localhost:8080'
  projectsUrl = '/api/project';  
  devicesUrl = '/api/device';  
  devicesTopUrl = '/api/devicetop';  
  devicesByCountryUrl = '/api/device/country';
  usersUrl = '/api/user';  
  authUrl = '/oauth/token';  
  projByCountryUrl = '/api/project/number';  
  projExistsUrl = '/api/project/exist';
  private handleError: HandleError;
  
  //#region 

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


  getProjectsByCountry (accessToken : Token,
                          countryId:string)
  {
    console.log('get projs');
  
    var headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + accessToken.access_token
      })
    };

    var promise = new Promise((resolve, reject) => {
      this.http.get<Array<Project>>(this.serverRestApiUrl + this.projByCountryUrl+ "/" + countryId, headers)
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

    getProjectsById (accessToken : Token,
    projectId : string) {
      console.log('get projs');
      
        var headers = {
          headers: new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + accessToken.access_token
          })
        };
    
        var promise = new Promise((resolve, reject) => {
          this.http.get<Project>(this.serverRestApiUrl + this.projectsUrl + "/" + projectId, headers)
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

      getProjectExists (accessToken : Token,
        projectId : string) {
          console.log('get projs');
          
            var headers = {
              headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + accessToken.access_token
              })
            };
        
            var promise = new Promise((resolve, reject) => {
              this.http.get<Project>(this.serverRestApiUrl + this.projExistsUrl + "/" + projectId, headers)
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

//#endregion
  
//#region 

  /** GET users from the server */
    getUsers (accessToken : Token) {
      console.log('get Devices');
  
      var headers = {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer ' + accessToken.access_token
        })
      };
  
      var promise = new Promise((resolve, reject) => {
        this.http.get<Array<User>>(this.serverRestApiUrl + this.usersUrl, headers)
          .toPromise()
          .then(
            res=>{
              resolve(res);
            }
          ).catch(function(e){
            console.log("error while getting users");
            throw(e);
          });
        });
        return promise;    
    }

  //#endregion

    /** GET devices from the server */
    getDevicesAsync (accessToken : Token): Observable<Array<Device>> {
      console.log('get devices');
      var headers = {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer ' + accessToken.access_token
        })
      };
      return this.http.get<Array<Device>>(this.serverRestApiUrl + this.devicesUrl, headers) ;
    }

    /** GET devices from the server */
    getTopDevicesAsync (accessToken : Token): Observable<Array<Device>> {
      console.log('get devices top');
      var headers = {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer ' + accessToken.access_token
        })
      };
      return this.http.get<Array<Device>>(this.serverRestApiUrl + this.devicesTopUrl, headers) ;
    }

  
  /** GET devices from the server */
  getDevices (accessToken : Token) {
    console.log('get Devices');

    var headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + accessToken.access_token
      })
    };

    var promise = new Promise((resolve, reject) => {
      this.http.get<Array<Device>>(this.serverRestApiUrl + this.devicesUrl, headers)
        .toPromise()
        .then(
          res=>{
            resolve(res);
          }
        ).catch(function(e){
          console.log("error while getting devices");
          throw(e);
        });
      });
      return promise;    
  }

/** GET devices from the server */
getDevicesByCountry (accessToken : Token,
                     countryId : string) {
  console.log('get Devices by country');

  var headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + accessToken.access_token
    })
  };

  var promise = new Promise((resolve, reject) => {
    this.http.get<Array<Device>>(this.serverRestApiUrl + this.devicesByCountryUrl+ "/" + countryId, headers)
      .toPromise()
      .then(
        res=>{
          resolve(res);
        }
      ).catch(function(e){
        console.log("error while getting devices");
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
