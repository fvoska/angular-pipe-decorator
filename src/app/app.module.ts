import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { SearchComponent } from './components/search/search.component';
import { SearchModule } from './components/search/search.module';
import { ResizeListenerComponent } from './components/resize-listener/resize-listener.component';
import { ResizeListenerModule } from './components/resize-listener/resize-listener.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SearchModule,
    ResizeListenerModule,
    RouterModule.forRoot([
      {
        path: '',
        children: [
          {
            path: 'search',
            component: SearchComponent,
          },
          {
            path: 'resize-listener',
            component: ResizeListenerComponent,
          }
        ]
      }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
