import { Component, OnInit, Input } from '@angular/core';
import { Token } from '../interfaces/token';
import { Device } from '../interfaces/device';
import { Project } from '../interfaces/project';
import { DeviceToDisplay } from '../interfaces/displayDevices';
import { ProjectToDisplay } from '../interfaces/displayProject';
import { ApiCallsService } from '../api-calls.service'
import { refTable } from '../constants/ReferencesTable'

@Component({
  selector: 'app-country-view',
  templateUrl: './country-view.component.html',
  styleUrls: ['./country-view.component.scss'],
  providers: [ApiCallsService]
})

export class CountryViewComponent implements OnInit {

  //parameter from country-view call
  @Input()
  countrySelected: string;

  objectKeys : Array<number>;
  devDisplay : Array<DeviceToDisplay>;
   projWithDevicesArray: Array<ProjectToDisplay>;
   showProjects : boolean;
  // countryName : string;
  constructor(private apiCallModule: ApiCallsService) { }

  ngOnInit() {
    try
    {
      this.showProjects = false;
      this.apiCallModule.postAuth().then(
        val => 
        {
            var token = val as Token;
          
            // console.log('Path:' + window.location.pathname.replace("/", ""));

            // this.countryName = window.location.pathname.replace("/", "");

            this.apiCallModule.getProjectsByCountry(token,  this.countrySelected).then(projs =>
            {  
              var projArray = projs as Array<Project>;

              var devArray = new Array<Device>(); 

              this.projWithDevicesArray = new Array<ProjectToDisplay>();

              // below we retrieve each device for each project and list how many are configured or not for left column table

              //merge all devices from all projects
              projArray.forEach(proj => {
                Array.prototype.push.apply(devArray,proj.devices);        
              });

              var resArray = new Array<DeviceToDisplay>();

              devArray.forEach(dev => {
                //ignore loads
                if (!dev.reference.startsWith("power")){
                  if (resArray.filter(el=>el.reference == dev.reference).length ==0){
                    var catName = refTable[dev.reference];
                    if (dev.status == 'NotConfigured'){
                      resArray.push({reference:dev.reference, catalogName:catName, nbConf:0, nbNotConf:1});
                    }else{
                      resArray.push({reference:dev.reference, catalogName:catName, nbConf:1, nbNotConf:0});
                    }
                  }else{
                    if (dev.status == 'NotConfigured'){
                     resArray.filter(el=>el.reference == dev.reference)[0].nbNotConf++;
                    }else{
                      resArray.filter(el=>el.reference == dev.reference)[0].nbConf++;
                    }
                  }
                }
              });
            
              //sorting function
              this.devDisplay = resArray.sort(function(arg1, arg2) { return arg2.nbConf - arg1.nbConf });

              //here we list each configured device for each project for right column table

              projArray.forEach(element => {

                var conf = 0;
                var notConf = 0;

                element.devices.forEach(el => {
                  if (!el.reference.startsWith('power')){
                      if (el.status == 'NotConfigured') notConf++; else conf++; 
                  }
                  })

                this.projWithDevicesArray.push({projectName: element.projectName, nbConf: conf, nbNotConf: notConf, updatedTime: element.updatedAt});

             
              });

              //Put last project on top;
              this.projWithDevicesArray.reverse();

            })       
        }
      );
    }catch(ex){
      console.log("postAuth exception" + ex);
    }
  }

}
