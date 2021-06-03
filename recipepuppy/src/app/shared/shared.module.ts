import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThirdPartyModule } from '../third-party/third-party.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ThirdPartyModule
  ],
  exports: [
    CommonModule,
    ThirdPartyModule
  ]
})
export class SharedModule { }
