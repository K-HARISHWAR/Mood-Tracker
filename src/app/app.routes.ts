import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: '',
    loadComponent: () =>
      import('./sign-up-form/sign-up-form.component').then(m => m.SignUpFormComponent),
},
    {
    path:'login',
    loadComponent: () =>
     import('./login/login.component').then(m => m.LoginComponent),
},
 {
    path:'home',
    loadComponent: () =>
     import('./home/home.component').then(m => m.HomeComponent),
},
{
  path:'mood-form',
  loadComponent:()=>
    import('./mood-form/mood-form.component').then(m=>m.MoodFormComponent),
},
{
  path:'mood-chart',
  loadComponent:()=>
    import('./mood-chart/mood-chart.component').then(m=>m.MoodChartComponent),
}
];
