import { Component, OnInit, ElementRef } from '@angular/core';
import { Token } from '../interfaces/token';
import { User } from '../interfaces/user';
import { ApiCallsService } from '../api-calls.service';
import { ChartingService } from '../charting.service';
import { monthVars } from '../constants/environment'
import * as moment from 'moment';
import { extendMoment } from 'moment-range';

@Component({
  selector: 'app-user-evolution',
  templateUrl: './user-evolution.component.html',
  styleUrls: ['./user-evolution.component.scss'],
  providers: [ApiCallsService,
    ChartingService]
})
export class UserEvolutionComponent implements OnInit {

  nbUserChart : Chart;
  nbUsersCreatedChart : Chart;
  statsVersionsChart : Chart;
  expertVersionsChart: Chart;
  //lastUser : User;

  constructor(private apiCallModule: ApiCallsService,
              private chartingModule: ChartingService,
              private elementRef: ElementRef) { }

  ngOnInit() {
    try
    {
      this.apiCallModule.postAuth().then(
        val => 
        {
            var token = val as Token;

            this.apiCallModule.getUsers(token).then(users =>
            {  
                var userArray = users as Array<User>;

                var debutAndEnd = this.getDebutAndEnd(userArray);

                var resultDicts = this.createAxis(debutAndEnd.debut, debutAndEnd.end, userArray);

               // this.lastUser = userArray.pop();

                var updateDict= resultDicts.updateDict;
                var createDict= resultDicts.createDict;

                var total:number=0;
                var createKeys = Array.from(createDict.keys());
                var createValues = Array.from(createDict.values());
                //This is probably possible to improve O(n) as is (cumulative values for project created)
                for (var j=0; j<createKeys.length; j++){
                  total = total+createValues[j]
                  createValues[j]=total;
                }
                
              let htmlRefUpdated = this.elementRef.nativeElement.querySelector(`#usersCanvas`);
              this.nbUserChart = this.chartingModule.CreateProjectByMonthChart(Array.from(updateDict.keys()), Array.from(updateDict.values()), htmlRefUpdated, 'User last usage of eConfigure');
              let htmlRefCreated = this.elementRef.nativeElement.querySelector(`#usersCreated`);
              this.nbUsersCreatedChart = this.chartingModule.CreateProjectByMonthChart(createKeys, createValues, htmlRefCreated, 'User created (accumulated)');
              let htmlStatsVersions = this.elementRef.nativeElement.querySelector(`#statsVersions`);
              this.statsVersionsChart = this.chartingModule.CreateStatVersionChart(userArray, htmlStatsVersions, 'Installed eConfigure versions');
              let htmlExpertVersions = this.elementRef.nativeElement.querySelector(`#expertVersions`);
              this.expertVersionsChart = this.chartingModule.CreateExpertVersionChart(userArray, htmlExpertVersions, 'Installed eConfigure type');

            })       
        }
      );
    }catch(ex){
      console.log("postAuth exception" + ex);
    }
  }

  createAxis(debut: Date, end:Date, projArray: Array<User>): {updateDict: Map<string, number>,createDict: Map<string, number>}{

    var momentStart = moment(debut);
    var momentEnd = moment(end);
    
    var updateDict= new Map<string, number>();
    var createDict= new Map<string, number>();

      //Create month axis
      while (momentStart < momentEnd || momentStart.format('M') === momentEnd.format('M')) {
        updateDict.set(momentStart.format('YYYY-MM'), 0);
        createDict.set(momentStart.format('YYYY-MM'), 0);
        momentStart.add(1,'month');
      }
     
      //Create y axis for projects updated
      for (var i=0; i< projArray.length; i++)
      {
         var monthUpdated = moment(projArray[i].updatedAt).format('YYYY-MM');
         var value = updateDict.get(monthUpdated) + 1;
         updateDict.set(monthUpdated, value);

         var monthCreated = moment(projArray[i].createdAt).format('YYYY-MM');
         var value = createDict.get(monthCreated) + 1;
         createDict.set(monthCreated, value);
      }

      return {updateDict, createDict};
  }

  getDebutAndEnd(userArray: Array<User>): {debut: Date, end:Date}{

    var firstDate:Date;
    var lastDate:Date;

    //get interval from every projects (basically get first and last project dates)
    for (var i=0; i< userArray.length; i++)
    {
      var dateUpdated:Date = new Date(userArray[i].updatedAt);
      var dateCreated:Date = new Date(userArray[i].createdAt);
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
