import { Timestamp } from "firebase/firestore";

export interface Ingredient {
    name: string;
    quantity: number;
    unit: string;
  }
  
  export interface Recipe {
    id?: string;
    title: string;
    ingredients: Ingredient[];
    description: string;
    imageUrl?: string;
    createdAt: Timestamp;
  }
  