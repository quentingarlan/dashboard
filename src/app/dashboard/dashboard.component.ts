import { Component, OnInit,  ElementRef } from '@angular/core';

import { ApiCallsService } from '../api-calls.service'
import { ChartingService } from '../charting.service'

import { Token } from '../interfaces/token';
import { Project } from '../interfaces/project';

import * as moment from 'moment';
import { extendMoment } from 'moment-range';
import { refTable } from '../constants/ReferencesTable'

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
  projectsDetailsChart : Chart;
  averageConfDevicesChart : Chart;
  topConfDevicesChart : Chart;
  nbProjectsChart : Chart;
  nbConfDevicesChart : Chart;
  isLoading: boolean;
  refCheckBoxValue : boolean;
  oldValues : Array<string>;

  constructor(private chartingModule: ChartingService,
              private apiCallModule: ApiCallsService,
              private elementRef: ElementRef) { }

  onChange() {

    if (this.topConfDevicesChart != null && this.topConfDevicesChart.data != null){
      if (this.refCheckBoxValue){

        this.oldValues = new Array<string>();
  
        for (var i=0;i< this.topConfDevicesChart.data.labels.length; i++){
          var valueStr = this.topConfDevicesChart.data.labels[i].toString();
  
          this.oldValues.push(valueStr);
          this.topConfDevicesChart.data.labels[i] = refTable[valueStr];
        }
  
        this.topConfDevicesChart.update();
      }
      else{
  
        for (var i=0;i< this.topConfDevicesChart.data.labels.length; i++){
          this.topConfDevicesChart.data.labels[i] = this.oldValues[i];
        }
        this.topConfDevicesChart.update();
      }
    }
  }

  ngOnInit() {
    this.isLoading = true;
    try
    {
      this.apiCallModule.postAuth().then(
        val => 
        {
           // console.log("postAuth call api");
            var token = val as Token;

            let htmlRef = this.elementRef.nativeElement.querySelector(`#projectsCanvas`);
            let htmlRef2 = this.elementRef.nativeElement.querySelector(`#projectsDetailsCanvas`);
            let htmlRef3 = this.elementRef.nativeElement.querySelector(`#averageConfDevicesCanvas`);
            let htmlRef4 = this.elementRef.nativeElement.querySelector(`#topConfDevicesCanvas`);
            let htmlRef5 = this.elementRef.nativeElement.querySelector(`#nbprojectsCanvas`);
            let htmlRef6 = this.elementRef.nativeElement.querySelector(`#nbConfDevicesCanvas`);

            this.apiCallModule.getProjectsWithDevices(token).then(proj =>
            {
              var projects = proj as Array<Project>;
              this.projectsChart = this.chartingModule.CreateNbProjectsChart(projects, htmlRef);
              this.projectsDetailsChart = this.chartingModule.CreateProjectsDetailsChart(projects, htmlRef2);
              this.averageConfDevicesChart = this.chartingModule.CreateAverageConfDevices(projects, htmlRef3);
              this.topConfDevicesChart = this.chartingModule.CreateTopDevicesConfigured(projects, htmlRef4);

              var debutAndEnd = this.getDebutAndEnd(projects);

              var updateDict = this.createAxis(debutAndEnd.debut, debutAndEnd.end, projects);

              var months = Array.from(updateDict.keys());
              var projsNb= new Array<number>();
              var confDevsNb= new Array<number>();

              updateDict.forEach(d=> { 
                projsNb.push(d.nbProj);
                confDevsNb.push(d.nbConfDevs);
              });

              this.nbProjectsChart = this.chartingModule.CreateProjectConfigured(months, projsNb, htmlRef5);
              this.nbConfDevicesChart= this.chartingModule.CreateConfDevicesConfigured(months, confDevsNb, htmlRef6);

            })
            this.isLoading = false;
        }
      
      );
    }catch(ex){
      console.log("postAuth exception" + ex);
    }
  }

  createAxis(debut: Date, end:Date, projArray: Array<Project>): Map<string, {nbProj: number, nbConfDevs: number}>{

    var momentStart = moment(debut);
    var momentEnd = moment(end);
    
    var dict= new Map<string, {nbProj: number, nbConfDevs: number}>();

      //Create month axis
      while (momentStart < momentEnd || momentStart.format('M') === momentEnd.format('M')) {
        dict.set(momentStart.format('YYYY-MM'), {nbProj:0, nbConfDevs:0} );
        momentStart.add(1,'month');
      }
     
      //Create y axis for projects updated
      for (var i=0; i< projArray.length; i++)
      {
        var monthChanged = moment(projArray[i].createdAt).format('YYYY-MM');

        var nbProj = dict.get(monthChanged).nbProj + 1;

        var nbConfDevs = dict.get(monthChanged).nbConfDevs + projArray[i].devices.filter(dev => dev.reference != undefined && !dev.reference.startsWith('power') && dev.status == "Configured").length;

        dict.set(monthChanged, {nbProj: nbProj, nbConfDevs: nbConfDevs} );
      }

      return dict;
  }

  getDebutAndEnd(projArray: Array<Project>): {debut: Date, end:Date}{

    var firstDate:Date;
    var lastDate:Date;

    //get interval from every projects (basically get first and last project dates)
    for (var i=0; i< projArray.length; i++)
    {
      var dateUpdated:Date = new Date(projArray[i].updatedAt);
      var dateCreated:Date = new Date(projArray[i].createdAt);
      if (firstDate == undefined || dateUpdated < firstDate){
        firstDate = dateUpdated;
      }
      if (lastDate == undefined || dateUpdated > lastDate){
        lastDate = dateUpdated;
      }
      if (dateCreated < firstDate){
        firstDate = dateCreated;
      }
      if (dateCreated > lastDate){
        lastDate = dateCreated;
      }
    }

    return {debut: firstDate, end: lastDate };

  }

}
