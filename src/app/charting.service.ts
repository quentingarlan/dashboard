import { Injectable } from '@angular/core';
import { Chart } from 'Chart.js'
import { Project } from './interfaces/project';
import { Device } from './interfaces/device';
import { TagContentType } from '@angular/compiler';
import { countryVars } from './interfaces/environment';

@Injectable()
export class ChartingService {

  constructor() { }

  CreateNbProjectsChart(projects: Array<Project>)
  {
    var nbProjectArray  = new Array<number>(); 
    for (var i in countryVars.countryList){
      nbProjectArray.push(projects.filter(p=>p.country == countryVars.countryList[i]).length);
    }

        var chart = new Chart('projectsCanvas', {
          type:'pie',
          data:{
              labels :  countryVars.countryList,
              datasets:
              [{
                  data:nbProjectArray,
                  backgroundColor:countryVars.countryListColors,
                  borderColor: countryVars.countryListBorderColors,
                borderWidth: 1
                }]
              },
              options: {
              }
        })

    return chart;
}

    CreateTopdevicesChart(devices: Array<Device>)
    {
      var nbDannishProjects = devices.slice(0, devices.length)
        .map(i=> {
          return 
        });

      var chart = new Chart('topDeviceCanvas', {
        type:'pie',
        data:{
            labels : ['Blind Actuator'],
            datasets:
            [{
                data:[
                    ],
                backgroundColor:[
                  'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                  'rgba(255,99,132,1)'
              ],
              borderWidth: 1
              }]
            },
            options: {
            }
      })

      return chart;
    }
  
}
