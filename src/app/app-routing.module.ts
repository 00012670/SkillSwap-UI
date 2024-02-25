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
import { SwapRequestComponent} from './components/swap-request/swap-request.component';
import { ManageRequestsComponent} from './components/manage-requests/manage-requests.component';

const routes: Routes = [
  {path:'', redirectTo:'login', pathMatch:'full'},
  {path:'login', component:LoginComponent},
  {path:'signup', component:SignupComponent},
  {path:'dashboard', component:DashboardComponent, canActivate:[AuthGuard]},
  {path: 'skills/create', component:AddSkillComponent},
  {path: 'skills/:userId', component:SkillsListComponent},
  {path: 'skills', component: SkillsListComponent},
  {path: 'skill/:id', component:EditSkillComponent},
  {path: 'profile/:id', component: ProfileComponent },
  {path: 'swap/:id', component: SwapRequestComponent },
  {path: 'manage-requests', component: ManageRequestsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
