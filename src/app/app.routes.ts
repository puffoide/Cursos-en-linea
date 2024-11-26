import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { IndexComponent } from './components/index/index.component';
import { MisCursosComponent } from './components/mis-cursos/mis-cursos.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { RecuperarContrasenaComponent } from './components/recuperar-contrasena/recuperar-contrasena.component';
import { RegistroComponent } from './components/registro/registro.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

export const routes: Routes = [
    {path: 'index', component: IndexComponent},
    {path: 'login', component: LoginComponent},
    {path: 'mis-cursos', component: MisCursosComponent},
    {path: 'perfil', component: PerfilComponent},
    {path: 'recuperar-contrasena', component: RecuperarContrasenaComponent},
    {path: 'registro', component: RegistroComponent},
    {path: '**', redirectTo: 'index'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes), SweetAlert2Module.forRoot()],
    exports: [RouterModule]
  })
  export class AppRoutingModule {}
