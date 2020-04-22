import { Ingredient } from '../shared/ingredient.model';

export class Recipe {
    public id: string;
    public name: string;
    public description: string;
    public imagePath: string;
    public ingredients: Ingredient[];
    public creator: string;

    constructor(id: string, name: string, desc: string, imagePath: string, ingredients: Ingredient[], creator: string) {
        this.id = id,
        this.name = name;
        this.description = desc;
        this.imagePath = imagePath;
        this.ingredients = ingredients;
        this.creator = creator;
    }
}