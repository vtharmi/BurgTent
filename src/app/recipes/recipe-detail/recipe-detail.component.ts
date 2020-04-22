import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipesService } from '../recipes.service';
import { ActivatedRoute, Params, Router, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit {
  // isLoading = false;
  id: number;
   recipe: Recipe;
   recipeId: string;
   userIsAuthenticated = false;
   userId: string;
  constructor(private recipesService: RecipesService, private route: ActivatedRoute, private router: Router, private authService: AuthService ) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.recipe = this.recipesService.getRecipe(this.id);

        // this.recipeId = paramMap.get('recipeId')
        // this.recipe = this.recipesService.getRecipe(this.recipeId);
      }
    );
    this.userId = this.authService.getUserId();
    console.log(this.userId)
    this.userIsAuthenticated = this.authService.getIsAuth();
  }

  onAddToShoppingList() {
    this.recipesService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  onEdit() {
    // this.isLoading = true
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  onDeleteRecipe(recipeId: string) {
    this.recipesService.deleteRecipe(recipeId);
    this.router.navigate(['../'], {relativeTo: this.route});
  }
}
