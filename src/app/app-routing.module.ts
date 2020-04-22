import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { RecipesComponent } from '../app/recipes/recipes.component';
import { ShoppingListComponent } from '../app/shopping-list/shopping-list.component';
import { RecipeStartComponent } from './recipes/recipe-start/recipe-start.component';
import { RecipeItemComponent } from './recipes/recipe-list/recipe-item/recipe-item.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';
const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/recipes',
        pathMatch: 'full'
    },
    {
      path: 'recipes',
      component: RecipesComponent,
      children: [
          {
              path: '',
              component: RecipeStartComponent
          },
          {
            path: 'new',
            component: RecipeEditComponent,
            // canActivate: [AuthGuard]
        },
          {
              path: ':id',
              component: RecipeDetailComponent,
            //   canActivate: [AuthGuard]
          },
          {
              path: ':id/edit',
              component: RecipeEditComponent,
            //   canActivate: [AuthGuard]
          }
      ]
    },
    {
      path: 'shopping-list',
      component: ShoppingListComponent,
      canActivate: [AuthGuard]
    },
    {
        path: 'signUp',
        component: SignUpComponent
    },
    {
        path: 'login',
        component: LoginComponent
    }
  ];
@NgModule ({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [
        RouterModule
    ],
    providers: [
        AuthGuard
    ]
})
export class AppRoutingModule {

}