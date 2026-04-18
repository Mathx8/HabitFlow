import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Splash } from './pages/splash/splash';
import { Dashboard } from './pages/dashboard/dashboard';
import { MainLayout } from './components/main-layout/main-layout';
import { Habitos } from './pages/habitos/habitos';

export const routes: Routes = [
  { path: '', component: Splash },
  { path: 'home', component: Landing },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {
    path: '',
    component: MainLayout,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'habitos', component: Habitos },
      // { path: 'chat', component: Chat },
    ]
  }
];