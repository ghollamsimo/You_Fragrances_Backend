import { Injectable, Inject } from '@nestjs/common';
import { IngredientDTO } from 'src/core/dto/ingredient.dto';  
import { IngredientInterface } from 'src/core/interfaces/ingredient.interface'; 
import { MinioService } from './minio.usecase';

@Injectable()
export class IngredientUseCase {
    constructor(@Inject('IngredientInterface') private readonly ingredientRepository: IngredientInterface, private readonly minioService: MinioService) {}

    async store(ingredientDto: IngredientDTO, file?: Express.Multer.File) {
        const imageUrl = file ? await this.minioService.uploadFile(file, 'notes') : null;
        return this.ingredientRepository.store({...ingredientDto, image: imageUrl});
    }

    async index() {
        return this.ingredientRepository.index();
    }

    async destroy(id: string) {
        return this.ingredientRepository.delete(id);
    }

    async update(id: string, ingredientDto: IngredientDTO) {
        return this.ingredientRepository.update(id, ingredientDto);
    }

    async show(id: string) {
        return this.ingredientRepository.show(id);
    }
}
