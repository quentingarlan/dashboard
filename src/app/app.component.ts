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
import { Chart } from 'Chart.js'

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
  chart : Chart;

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
            this.devices = this.apiCallModule.getDevices(token);


            this.apiCallModule.getProjects(token).then(proj =>
              {
                var projects = proj as Array<Project>;
    
                var nbDannishProjects = projects.filter(p=>p.country == 'Denmark');
                var nbFrenchProjects = projects.filter(p=>p.country == 'France');
                var nbAustriaProjects = projects.filter(p=>p.country == 'Austria');   
                var nbGermanyProjects = projects.filter(p=>p.country == 'Germany');
                var nbSwedenProjects = projects.filter(p=>p.country == 'Sweden');
                var nbRussiaProjects = projects.filter(p=>p.country == 'Russia');
                var nbItalyProjects = projects.filter(p=>p.country == 'Italy');

                      this.chart = new Chart('canvas', {
                        type:'pie',
                        data:{
                            labels : ['Danemark', 'France', 'Austria', 'Germany', 'Sweden', 'Russia', 'Italy'],
                            datasets:
                            [{
                                data:[
                                      nbDannishProjects.length,
                                      nbFrenchProjects.length,
                                      nbAustriaProjects.length,
                                      nbGermanyProjects.length,
                                      nbSwedenProjects.length,
                                      nbRussiaProjects.length,
                                      nbItalyProjects.length
                                    ],
                                backgroundColor:[
                                  'rgba(255, 99, 132, 0.2)',
                                  'rgba(54, 162, 235, 0.2)',
                                  'rgba(255, 206, 86, 0.2)',
                                  'rgba(75, 192, 192, 0.2)',
                                  'rgba(153, 102, 255, 0.2)',
                                  'rgba(255, 159, 64, 0.2)',
                                  'rgba(25, 2, 72, 0.2)'
                                ],
                                borderColor: [
                                  'rgba(255,99,132,1)',
                                  'rgba(54, 162, 235, 1)',
                                  'rgba(255, 206, 86, 1)',
                                  'rgba(75, 192, 192, 1)',
                                  'rgba(153, 102, 255, 1)',
                                  'rgba(255, 159, 64, 1)',
                                  'rgba(25, 2, 72, 1)'
                              ],
                              borderWidth: 1
                              }]
                            },
                            options: {
                            }
                      })
              }
              //end get project promise
            )}
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
