import { Component, OnInit, ElementRef } from '@angular/core';
import { Token } from '../interfaces/token';
import { Project } from '../interfaces/project';
import { ApiCallsService } from '../api-calls.service';
import { ChartingService } from '../charting.service';
import { taggedTemplateExpression } from 'babel-types';
import { monthVars } from '../constants/environment'
import * as moment from 'moment';
import { extendMoment } from 'moment-range';
import { last } from 'rxjs/operator/last';

@Component({
  selector: 'app-project-updates',
  templateUrl: './project-updates.component.html',
  styleUrls: ['./project-updates.component.scss'],
  providers: [ApiCallsService,
              ChartingService]
})

export class ProjectUpdatesComponent implements OnInit {
  
    nbProjectsUpdatedChart : Chart;
    nbProjectsCreatedChart : Chart;
    //lastProject : Project;

    constructor(private apiCallModule: ApiCallsService,
                private chartingModule: ChartingService,
                private elementRef: ElementRef) { }
  
    ngOnInit() {
     // console.log("init");
      try
      {
        this.apiCallModule.postAuth().then(
          val => 
          {
              var token = val as Token;

              this.apiCallModule.getProjects(token).then(projs =>
              {  
                var projArray = projs as Array<Project>;

                var debutAndEnd = this.getDebutAndEnd(projArray);

                var updateDict = this.createAxis(debutAndEnd.debut, debutAndEnd.end, projArray, true);
                var createDict = this.createAxis(debutAndEnd.debut, debutAndEnd.end, projArray, false);

                //this.lastProject = projArray.pop();

                var total:number=0;
                var createKeys = Array.from(createDict.keys());
                var createValues = Array.from(createDict.values());
                //This is probably possible to improve O(n) as is (cumulative values for project created)
                for (var j=0; j<createKeys.length; j++){
                  total = total+createValues[j]
                  createValues[j]=total;
                }
    
                let htmlRefUpdated = this.elementRef.nativeElement.querySelector(`#Updated`);
                this.nbProjectsUpdatedChart = this.chartingModule.CreateProjectByMonthChart(Array.from(updateDict.keys()), Array.from(updateDict.values()), htmlRefUpdated, 'projects updated');
                let htmlRefCreated = this.elementRef.nativeElement.querySelector(`#Created`);
                this.nbProjectsCreatedChart = this.chartingModule.CreateProjectByMonthChart(createKeys, createValues, htmlRefCreated, 'projects created (accumulated)');
  
              })       
          }
        );
      }catch(ex){
        console.log("postAuth exception" + ex);
      }
    }

    createAxis(debut: Date, end:Date, projArray: Array<Project>, update:boolean): Map<string, number>{

      var momentStart = moment(debut);
      var momentEnd = moment(end);
      
      var dict= new Map<string, number>();

        //Create month axis
        while (momentStart < momentEnd || momentStart.format('M') === momentEnd.format('M')) {
          dict.set(momentStart.format('YYYY-MM'), 0);
          momentStart.add(1,'month');
        }
       
        //Create y axis for projects updated
        for (var i=0; i< projArray.length; i++)
        {
          if (update){
            var monthCreated = moment(projArray[i].createdAt).format('YYYY-MM');
            var monthChanged = moment(projArray[i].updatedAt).format('YYYY-MM');
            if (monthChanged != monthCreated){
              var value = dict.get(monthChanged) + 1;
              dict.set(monthChanged, value);
            }
          }
          else
          {
            var monthChanged = moment(projArray[i].createdAt).format('YYYY-MM');
            var value = dict.get(monthChanged) + 1;
            dict.set(monthChanged, value);
          }   
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