import { Routes } from '@angular/router';
import { RecipeListComponent } from './recipes/recipe-list/recipe-list.component';
import { RecipeFormComponent } from './recipes/recipe-form/recipe-form.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  { path: 'recipes', component: RecipeListComponent },
  { path: 'recipes/new', component: RecipeFormComponent },
  { path: 'recipes/:id', component: RecipeDetailComponent , data: { prerender: false }},
  { path: 'recipes/:id/edit', component: RecipeFormComponent },
];
