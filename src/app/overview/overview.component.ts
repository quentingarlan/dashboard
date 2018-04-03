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

  constructor( private apiCallModule: ApiCallsService) { }

  ngOnInit() {

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
