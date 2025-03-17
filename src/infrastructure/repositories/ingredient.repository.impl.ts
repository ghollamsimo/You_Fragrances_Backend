import { IngredientInterface } from "src/core/interfaces/ingredient.interface";
import { Ingredient as IngredientDocument } from "../db/schemas/ingredient.schema";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { IngredientDTO } from "src/core/dto/ingredient.dto";

@Injectable()
export class IngredientRepositoryImpl implements IngredientInterface {
  constructor(
    @InjectModel(IngredientDocument.name) private readonly ingredientModel: Model<IngredientDocument>,
  ) {}

  async store(ingredientDto: IngredientDTO) {
    const ingredient = new this.ingredientModel(ingredientDto);
    await ingredient.save();
    return ingredient.toObject();
}

async storeMultiple(ingredients: IngredientDTO[]) {
    const storedIngredients = await this.ingredientModel.insertMany(ingredients);
    return storedIngredients.map((ingredient) => ingredient.toObject());
}


  async delete(id: string): Promise<{ message: string }> {
    const ingredient = await this.ingredientModel.findByIdAndDelete(id);
    if (!ingredient) {
      throw new Error("Ingredient not found");
    }
    return { message: "Ingredient deleted successfully" };
  }

  async update(id: string, ingredientDto: IngredientDTO): Promise<{ message: string }> {
    const updatedIngredient = await this.ingredientModel.findByIdAndUpdate(id, ingredientDto, {
      new: true, 
    });
    if (!updatedIngredient) {
      throw new Error("Ingredient not found");
    }
    return { message: "Ingredient updated successfully" };
  }

  async index() {
    const ingredients = await this.ingredientModel.find();
    return ingredients.map(ingredient => ingredient.toObject());
  }

  async show(id: string) {
    const ingredient = await this.ingredientModel.findById(id);
    if (!ingredient) {
      throw new Error("Ingredient not found");
    }
    return ingredient.toObject();
  }
}
