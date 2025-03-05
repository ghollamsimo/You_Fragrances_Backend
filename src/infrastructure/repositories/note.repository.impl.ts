import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { NoteDTO } from "src/core/dto/note.dto";
import { NoteEntity } from "src/core/entities/note.entity";
import { NoteInterface } from "src/core/interfaces/note.interface";
import { Note as NoteDocument } from "../db/schemas/note.schema";
import { Model } from "mongoose";
import { Ingredient } from "../db/schemas/note.schema";

@Injectable()
export class NoteRepositoryImpl implements NoteInterface {
  constructor(@InjectModel(NoteDocument.name) private readonly noteModel: Model<NoteDocument>) {}

  private static readonly validCategories = {
    top_note: ['Citrus', 'Aromatic & Herbal', 'Fruity', 'Green & Fresh', 'Spicy'],
    middle_note: ['Floral', 'Spicy', 'Fruity', 'Woody'],
    base_note: ['Woody', 'Balsamic', 'Sweet & Gourmand', 'Musky & Animalic'],
  };

  private static readonly validIngredientsByCategory = {
    top_note: {
      'Citrus': ['Lemon', 'Lime', 'Orange', 'Bergamot', 'Grapefruit'],
      'Aromatic & Herbal': ['Lavender', 'Rosemary', 'Basil', 'Mint', 'Sage'],
      'Fruity': ['Apple', 'Peach', 'Berry', 'Mango', 'Pineapple'],
      'Green & Fresh': ['Grass', 'Cucumber', 'Green Tea', 'Aloe', 'Bamboo'],
      'Spicy': ['Pepper', 'Ginger', 'Cardamom', 'Cinnamon', 'Clove'],
    },
    middle_note: {
      'Floral': ['Rose', 'Jasmine', 'Lily', 'Violet', 'Gardenia'],
      'Spicy': ['Nutmeg', 'Cumin', 'Coriander', 'Saffron', 'Pepper'],
      'Fruity': ['Plum', 'Cherry', 'Apricot', 'Fig', 'Blackcurrant'],
      'Woody': ['Cedar', 'Sandalwood', 'Patchouli', 'Vetiver', 'Pine'],
    },
    base_note: {
      'Woody': ['Oak', 'Teak', 'Birch', 'Ebony', 'Mahogany'],
      'Balsamic': ['Vanilla', 'Amber', 'Benzoin', 'Myrrh', 'Frankincense'],
      'Sweet & Gourmand': ['Honey', 'Caramel', 'Chocolate', 'Tonka Bean', 'Sugar'],
      'Musky & Animalic': ['Musk', 'Civet', 'Ambergris', 'Castoreum', 'Leather'],
    },
  };

  async store(noteDTO: NoteDTO): Promise<NoteEntity> {
    if (!NoteRepositoryImpl.validCategories[noteDTO.type]?.includes(noteDTO.category)) {
      throw new BadRequestException(
        `Invalid category "${noteDTO.category}" for note type "${noteDTO.type}".`
      );
    }

    const validIngredients = NoteRepositoryImpl.validIngredientsByCategory[noteDTO.type][noteDTO.category];
    const ingredientNames = noteDTO.ingredients.map((i) => i.name);

    const invalidIngredients = ingredientNames.filter((name) => !validIngredients.includes(name));
    if (invalidIngredients.length > 0) {
      throw new BadRequestException(
        `Invalid ingredient(s) "${invalidIngredients.join(', ')}" for category "${noteDTO.category}" in type "${noteDTO.type}".`
      );
    }

    const existingNote = await this.noteModel.findOne({
      type: noteDTO.type,
      category: noteDTO.category,
      'ingredients.name': { $in: ingredientNames },
    });

    if (existingNote) {
      throw new BadRequestException('Note with the same type, category, and ingredients already exists.');
    }

    const createdNote = new this.noteModel({
      type: noteDTO.type,
      category: noteDTO.category,
      ingredients: noteDTO.ingredients,
    });
    const savedNote = await createdNote.save();
    return new NoteEntity(savedNote);
  }

  async addSingleIngredient(noteId: string, ingredient: Ingredient): Promise<NoteEntity> {
    const note = await this.noteModel.findById(noteId);
    if (!note) {
      throw new NotFoundException(`Note with ID "${noteId}" not found.`);
    }

    const validIngredients = NoteRepositoryImpl.validIngredientsByCategory[note.type][note.category];
    if (!validIngredients.includes(ingredient.name)) {
      throw new BadRequestException(
        `Invalid ingredient "${ingredient.name}" for category "${note.category}" in type "${note.type}".`
      );
    }

    const ingredientExists = note.ingredients.some((i) => i.name === ingredient.name);
    if (ingredientExists) {
      throw new BadRequestException(
        `Ingredient "${ingredient.name}" already exists in note with ID "${noteId}".`
      );
    }

    note.ingredients.push(ingredient);

    const updatedNote = await note.save();
    return new NoteEntity(updatedNote);
  }

  async delete(id: string): Promise<{ message: string }> {
    const deleteNote = await this.noteModel.findByIdAndDelete(id);
    if (!deleteNote) {
      throw new NotFoundException('Note not found');
    }
    return { message: 'Note deleted successfully' };
  }

  async update(id: string, noteDTO: NoteDTO): Promise<{ message: string }> {
    if (!NoteRepositoryImpl.validCategories[noteDTO.type]?.includes(noteDTO.category)) {
      throw new BadRequestException(
        `Invalid category "${noteDTO.category}" for note type "${noteDTO.type}".`
      );
    }

    const updatedNote = await this.noteModel.findByIdAndUpdate(id, noteDTO, { new: true });
    if (!updatedNote) {
      throw new NotFoundException('Note not found');
    }
    return { message: 'Note updated successfully' };
  }

  index() {
    return this.noteModel.find().exec();
  }
}