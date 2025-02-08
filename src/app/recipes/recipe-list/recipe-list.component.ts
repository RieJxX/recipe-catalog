import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DeleteConfirmDialog } from '../delete-confirm-dialog.component';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatDialogModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];

  constructor(
    private recipeService: RecipeService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes(): void {
    // Подписываемся на Observable, возвращаемый сервисом
    this.recipeService.getRecipes().subscribe((recipes: Recipe[]) => {
      this.recipes = recipes;
    });
  }

  viewRecipe(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/recipes', id]);
    }
  }

  confirmDelete(recipe: Recipe): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialog, {
      width: '300px',
      data: { title: recipe.title }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm' && recipe.id) {
        this.recipeService.deleteRecipe(recipe.id)
          .then(() => this.loadRecipes())
          .catch(error => console.error('Ошибка при удалении рецепта:', error));
      }
    });
  }
}
