import { Injectable } from '@angular/core';
import { Chart } from 'Chart.js'
import { Project } from './interfaces/project';
import { Device } from './interfaces/device';
import { User } from './interfaces/user';
import { TagContentType } from '@angular/compiler';
import { countryVars } from './constants/environment';
import { refTable } from './constants/ReferencesTable'

@Injectable()
export class ChartingService {

  constructor() { }

  CreateNbProjectsChart(projects: Array<Project>,
                        projectCanvasID: string)
  {
    var nbProjectArray  = new Array<{country: string, nb: number}>();

    for (var i in countryVars.countryList){
      var nbProjs = projects.filter(p=>p.country == countryVars.countryList[i]).length;
      if (nbProjs > 0)
         nbProjectArray.push({country: countryVars.countryList[i],nb: nbProjs});
    }

    nbProjectArray.sort(function(obj1, obj2) {
      return obj2.nb - obj1.nb;
    });

    var numbers = new Array<number>();
    var countries = new Array<string>(); 

    nbProjectArray.forEach(proj => {  numbers.push(proj.nb);
                                    countries.push(proj.country + " projects"); });

    var chart = new Chart(projectCanvasID, {
      type: 'pie',
      data:{
            labels :  countries,
            datasets:
            [{
                data:numbers,
                backgroundColor:countryVars.countryListColors,
                borderColor: countryVars.countryListBorderColors,
                borderWidth: 1
              }]
          },
          options: {
              legend: {
                  display: false
              },
          }
    })

    return chart;
  }

