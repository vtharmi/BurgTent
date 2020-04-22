import { Recipe } from '../recipes/recipe.model';
import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class RecipesService {
    recipesChanged = new Subject<Recipe[]>();

    recipes: Array<Recipe> = [
        // new Recipe('TestRecipe',
        //     'This is a test recipe ',
        //     'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQw-GhAMewwLnw7wYVazl8bV1lksNOoYudJ1mVz6elMq-XWvE_X',
        //     [
        //         new Ingredient('Margarine', 500),
        //         new Ingredient('Flour', 500)
        //     ]),
        // new Recipe('Chocolate Cake',
        //     'Another test recipe ',
        //     'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRizGzuMg6FffQV9vnYGaqvS9fqXjjcRY9zvlCUDwItFyX2rg4P',
        //     [
        //         new Ingredient('Margarine', 500),
        //         new Ingredient('Flour', 500),
        //         new Ingredient('Egg', 3)
        //     ])
    ]
    constructor(private shoppingListService: ShoppingListService, private http: HttpClient) {

    }

    getRecipes() {

        // return this.recipes.slice();
        this.http.get<{ message: string, recipes: any }>('http://127.0.0.1:3000/recipes')
        .pipe(map((recipeData) => {
            return recipeData.recipes.map(recipe => {
                return {
                    id: recipe._id,
                    name: recipe.name,
                    description: recipe.description,
                    imagePath: recipe.imagePath,
                    ingredients: recipe.ingredients,
                    creator: recipe.creator
                }
            })
        }))
        .subscribe(
            (transformedRecipes) => {
                console.log("transformed data",transformedRecipes)
                this.recipes = transformedRecipes;
                console.log(transformedRecipes)
                this.recipesChanged.next([...this.recipes]);
            })
    }

    getRecipe(index : number) {
        return this.recipes.slice()[index];
        // return {...this.recipes.find(recipe => recipe.id === id)}
        // return this.http.get('http://127.0.0.1:3000/recipes' + id);
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
        return this.shoppingListService.addIngredients(ingredients);
    }

    addRecipe(recipeValue: Recipe) {
        const recipe: Recipe = {id: null, name: recipeValue.name, description: recipeValue.description, imagePath: recipeValue.imagePath, ingredients: recipeValue.ingredients, creator:null };
        this.http.post<{message: string, recipeId: string}>('http://127.0.0.1:3000/recipes', recipe).subscribe(
            (addedRecipeRespone) => {
                console.log(addedRecipeRespone);
                const recipeID = addedRecipeRespone.recipeId;
                recipe.id = recipeID
                this.recipes.push(recipe);
                this.recipesChanged.next(this.recipes.slice());
            }
        );
       
    }

    updateRecipe(index:number, newRecipe: Recipe) {
        this.recipes[index] = newRecipe;
        this.http.put('http://127.0.0.1:3000/recipes/' + newRecipe.id, newRecipe).subscribe(
            (updatedData) => {
                console.log(updatedData);
                this.recipesChanged.next(this.recipes.slice())
            }
        )
    }

    deleteRecipe(recipeId) {
        console.log(recipeId)
        // this.recipes.splice(index, 1)
        this.http.delete('http://127.0.0.1:3000/recipes/' + recipeId).subscribe(
            () => {
                this.recipes = this.recipes.filter(recipe => recipe.id !== recipeId)
                this.recipesChanged.next(this.recipes.slice());
            }
        )
    }


}