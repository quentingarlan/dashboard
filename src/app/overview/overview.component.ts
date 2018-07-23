import { Component, OnInit } from '@angular/core';
import { Token } from '../interfaces/token';
import { Device } from '../interfaces/device';
import { Project } from '../interfaces/project';
import { User } from '../interfaces/user';
import { ApiCallsService } from '../api-calls.service'
import { countryVars } from '../constants/environment';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  providers: [ApiCallsService]
})
export class OverviewComponent implements OnInit {

  usersNb : number;
  //userUpdatedLastWeek:number;
  userUpdatedLastMonth:number;
  userUpdatedBefore:number;
  projectsNb : number;
  devicesConfiguredNb : number;
  devicesUnconfiguredNb : number;

  projectsArray : Array<{country:string,
                         projects:Array<Project>,
                         configured:number,
                         notConfigured:number}>;

  constructor( private apiCallModule: ApiCallsService ) { }

  ngOnInit() {
    try
    {
      this.apiCallModule.postAuth().then(
        val =>
        {
            var token = val as Token;
            this.projectsNb = 0;
            this.devicesConfiguredNb = 0;
            this.devicesUnconfiguredNb = 0;
            this.userUpdatedBefore = 0;
            this.userUpdatedLastMonth = 0;
            //this.userUpdatedLastWeek = 0;

            this.apiCallModule.getUsers(token).then(users =>
            {
               var usersArray = users as Array<User>;
               this.usersNb = usersArray.length;

               usersArray.forEach(u => {
                 var lastUpdate = new Date(u.updatedAt);
                 var today = new Date();
                //  if(lastUpdate > new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7)){
                //   this.userUpdatedLastWeek++;
                //  }else{
                    if(lastUpdate > new Date(today.getFullYear(), today.getMonth() -1, today.getDate())){
                       this.userUpdatedLastMonth++;
                    }else{
                      this.userUpdatedBefore++;
                    }
                //  }
               })
            })

            this.projectsArray = new Array<{country:string, projects:Array<Project>, configured:number, notConfigured:number}>();

            for (var i in countryVars.countryList){

              this.apiCallModule.getProjectsByCountry(token, countryVars.countryList[i]).then(projs =>
              {
                var projsArray = projs as Array<Project>;
              
                if (projs[0] != null){

                  var tempTotalConf = 0;
                  var tempTotalNotConf = 0;

                  for (var j in projsArray){

                    var devicesArray = projsArray[j].devices as Array<Device>;

                    for (var k in devicesArray){
                      if (!devicesArray[k].reference.startsWith("power")){
                            if(devicesArray[k].status== "Configured"){
                              tempTotalConf++;
                            }
                            else{
                              tempTotalNotConf++;
                            }
                        }
                    }
                  }

                  this.projectsNb+=projsArray.length;
                  this.projectsArray.push({country:projs[0].country, projects:projsArray, configured:tempTotalConf, notConfigured:tempTotalNotConf});

                  this.devicesConfiguredNb += tempTotalConf;
                  this.devicesUnconfiguredNb += tempTotalNotConf;
                }
                //sorting function
                this.projectsArray = this.projectsArray.sort(function(arg1, arg2) { return arg2.projects.length - arg1.projects.length });
                
              })
            }

        }
      );
    }catch(ex){
      console.log("postAuth exception" + ex);
    }

  }

}
