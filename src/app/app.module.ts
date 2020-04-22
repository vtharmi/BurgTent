import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ServerComponent } from './server/server.component';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { HeaderComponent } from '../app/header/header.component';
import { RecipesComponent } from './recipes/recipes.component';
import { RecipeListComponent } from './recipes/recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipeItemComponent } from './recipes/recipe-list/recipe-item/recipe-item.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { ShoppingEditComponent } from './shopping-list/shopping-edit/shopping-edit.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../app/material.module';
import { ShoppingListService } from './shopping-list/shopping-list.service';
import { AppRoutingModule } from '../app/app-routing.module';
import { RecipeStartComponent } from './recipes/recipe-start/recipe-start.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { RecipesService } from './recipes/recipes.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DataStorageService } from './shared/data-storage.service';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthService } from './auth/auth.service';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';


@NgModule({
  declarations: [
    AppComponent,
    ServerComponent,
    HeaderComponent,
    RecipesComponent,
    RecipeListComponent,
    RecipeDetailComponent,
    RecipeItemComponent,
    ShoppingListComponent,
    ShoppingEditComponent,
    RecipeStartComponent,
    RecipeEditComponent,
    SignUpComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    HttpClientModule
    ],
  providers: [
    ShoppingListService, 
    RecipesService, 
    DataStorageService, 
    AuthService, 
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
    // {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
