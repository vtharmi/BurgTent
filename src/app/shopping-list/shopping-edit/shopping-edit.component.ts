import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.scss']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  subscription: Subscription
  shoppingEditForm: FormGroup;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient; 

  constructor(private shoppingListService: ShoppingListService, private fb: FormBuilder) { }

  ngOnInit() {
    this.shoppingEditForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z]*')]],
      amount: ['', [Validators.required, Validators.minLength(1), Validators.pattern('[0-9]*')]]
    });

    this.subscription = this.shoppingListService.startEditing.subscribe(
      (index: number) => {
        this.editMode = true;
        this.editedItemIndex = index;
        this.editedItem = this.shoppingListService.getIngredient(index)
        this.shoppingEditForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        })
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit() {
    const newIngredient = new Ingredient(this.shoppingEditForm.get('name').value, this.shoppingEditForm.get('amount').value);
    if(this.editMode){
      this.shoppingListService.updateIngredient(this.editedItemIndex, newIngredient);
    }
    else {
      this.shoppingListService.addIngredient(newIngredient);
    }
    this.editMode = false;
    this.shoppingEditForm.reset();
  }

  onClear() {
    this.shoppingEditForm.reset();
    this.editMode = false;
  }

  onDelete() {
    this.shoppingListService.deleteIngredient(this.editedItemIndex);
    this.onClear();
  }
}
