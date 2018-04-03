import { Component, OnInit } from '@angular/core';

import { ApiCallsService } from '../api-calls.service'
import { ChartingService } from '../charting.service'

import { Token } from '../token';
import { Device } from '../device';
import { Project } from '../project';
import { User } from '../user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [ApiCallsService,
              ChartingService]
})
export class DashboardComponent implements OnInit {

  token : Token;
  projectsChart : Chart;

  constructor(private chartingModule: ChartingService,
              private apiCallModule: ApiCallsService) { }

  ngOnInit() {
    try
    {
      console.log("start call api");
      this.apiCallModule.postAuth().then(
        val => 
        {
            console.log("postAuth call api");
            var token = val as Token;

            // this.users = this.apiCallModule.getUsers(token);

            // this.devices = this.apiCallModule.getDevicesAsync(token);
            // this.topDevices = this.apiCallModule.getTopDevicesAsync(token);

            this.apiCallModule.getProjects(token).then(proj =>
            {
              var projects = proj as Array<Project>;
              this.projectsChart = this.chartingModule.CreateNbProjectsChart(projects);
            })
        }
      );
    }catch(ex){
      console.log("postAuth exception" + ex);
    }
  }

}
