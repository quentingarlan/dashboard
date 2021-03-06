import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { environment } from '@env/environment';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { HomeModule } from './home/home.module';
import { AboutModule } from './about/about.module';
import { LoginModule } from './login/login.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { OverviewComponent } from './overview/overview.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CountryViewComponent } from './country-view/country-view.component';
import { MatTabsModule, MatButtonModule, MatCheckboxModule } from '@angular/material';
import { ProjectUpdatesComponent } from './project-updates/project-updates.component';
import { UserEvolutionComponent } from './user-evolution/user-evolution.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot(),
    NgbModule.forRoot(),
    CoreModule,
    SharedModule,
    HomeModule,
    AboutModule,
    LoginModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTabsModule,
  ],
  declarations: [AppComponent, OverviewComponent, DashboardComponent, CountryViewComponent, ProjectUpdatesComponent, UserEvolutionComponent],
  providers: [SharedModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
