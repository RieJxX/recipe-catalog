import { Injectable } from '@angular/core';
import { Firestore, collection, doc, setDoc, collectionData, docData, updateDoc, deleteDoc, Timestamp } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private collectionName = 'recipes';

  constructor(private firestore: Firestore) {}

  // Создание рецепта с автоматической генерацией id
  async createRecipe(recipe: Recipe): Promise<void> {
    // Создаем ссылку на новый документ с автоматически сгенерированным id
    const docRef = doc(collection(this.firestore, this.collectionName));
    recipe.id = docRef.id;
    recipe.createdAt = Timestamp.now()
    // Устанавливаем документ по сгенерированному id
    await setDoc(docRef, recipe);
  }

  // Получение списка рецептов в виде Observable
  getRecipes(): Observable<Recipe[]> {
    const coll = collection(this.firestore, this.collectionName);
    return collectionData(coll, { idField: 'id' }) as Observable<Recipe[]>;
  }

  // Получение рецепта по id
  getRecipeById(id: string): Observable<Recipe | undefined> {
    const docRef = doc(this.firestore, this.collectionName, id);
    return docData(docRef) as Observable<Recipe | undefined>;
  }

  // Обновление рецепта
  async updateRecipe(id: string, updatedRecipe: Partial<Recipe>): Promise<void> {
    const docRef = doc(this.firestore, this.collectionName, id);
    await updateDoc(docRef, updatedRecipe);
  }

  // Удаление рецепта
  async deleteRecipe(id: string): Promise<void> {
    const docRef = doc(this.firestore, this.collectionName, id);
    await deleteDoc(docRef);
  }
}
