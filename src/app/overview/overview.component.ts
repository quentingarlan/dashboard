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

  projectsArray : Array<{country:string, projects:Array<Project>}>;

  constructor( private apiCallModule: ApiCallsService) { }

  ngOnInit() {

    var countryList =["Sweden", "Denmark", "France", "Belgium", "Russia", "Italy", "Germany", "Norway", "Chile", "Turkey", "Poland", "Finland", "Austria", "Spain"];

    try
    {
      this.apiCallModule.postAuth().then(
        val => 
        {
            var token = val as Token;

            this.apiCallModule.getUsers(token).then(users =>
            {
               var usersArray = users as Array<Project>;
               this.usersNb = usersArray.length;
            })

            this.projectsArray = new Array<{country:string, projects:Array<Project>}>();

            for (var i in countryList){

              this.apiCallModule.getProjectsNbByCountry(token, countryList[i]).then(projs =>
                {  
                  var projsArray = projs as Array<Project>;

                  if (projs[0] != null){
                    this.projectsArray.push({country:projs[0].country, projects:projsArray})
                  }
                  
                })
            }           

            // this.apiCallModule.getProjects(token).then(proj =>
            // {
            //   var projectsArray = proj as Array<Project>;
            //   this.projectsNb = projectsArray.length;
            // })

            // this.apiCallModule.getDevices(token).then(dev =>
            // {
            //   var devicesArray = dev as Array<Project>;

            //   var devicesConfiguredArray = devicesArray.filter(d => d.status == "Configured");

            //   this.devicesConfiguredNb = devicesConfiguredArray.length;

            //   var devicesUnConfiguredArray = devicesArray.filter(d => d.status == "NotConfigured");

            //   this.devicesUnconfiguredNb = devicesUnConfiguredArray.length;
            // })
        }
      );
    }catch(ex){
      console.log("postAuth exception" + ex);
    }

  }

}
