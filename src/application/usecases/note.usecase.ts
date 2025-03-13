import {  BadRequestException, Inject, Injectable } from "@nestjs/common";
import { NoteDTO } from "src/core/dto/note.dto";
import { NoteInterface } from "src/core/interfaces/note.interface";
import { Ingredient } from "src/infrastructure/db/schemas/note.schema";

@Injectable()
export class NoteUseCase {
    constructor(@Inject('NoteInterface') private readonly NoteRepositoryImpl: NoteInterface) {}

    async store(noteDTO: NoteDTO) {
        const allowedCategories = {
            top_note: ['Citrus', 'Aromatic & Herbal', 'Fruity', 'Green & Fresh', 'Spicy'],
            middle_note: ['Floral', 'Spicy', 'Fruity', 'Woody'],
            base_note: ['Woody', 'Balsamic', 'Sweet & Gourmand', 'Musky & Animalic'],
        };

        if (!allowedCategories[noteDTO.type].includes(noteDTO.category)) {
            throw new BadRequestException(`Invalid category "${noteDTO.category}" for type "${noteDTO.type}".`);
        }

        return this.NoteRepositoryImpl.store(noteDTO);
    }

    delete(id: string){
        return this.NoteRepositoryImpl.delete(id)
    }

    index(){
        return this.NoteRepositoryImpl.index()
    }
    
    storeSingleIngredient(noteId: string, ingredient: Ingredient){
        return this.NoteRepositoryImpl.addSingleIngredient(noteId, ingredient)
    }
}