import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { ConfirmEmail } from './pages/confirm-email/confirm-email';
import { Splash } from './pages/splash/splash';
import { Dashboard } from './pages/dashboard/dashboard';
import { MainLayout } from './components/main-layout/main-layout';
import { Habitos } from './pages/habitos/habitos';
import { Conquistas } from './pages/conquistas/conquistas';
import { NotificacaoPage } from './pages/notificacao/notificacao';
import { FriendsComponent } from './pages/friends/friends';

export const routes: Routes = [
  { path: '', component: Splash },
  { path: 'home', component: Landing },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'confirm-email', component: ConfirmEmail },
  { path: 'friends', component: FriendsComponent },
  {

    path: '',
    component: MainLayout,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'habitos', component: Habitos },
      { path: 'conquistas', component: Conquistas },
      { path: 'notificacao', component: NotificacaoPage },
      { path: 'friends', component: FriendsComponent }
    ]
  }
];