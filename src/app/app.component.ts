import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { merge } from 'rxjs/observable/merge';
import { filter, map, mergeMap } from 'rxjs/operators';
import { HttpClient , HttpParams } from '@angular/common/http';

import { environment } from '@env/environment';
import { Logger, I18nService } from '@app/core';

import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators';
import { forEach } from '@angular/router/src/utils/collection';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import { Token } from './token';
import { Device } from './device';
import { Project } from './project';
import { User } from './user';

const log = new Logger('App');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  token : Token;
  users : Observable<Array<User>>;
  devices : Observable<Array<Device>>;
  projects : Observable<Array<Project>>;
  headers: {headers : HttpHeaders };

  serverRestApiUrl = 'http://localhost:8080'
  projectsUrl = '/api/project';  // URL to web api
  devicesUrl = '/api/device';  // URL to web api
  usersUrl = '/api/user';  // URL to web api
  authUrl = '/oauth/token';  // URL to web api

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private titleService: Title,
              private translateService: TranslateService,
              private i18nService: I18nService,
               private http: HttpClient) { 
               }

  ngOnInit() {
    // Setup logger
    if (environment.production) {
      Logger.enableProductionMode();
    }

    log.debug('init');
    // Setup translations
    this.i18nService.init(environment.defaultLanguage, environment.supportedLanguages);

    const onNavigationEnd = this.router.events.pipe(filter(event => event instanceof NavigationEnd));

    // Change page title on navigation or language change, based on route data
    merge(this.translateService.onLangChange, onNavigationEnd)
      .pipe(
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter(route => route.outlet === 'primary'),
        mergeMap(route => route.data)
      )
      .subscribe(event => {
        const title = event['title'];
        if (title) {
          this.titleService.setTitle(this.translateService.instant(title));
        }
      });

      try
      {
        this.postAuth().then(
          val => 
          {
            this.token = val as Token;

         console.log("this.token.access_token: " + this.token.access_token);

            this.headers = {
              headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + this.token.access_token
              })
            };

              this.users = this.getUsers();
              this.projects = this.getProjects();
              this.devices = this.getDevices();
          }
        );
      }catch(ex){
        console.log("postAuth exception" + ex);
      }
  }

  getProjects (): Observable<Array<Project>> {
    log.debug('get projs');
    return this.http.get<Array<Project>>(this.serverRestApiUrl + this.projectsUrl, this.headers) ;
  }

  /** GET users from the server */
  getUsers (): Observable<Array<User>> {
    log.debug('get users');
    return this.http.get<Array<User>>(this.serverRestApiUrl + this.projectsUrl, this.headers) ;
  }

  /** GET devices from the server */
  getDevices (): Observable<Array<Device>> {
    log.debug('get devices');
    //return this.http.get<Array<Device>>(this.serverRestApiUrl + this.projectsUrl, this.headers) ;
    return this.http.get<Array<Device>>(this.serverRestApiUrl + this.projectsUrl, this.headers);
      
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

    //return this.http.post(this.serverRestApiUrl + this.authUrl, body, heads);
    var promise = new Promise((resolve, reject) => {
      this.http.post(this.serverRestApiUrl + this.authUrl, body, heads)
        .toPromise()
        .then(
          res => { // Success
            resolve(res);
          }
        )
        ;
    });
    return promise;
  }
}
