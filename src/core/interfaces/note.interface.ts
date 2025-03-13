import { Ingredient } from "src/infrastructure/db/schemas/note.schema";
import { NoteDTO } from "../dto/note.dto";
import { NoteEntity } from "../entities/note.entity";

export interface NoteInterface{
    store(noteDTO: NoteDTO): Promise<NoteEntity>
    delete(id: string): Promise<{message: string}>
    update(id: string, noteDTO: NoteDTO): Promise<{message: string}>
    index();
    addSingleIngredient(noteId: string, ingredient: Ingredient): Promise<NoteEntity>
}