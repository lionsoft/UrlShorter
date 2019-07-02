import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import * as pages from './pages';
import * as services from './services';


const routes: Routes = [
  { path: '', component: pages.HomePage },
  { path: ':hash', component: pages.RedirectPage, canActivate: [services.RedirectService] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
