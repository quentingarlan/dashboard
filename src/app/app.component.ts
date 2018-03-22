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
  showDevices = false;
  showProjects = false;
  showUsers = false;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private titleService: Title,
              private translateService: TranslateService,
              private i18nService: I18nService,
              private apiCallModule: ApiCallsService) 
              { }

  ngOnInit() {
    // Setup logger
    if (environment.production) {
      Logger.enableProductionMode();
    }

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
        console.log("start call api");
        this.apiCallModule.postAuth().then(
          val => 
          {
            console.log("postAuth call api");
            var token = val as Token;

            this.users = this.apiCallModule.getUsers(token);
            this.projects = this.apiCallModule.getProjects(token);
            this.devices = this.apiCallModule.getDevices(token);
          }
        );
      }catch(ex){
        console.log("postAuth exception" + ex);
      }
  }

  //#region show hide 
  toggleDevices() 
  { 
    this.showDevices = !this.showDevices; 
    this.showProjects = false;
    this.showUsers  = false;
    console.log("toggleDevices"); 
  }
  toggleProjects() 
  { 
    this.showProjects = !this.showProjects;
    this.showDevices = false;
    this.showUsers  = false;
      console.log("toggleProjects");
  }
  toggleUsers() 
  {
     this.showUsers = !this.showUsers;
     this.showDevices = false;
     this.showProjects  = false;
     console.log("toggleUsers");
  }
  //#endregion
}
