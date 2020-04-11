import { Recipe } from '../recipes/recipe.model';
import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';

@Injectable()
export class RecipesService {
    recipesChanged = new Subject<Recipe[]>();

    recipes: Array<Recipe> = [
        new Recipe('TestRecipe',
            'This is a test recipe ',
            'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQw-GhAMewwLnw7wYVazl8bV1lksNOoYudJ1mVz6elMq-XWvE_X',
            [
                new Ingredient('Margarine', 500),
                new Ingredient('Flour', 500)
            ]),
        new Recipe('Chocolate Cake',
            'Another test recipe ',
            'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRizGzuMg6FffQV9vnYGaqvS9fqXjjcRY9zvlCUDwItFyX2rg4P',
            [
                new Ingredient('Margarine', 500),
                new Ingredient('Flour', 500),
                new Ingredient('Egg', 3)
            ])
    ]
    constructor(private shoppingListService: ShoppingListService) {

    }

    getRecipes() {
        return this.recipes.slice();
    }

    getRecipe(index: number) {
        return this.recipes.slice()[index];
    }

    addIngredientsToShoppingList (ingredients: Ingredient[]) {
        return this.shoppingListService.addIngredients(ingredients);
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, newRecipe: Recipe) {
        this.recipes[index] = newRecipe;
    }

    deleteRecipe(index: number) {
        this.recipes.splice(index, 1)
        this.recipesChanged.next(this.recipes.slice()); 
    }

    
}