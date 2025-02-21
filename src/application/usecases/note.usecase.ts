import {  Inject, Injectable } from "@nestjs/common";
import { NoteDTO } from "src/core/dto/note.dto";
import { NoteInterface } from "src/core/interfaces/note.interface";

@Injectable()
export class NoteUseCase {
    constructor(@Inject('NoteInterface') private readonly NoteRepositoryImpl: NoteInterface) {}

    store(noteDTO: NoteDTO){
        return this.NoteRepositoryImpl.store(noteDTO)
    }

    delete(id: string){
        return this.NoteRepositoryImpl.delete(id)
    }

    index(){
        return this.NoteRepositoryImpl.index()
    }
}