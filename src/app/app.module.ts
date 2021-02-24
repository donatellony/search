import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchService } from './services/search.service';
import { CommonModule } from '@angular/common';
import {HttpClientModule} from "@angular/common/http";

@NgModule({
	imports: [BrowserModule, AppRoutingModule, CommonModule, FormsModule, HttpClientModule],
	declarations: [AppComponent],
	providers: [SearchService],
	bootstrap: [AppComponent],
})
export class AppModule {}
