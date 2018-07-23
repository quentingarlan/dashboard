import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { AppComponent } from '../app.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isLoading: boolean;
  headers: { };

  constructor() 
              { }

  ngOnInit() {
    this.isLoading = true;
  }

}
