import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubirImagenComponent } from './components/subir-imagen-component/subir-imagen-component';
import { HomeComponent } from './components/home-component/home-component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'subirimagen', component: SubirImagenComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
