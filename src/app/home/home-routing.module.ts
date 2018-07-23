import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';
import { HomeComponent } from './home.component';
import { AppComponent } from '../app.component';
import { DashboardComponent } from '../dashboard/dashboard.component'
import { CountryViewComponent } from '../country-view/country-view.component'
import { OverviewComponent } from '../overview/overview.component'
import { ProjectUpdatesComponent } from '../project-updates/project-updates.component'
import { UserEvolutionComponent } from '../user-evolution/user-evolution.component'
import { countryVars } from '../constants/environment';

var routes: Routes = [
  Route.withShell([
    { path: '', redirectTo: '/', pathMatch: 'full' },
    { path: 'home', component: HomeComponent, data: { title: extract('Home') }   },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'overview', component: OverviewComponent },
    { path: 'projects', component: ProjectUpdatesComponent },
    { path: 'users', component: UserEvolutionComponent }
  ])
];

countryVars.countryList.forEach(
  c => { routes.push( { path: c, component: CountryViewComponent } ) }
)

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class HomeRoutingModule { 

  }
