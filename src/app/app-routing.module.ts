import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { SkillsListComponent } from './components/skills/skills-list/skills-list.component';
import { AddSkillComponent } from './components/skills/add-skill/add-skill.component';
import { EditSkillComponent } from './components/skills/edit-skill/edit-skill.component';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
  {path:'', redirectTo:'login', pathMatch:'full'},
  {path:'login', component:LoginComponent},
  {path:'signup', component:SignupComponent},
  {path:'dashboard', component:DashboardComponent, canActivate:[AuthGuard]},
  {path: 'skills', component:SkillsListComponent},
  {path: 'skills/add', component:AddSkillComponent},
  {path: 'skills/edit/:id', component:EditSkillComponent},
  {path: 'profile', component:ProfileComponent}



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
