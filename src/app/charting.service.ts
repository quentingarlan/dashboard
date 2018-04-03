import { Injectable } from '@angular/core';
import { Chart } from 'Chart.js'
import { Project } from './project';
import { Device } from './device';
import { TagContentType } from '@angular/compiler';

@Injectable()
export class ChartingService {

  constructor() { }

  CreateNbProjectsChart(projects: Array<Project>)
  {
    var nbDannishProjects = projects.filter(p=>p.country == 'Denmark');
    var nbFrenchProjects = projects.filter(p=>p.country == 'France');
    var nbAustriaProjects = projects.filter(p=>p.country == 'Austria');   
    var nbGermanyProjects = projects.filter(p=>p.country == 'Germany');
    var nbSwedenProjects = projects.filter(p=>p.country == 'Sweden');
    var nbRussiaProjects = projects.filter(p=>p.country == 'Russia');
    var nbItalyProjects = projects.filter(p=>p.country == 'Italy');

        var chart = new Chart('projectsCanvas', {
          type:'pie',
          data:{
              labels : ['Danemark', 'France', 'Austria', 'Germany', 'Sweden', 'Russia', 'Italy'],
              datasets:
              [{
                  data:[
                        nbDannishProjects.length,
                        nbFrenchProjects.length,
                        nbAustriaProjects.length,
                        nbGermanyProjects.length,
                        nbSwedenProjects.length,
                        nbRussiaProjects.length,
                        nbItalyProjects.length
                      ],
                  backgroundColor:[
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(25, 2, 72, 0.2)'
                  ],
                  borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(25, 2, 72, 1)'
                ],
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
