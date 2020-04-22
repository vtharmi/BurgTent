import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipesService } from '../recipes.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  recipes: Recipe[];
  constructor(private recipesService: RecipesService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() { 

    this.recipesService.getRecipes();

    this.subscription = this.recipesService.recipesChanged.subscribe( 
      
      (recipes: Recipe[]) => {
        this.recipes = recipes;
      }
    )
  }
  
  onNewRecipe() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
