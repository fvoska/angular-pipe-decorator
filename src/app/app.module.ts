import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { SearchComponent } from './components/search/search.component';
import { SearchModule } from './components/search/search.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SearchModule,
    RouterModule.forRoot([
      {
        path: '',
        children: [
          {
            path: 'search-1',
            component: SearchComponent,
          },
          {
            path: 'search-2',
            component: SearchComponent,
          }
        ]
      }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
