import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { RecipesService } from '../recipes.service';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.scss']
})
export class RecipeEditComponent implements OnInit {

  id: number;
  editMode = false;
  recipeEditForm: FormGroup;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private recipesService: RecipesService, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
      });
  }

  buildIngredients(name: string, amount: number): FormGroup {
    return this.fb.group({
      name: [name, [Validators.required, Validators.pattern('[a-zA-Z]*')]],
      amount: [amount, [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(1)]]
    })
  }

  private initForm() {
    let recipeName =  '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = this.fb.array([]);

    if(this.editMode){
      const recipe = this.recipesService.getRecipe(this.id);
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescription = recipe.description;
      if(recipe['ingredients']) {
        for(let ingredient of recipe.ingredients) {
          recipeIngredients.push(
            // new FormGroup({
            //   'name': new FormControl(ingredient.name),
            //   'amount': new FormControl(ingredient.amount) 
            // })
            this.buildIngredients(ingredient.name, ingredient.amount)
          );
        }
      }
    }

    this.recipeEditForm = this.fb.group({
      name: [recipeName, [Validators.required]],
      imagePath: [recipeImagePath, [Validators.required]],
      description: [recipeDescription, [Validators.required]],
      ingredients: recipeIngredients
    })
  }

  onAddIngredient() {
    (<FormArray>this.recipeEditForm.get('ingredients')).push(
      this.buildIngredients('', null)
    )
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onRemoveIngredient(index: number) {
    (<FormArray>this.recipeEditForm.get('ingredients')).removeAt(index);
  }

  onSubmit() {

    if(this.editMode){
      this.recipesService.updateRecipe(this.id, this.recipeEditForm.value);
    }
    else{
      this.recipesService.addRecipe(this.recipeEditForm.value);
    }
    this.onCancel();
  }
}
