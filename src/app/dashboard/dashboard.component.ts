import { Component, OnInit } from '@angular/core';

import { ApiCallsService } from '../api-calls.service'
import { ChartingService } from '../charting.service'

import { Token } from '../interfaces/token';
import { Project } from '../interfaces/project';

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
      this.apiCallModule.postAuth().then(
        val => 
        {
            console.log("postAuth call api");
            var token = val as Token;

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
