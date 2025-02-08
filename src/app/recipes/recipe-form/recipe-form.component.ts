import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { urlValidator } from './model/urlPatten';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.scss']
})
export class RecipeFormComponent implements OnInit {
  recipeForm!: FormGroup;
  isEditMode = false;
  recipeId?: string;
  units: string[] = ['гр', 'кг', 'мл', 'л', 'ст. ложка', 'ч. ложка' , "шт."];

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.recipeForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      ingredients: this.fb.array([]),
      imageUrl: ['', [Validators.required, urlValidator()]]
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.recipeId = id;
        this.loadRecipe(id);
      } else {
        this.addIngredient();
      }
    });
  }

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  addIngredient(): void {
    const ingredientGroup = this.fb.group({
      name: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(0.1)]],
      unit: ['', Validators.required]
    });
    this.ingredients.push(ingredientGroup);
  }

  removeIngredient(index: number): void {
    this.ingredients.removeAt(index);
  }

  loadRecipe(id: string): void {
    // Подписываемся на Observable для получения данных рецепта
    this.recipeService.getRecipeById(id).subscribe(recipe => {
      if (recipe) {
        this.recipeForm.patchValue({
          title: recipe.title,
          description: recipe.description,
          imageUrl: recipe.imageUrl
        });
        this.ingredients.clear();
        if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
          recipe.ingredients.forEach(ing => {
            const ingredientGroup = this.fb.group({
              name: [ing.name, Validators.required],
              quantity: [ing.quantity, [Validators.required, Validators.min(0.1)]],
              unit: [ing.unit, Validators.required]
            });
            this.ingredients.push(ingredientGroup);
          });
        }
      }
    });
  }

  async onSubmit(): Promise<void> {
    if (this.recipeForm.valid) {
      const recipe: Recipe = this.recipeForm.value;
      try {
        if (this.isEditMode && this.recipeId) {
          await this.recipeService.updateRecipe(this.recipeId, recipe);
        } else {
          await this.recipeService.createRecipe(recipe);
        }
        this.router.navigate(['/recipes']);
      } catch (error) {
        console.error('Ошибка при сохранении рецепта:', error);
      }
    }
  }
}
