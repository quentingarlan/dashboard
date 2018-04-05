import { Component, OnInit } from '@angular/core';
import { Token } from '../token';
import { Device } from '../device';
import { Project } from '../project';
import { ApiCallsService } from '../api-calls.service'

@Component({
  selector: 'app-country-view',
  templateUrl: './country-view.component.html',
  styleUrls: ['./country-view.component.scss'],
  providers: [ApiCallsService]
})
export class CountryViewComponent implements OnInit {

  devicesArray : Array<Project>;

  constructor(private apiCallModule: ApiCallsService) { }

  ngOnInit() {
    try
    {
      this.apiCallModule.postAuth().then(
        val => 
        {
            var token = val as Token;
            this.apiCallModule.getProjectsByCountry(token, "Sweden").then(projs =>
            {  
              var projArray = projs as  Array<Project>;

              for(var p in projArray){

                console.log("length devs :" + projArray[p].devices.length);
                for(var p in projArray){
                  
                  console.log("length devs :" + projArray[p].devices.length);
                }
              }

            })       
        }
      );
    }catch(ex){
      console.log("postAuth exception" + ex);
    }
  }

}
