import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { NoteDTO } from "src/core/dto/note.dto";
import { NoteEntity } from "src/core/entities/note.entity";
import { NoteInterface } from "src/core/interfaces/note.interface";
import { Note as NoteDocument} from "../db/schemas/note.schema";
import { Model } from "mongoose";

@Injectable()
export class NoteRepositoryImpl implements NoteInterface{

    constructor(@InjectModel(NoteDocument.name) private readonly noteModel : Model<NoteDocument>) {}

    async store(noteDTO: NoteDTO): Promise<NoteEntity> {
        const existingNote = await this.noteModel.findOne({
            type: noteDTO.type,
            "ingredients.name": { $in: noteDTO.ingredients.map(i => i.name) }
        });
    
        if (existingNote) {
            throw new Error("Note with the same type and ingredients already exists.");
        }
    
        const createNote = new this.noteModel(noteDTO);
        const saveNote = await createNote.save();
        return new NoteEntity(saveNote);
    }
    

    async delete(id: string): Promise<{ message: string; }> {
        const deleteNote = await this.noteModel.findByIdAndDelete(id)
        if(!deleteNote) {
            throw new NotFoundException('Note not found');
        }
        return { message: 'Note deleted Successfully' }
    }
    update(id: string, noteDTO: NoteDTO): Promise<{ message: string; }> {
        throw new Error("Method not implemented.");
    }
    index() {
        return this.noteModel.find().exec()
    }
    
} 