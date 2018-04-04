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
  swedenProjectsNb:number;
  denmarkProjectsNb:number;
  franceProjectsNb:number;
  projCountry:string;

  constructor( private apiCallModule: ApiCallsService) { }

  ngOnInit() {

    // this.CountryList =["Sweden", "Denmark", "France", "Belgium", "Russia", "Italy", "Germany", "Norway", "Chile", "Turkey", "Poland", "Finland", "Austria", "Spain"];

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

          this.apiCallModule.getProjectsById(token,"58b3fb74-8512-4677-925a-cf83f3137dcb").then(projNb =>
            {  
              var projectNb = projNb as Project;
              this.projCountry = projectNb.country;
            })

            this.apiCallModule.getProjectsNbByCountry(token, "Sweden").then(projNb =>
            {  
              var projectNb = projNb as Array<Project>;
              this.swedenProjectsNb = projectNb.length;
            })

            this.apiCallModule.getProjectsNbByCountry(token, "Denmark").then(projNb =>
              {  
                var projectNb = projNb as Array<Project>;
                this.denmarkProjectsNb = projectNb.length;
              })

              this.apiCallModule.getProjectsNbByCountry(token, "France").then(projNb =>
                {  
                  var projectNb = projNb as Array<Project>;
                  this.franceProjectsNb = projectNb.length;
                })

            this.apiCallModule.getProjects(token).then(proj =>
            {
              var projectsArray = proj as Array<Project>;
              this.projectsNb = projectsArray.length;
            })

            this.apiCallModule.getDevices(token).then(dev =>
            {
              var devicesArray = dev as Array<Project>;

              var devicesConfiguredArray = devicesArray.filter(d => d.status == "Configured");

              this.devicesConfiguredNb = devicesConfiguredArray.length;

              var devicesUnConfiguredArray = devicesArray.filter(d => d.status == "NotConfigured");

              this.devicesUnconfiguredNb = devicesUnConfiguredArray.length;
            })
        }
      );
    }catch(ex){
      console.log("postAuth exception" + ex);
    }

  }

}
