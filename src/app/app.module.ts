import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientInMemoryWebApiModule } from "angular-in-memory-web-api";
import { InMemoryDatabase } from "./in-memory-database";

import { ToastrModule } from 'ngx-toastr';
import { I18NextModule } from 'angular-i18next';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDatabase),
    ToastrModule.forRoot(),
    I18NextModule.forRoot(),
    TranslateModule.forRoot({
      defaultLanguage: 'pt'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
