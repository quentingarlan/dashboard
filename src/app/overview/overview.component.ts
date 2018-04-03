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

  constructor( private apiCallModule: ApiCallsService) { }

  ngOnInit() {

    try
    {
      console.log("start call api");
      this.apiCallModule.postAuth().then(
        val => 
        {
            console.log("postAuth call api");
            var token = val as Token;

            this.apiCallModule.getProjects(token).then(proj =>
            {

            })
        }
      );
    }catch(ex){
      console.log("postAuth exception" + ex);
    }

  }

}
