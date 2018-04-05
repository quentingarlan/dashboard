import { Component, OnInit } from '@angular/core';
import { Token } from '../token';
import { Device } from '../device';
import { Project } from '../project';
import { User } from '../user';
import { ApiCallsService } from '../api-calls.service'

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  providers: [ApiCallsService]
})
export class OverviewComponent implements OnInit {

  usersNb : number;
  projectsNb : number;
  devicesConfiguredNb : number;
  devicesUnconfiguredNb : number;

  projectsArray : Array<{country:string,
                         projects:Array<Project>,
                         configured:number,
                         notConfigured:number}>;

  constructor( private apiCallModule: ApiCallsService ) { }

  ngOnInit() {

    var countryList =["Sweden", "Denmark", "France", "Belgium", "Russia", "Italy", "Germany", "Norway", "Chile", "Turkey", "Poland", "Finland", "Austria", "Spain"];

    try
    {
      this.apiCallModule.postAuth().then(
        val =>
        {
            var token = val as Token;
            this.projectsNb = 0;
            this.devicesConfiguredNb = 0;
            this.devicesUnconfiguredNb = 0;

            this.apiCallModule.getUsers(token).then(users =>
            {
               var usersArray = users as Array<Project>;
               this.usersNb = usersArray.length;
            })

            this.projectsArray = new Array<{country:string, projects:Array<Project>, configured:number, notConfigured:number}>();

            for (var i in countryList){

              this.apiCallModule.getProjectsByCountry(token, countryList[i]).then(projs =>
              {
                var projsArray = projs as Array<Project>;

                if (projs[0] != null){

                  var tempTotalConf = 0;
                  var tempTotalNotConf = 0;

                  for (var j in projsArray){

                    var devicesArray = projsArray[j].devices as Array<Device>;

                    for (var k in devicesArray){
                      console.log("devicesarr loop");
                      console.log("devicesarr status" + devicesArray[k].status);
                      if(devicesArray[k].status== "Configured"){
                        tempTotalConf++;
                      }
                      else{
                        tempTotalNotConf++;
                      }
                    }
                  }

                  this.projectsNb+=projsArray.length;
                  this.projectsArray.push({country:projs[0].country, projects:projsArray, configured:tempTotalConf, notConfigured:tempTotalNotConf});

                  this.devicesConfiguredNb += tempTotalConf;
                  this.devicesUnconfiguredNb += tempTotalNotConf;
                }

              })
            }
        }
      );
    }catch(ex){
      console.log("postAuth exception" + ex);
    }

  }

}
