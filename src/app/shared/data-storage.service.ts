import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipesService } from '../recipes/recipes.service';

@Injectable()
export class DataStorageService {

    constructor(private http: HttpClient, private recipeService: RecipesService ) {}

    storeRecipes() {
        return this.http.post('http://localhost:3000/recipes', this.recipeService.getRecipes());
    }
    // getRecipes() {
    //     return this.http.get<{recipes: recipes[]}>('http://localhost:3000/recipes').subscribe(
    //         (response) => {

    //         }
    //     );
    // }
}