import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Splash } from './pages/splash/splash';

export const routes: Routes = [
  { path: '', component: Splash },
  { path: 'home', component: Landing },
  { path: 'login', component: Login },
  { path: 'register', component: Register}
];