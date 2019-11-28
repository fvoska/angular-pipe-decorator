import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResizeListenerComponent } from './resize-listener.component';



@NgModule({
  declarations: [ResizeListenerComponent],
  exports: [ResizeListenerComponent],
  imports: [
    CommonModule
  ]
})
export class ResizeListenerModule { }