  CreateAverageConfDevices(projects: Array<Project>,
                           projectCanvasID: string){

    var projectsByCountry  = new Array<Project>();
    var avgDevConfiguredbyProjs = new Array<{country: string, avg: number}>();

    for (var i in countryVars.countryList){
      var projConfigured = 0;
      var totalDevices = 0;

      projectsByCountry = projects.filter(p=>p.country == countryVars.countryList[i]);

      projectsByCountry.forEach(proj => {
        var devConfiguredCount = proj.devices.filter(dev => dev.reference != undefined && !dev.reference.startsWith('power') && dev.status == "Configured").length;
        if (devConfiguredCount > 0)
          projConfigured++;

        totalDevices += devConfiguredCount;  
      });

      var avgDevs = totalDevices / projConfigured;

      if (avgDevs > 0)
        avgDevConfiguredbyProjs.push({country: countryVars.countryList[i], avg: avgDevs}); 
    }

    avgDevConfiguredbyProjs.sort(function(obj1, obj2) {
      return obj2.avg - obj1.avg;
    });

    var numbers = new Array<number>();
    var countries = new Array<string>(); 

    avgDevConfiguredbyProjs.forEach(proj => { numbers.push(~~proj.avg);
                                             countries.push(proj.country) } );
    
    var chart = new Chart(projectCanvasID, {
      type:'bar',
      data:{
        labels :  countries,
        datasets:
          [{
              label:'Average configured devices per configured project',
              data:numbers,
              backgroundColor:countryVars.countryListColorsConfig,
              borderColor: countryVars.countryListBorderColorsConfig,
              borderWidth: 1
          }]
        },
        options: {
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
                        gridLines: {
                            display:false
                        }
                    }],
            yAxes: [{
                        gridLines: {
                            display:false
                        }   
                    }]
            },
        }
      })

    return chart;
  }

  CreateProjectsDetailsChart(projects: Array<Project>,
                             projectCanvasID: string)
        {
          var projectsByCountry  = new Array<Project>();

          var nbConfiguredProjs = new Array<{country: string, confNb: number}>();
          var nbUnconfiguredProjs = new Array<number>();
          var nbUnconfAndLessThan10Projs = new Array<number>();

          for (var i in countryVars.countryList){
            var confProjs = 0;
            var unconfProjs = 0;
            var unconfAndLessThan10Projs = 0;

            projectsByCountry = projects.filter(p=>p.country == countryVars.countryList[i]);

            projectsByCountry.forEach(proj => {

              if (proj.devices.find(dev => dev.reference != undefined && !dev.reference.startsWith('power') && dev.status == "Configured")){
                  confProjs++;
              }else{
                if (proj.devices.length < 10)
                   unconfAndLessThan10Projs++;
                else
                   unconfProjs++;
              }

             });

             nbConfiguredProjs.push({country:countryVars.countryList[i], confNb: confProjs});
             nbUnconfiguredProjs.push(unconfProjs);
             nbUnconfAndLessThan10Projs.push(unconfAndLessThan10Projs);

            }

            nbConfiguredProjs.sort(function(obj1, obj2) {
              return obj2.confNb - obj1.confNb;
            });
        
            var numbers = new Array<number>();
            var countries = new Array<string>();

            nbConfiguredProjs.forEach(proj => { numbers.push(proj.confNb);
                                              countries.push(proj.country) });    

            var chart = new Chart(projectCanvasID, {
              type:'horizontalBar',
              data:{
                labels :  countries,
                datasets:
                  [{
                      label:'Configured projects',
                      data:numbers,
                      backgroundColor:countryVars.countryListColorsConfig,
                      borderColor: countryVars.countryListBorderColorsConfig,
                      borderWidth: 1
                  },
                  {
                      label:'Not configured projects',
                      data:nbUnconfiguredProjs,
                      backgroundColor:countryVars.countryListColorsUnConfig,
                      borderColor: countryVars.countryListBorderColorsUnConfig,
                      borderWidth: 1
                  },
                  {
                      label:'Not configured and <10 devices projects',
                      data:nbUnconfAndLessThan10Projs,
                      backgroundColor:countryVars.countryListColorsUnConfigAndLessThan10,
                      borderColor: countryVars.countryListBorderColorsUnConfigAndLessThan10,
                      borderWidth: 1
                  }]
                },
                options: {
                  scales: {
                    xAxes: [{
                        stacked: true,
                        gridLines: {
                          display:false
                        },
                    }],
                    yAxes: [{
                        stacked: true,
                        gridLines: {
                          display:false
                        },
                    }]
                  },
                  legend: {
                    display: false
                  },
                }
              })

        return chart;
      }

  CreateTopDevicesConfigured(projects: Array<Project>,
                             projectCanvasID: string){

      var nbOfDevices = new Array<{devRef:string, devNb:number}>();

      projects.forEach(proj => {
       var devs = proj.devices.filter(dev => dev.reference != undefined && !dev.reference.startsWith('power') && dev.status == "Configured");
        if (devs != undefined){
          devs.forEach(d=>{
                var dev2 = nbOfDevices.find(el => el.devRef == d.reference);
                if (dev2 == undefined){
                  nbOfDevices.push({devRef:d.reference, devNb:1});
                }else{
                  dev2.devNb++;
                }
            }
          )
        }
      });     

      nbOfDevices.sort(function(obj1, obj2) {
        return obj2.devNb - obj1.devNb;
      });

      nbOfDevices.length = 10;
      var numbers = new Array<number>();
      var refs = new Array<string>(); 

      nbOfDevices.forEach(dev => {
        //   dev.devRef = refTable[dev.devRef];
        numbers.push(dev.devNb);
        refs.push(dev.devRef)
        }
      );
      
      var chart = new Chart(projectCanvasID, {
        type:'bar',
        data:{
          labels :  refs,
          datasets:
            [{
                label:'Most configured devices',
                data:numbers,
                backgroundColor:countryVars.topDevsColors,
                borderColor: countryVars.topDevsBorderColors,
                borderWidth: 1
            }]
          },
          options: {
            scales:
                {
                    xAxes: [{
                        display: false,
                        gridLines: {
                          display:false
                        },
                    }],
                    yAxes: [{
                        gridLines: {
                          display:false
                        },
                    }]
                },
                legend: {
                  display: false,
                },
          }
      })

    return chart;
  }

    CreateProjectByMonthChart(monthArray:Array<string>, nbProj: Array<number>, canvasId:string, chartTitle:string)
    {
      var chart = new Chart(canvasId, {
        type:'bar',
        data:{
          labels :  monthArray,
          datasets:
          [{
              data:nbProj,
              backgroundColor:countryVars.countryListColors,
              borderColor: countryVars.countryListBorderColors,
              borderWidth: 1,
              label:chartTitle
            }]
             },
            options: {
              legend: {
                display: false
              },
              scales:
              {
                  xAxes: [{
                      gridLines: {
                        display:false
                      },
                  }],
                  yAxes: [{
                      gridLines: {
                        display:false
                      },
                  }]
              },
            }
      })

      return chart;
    }
    
    CreateExpertVersionChart(usersArray:Array<User>, canvasId:string, chartTitle:string)
    {
      var expert = 0;
      var lite = 0;

      usersArray.forEach(u => {
        if(u.software == "Lite"){
          lite++;
        }else{
          expert++;
        }
      })

      var liteArray = [lite];
      var expertArray = [expert];

      var chart = new Chart(canvasId, {
        type:'bar',
        data:{
          datasets:
          [{
              label:'Lite',
              data:liteArray,
              backgroundColor:countryVars.countryListColors,
              borderColor: countryVars.countryListBorderColors,
              borderWidth: 1,
            },
            {
              label:'Expert',
              data:expertArray,
              backgroundColor:countryVars.topDevsColors,
              borderColor: countryVars.topDevsBorderColors,
              borderWidth: 1,
            }]
             },
            options: {
              scales: {
                xAxes: [{
                            gridLines: {
                                display:false
                            }
                        }],
                yAxes: [{
                            gridLines: {
                                display:false
                            }   
                        }]
                },
            }
      })

      return chart;
    }

    CreateStatVersionChart(usersArray:Array<User>, canvasId:string, chartTitle:string)
    {

      var versions = new Array<{version: string, nbUsers: number}>();

      usersArray.forEach(u => {
         var tempversion = versions.find(v=>v.version == u.version)
        if(tempversion == undefined){
            versions.push({version: u.version, nbUsers: 1});
        }else{
          tempversion.nbUsers++;
        }
      })

      var vers = new Array<string>(); 
      var numbers = new Array<number>();

      versions.forEach(v => {
        vers.push(v.version);
        numbers.push(v.nbUsers)
        }
      );

      var chart = new Chart(canvasId, {
        type:'bar',
        data:{
          labels: vers,
          datasets:
          [{
              data:numbers,
              backgroundColor:countryVars.countryListColors,
              borderColor: countryVars.countryListBorderColors,
              borderWidth: 1,
              label:chartTitle
            }]
             },
            options: {
              scales: {
                  xAxes: [{
                      stacked: true,
                      gridLines: {
                        display:false
                    }
                  }],
                  yAxes: [{
                      stacked: true,
                      gridLines: {
                        display:false
                    }
                  }]
              },
              legend: {
                display: false
              },
            }
      })

      return chart;
    }

    CreateProjectConfigured(months: any, projsNb: any, htmlRef: any): any {
      var chart = new Chart(htmlRef, {
        type:'line',
        data:{
          labels :  months,
          datasets:
          [{
              data:projsNb,
              backgroundColor:countryVars.nbProjectsColors,
              borderColor: countryVars.nbProjectsBorderColors,
              borderWidth: 1,
              label:'Number of projects'
            },
          ]},
            options: {
              legend: {
                display: false
              },
              scales: {
                xAxes: [{
                            gridLines: {
                                display:false
                            }
                        }],
                yAxes: [{
                            gridLines: {
                                display:false
                            }   
                        }]
                },
            }
      })

      return chart;
    }

    CreateConfDevicesConfigured(months: any, confsDevs: any, htmlRef: any): any {
      var chart = new Chart(htmlRef, {
        type:'line',
        data:{
          labels :  months,
          datasets:
          [{
              data:confsDevs,
              backgroundColor:countryVars.nbConfDevicesColors,
              borderColor: countryVars.nbConfDevicesBorderColors,
              borderWidth: 1,
              label:'Number of configured devices'
            },
          ]},
            options: {
              legend: {
                display: false
              },
              scales: {
                xAxes: [{
                            gridLines: {
                                display:false
                            }
                        }],
                yAxes: [{
                            gridLines: {
                                display:false
                            }   
                        }]
                },
            }
      })

      return chart;
    }
  
}
