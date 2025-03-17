import { IngredientDTO } from "../dto/ingredient.dto";

export interface IngredientInterface {
    store(ingredientDto: IngredientDTO)
    storeMultiple(ingredients: IngredientDTO[])
    delete(id: string): Promise<{ message: string }>;
    update(id: string, ingredientDto: IngredientDTO): Promise<{ message: string }>;
    index(); 
    show(id: string); 
}
