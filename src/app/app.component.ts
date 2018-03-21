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
import { ApiCallsService } from './api-calls.service'
import { NgModule } from '@angular/core';

const log = new Logger('App');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ApiCallsService]
})

export class AppComponent implements OnInit {

  token : Token;
  users : Observable<Array<User>>;
  devices : Observable<Array<Device>>;
  projects : Observable<Array<Project>>;
  headers: {headers : HttpHeaders };


  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private titleService: Title,
              private translateService: TranslateService,
              private i18nService: I18nService,
              private apiCallModule: ApiCallsService
            ) { 
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
        this.apiCallModule.postAuth().then(
          val => 
          {
            var token = val as Token;

         console.log("this.token.access_token: " + token.access_token);

            this.users = this.apiCallModule.getUsers(token);
            this.projects = this.apiCallModule.getProjects(token);
            this.devices = this.apiCallModule.getDevices(token);
          }
        );
      }catch(ex){
        console.log("postAuth exception" + ex);
      }
  }

  
}
