import {  BadRequestException, Inject, Injectable } from "@nestjs/common";
import { NoteDTO } from "src/core/dto/note.dto";
import { NoteInterface } from "src/core/interfaces/note.interface";

@Injectable()
export class NoteUseCase {
    constructor(@Inject('NoteInterface') private readonly NoteRepositoryImpl: NoteInterface) {}

    async store(noteDTO: NoteDTO) {
        // Define the allowed categories for each type of note
        const allowedCategories = {
            top_note: ['Citrus', 'Aromatic & Herbal', 'Fruity', 'Green & Fresh', 'Spicy'],
            middle_note: ['Floral', 'Spicy', 'Fruity', 'Woody'],
            base_note: ['Woody', 'Balsamic', 'Sweet & Gourmand', 'Musky & Animalic'],
        };

        // Check if the category is valid for the given note type
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
}