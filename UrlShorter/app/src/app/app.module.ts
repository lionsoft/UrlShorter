import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import * as md from '@angular/material';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import * as pages from './pages';
import * as services from './services';

@NgModule({
    declarations: [
        AppComponent,
        pages.HomePage,
        pages.RedirectPage
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientModule,
        md.MatInputModule,
        md.MatButtonModule,
        md.MatFormFieldModule,
        md.MatDialogModule,
        md.MatSnackBarModule,
        md.MatProgressSpinnerModule,
        AppRoutingModule,
    ],
    providers: [
        services.ApiService,
        services.RedirectService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
