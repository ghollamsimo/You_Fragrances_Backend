import { Injectable, Inject } from '@nestjs/common';
import { IngredientDTO } from 'src/core/dto/ingredient.dto';  
import { IngredientInterface } from 'src/core/interfaces/ingredient.interface'; 
import { MinioService } from './minio.usecase';

@Injectable()
export class IngredientUseCase {
    constructor(@Inject('IngredientInterface') private readonly ingredientRepository: IngredientInterface, private readonly minioService: MinioService) {}

    async store(ingredientDto: any, files?: Express.Multer.File[]) {
        const ingredientDtos = Array.isArray(ingredientDto.name)
            ? ingredientDto.name.map(async (name, index) => ({
                  name: name,
                  color: ingredientDto.color[index],
                  width: ingredientDto.width[index],
                  type: ingredientDto.type[index],
                  image: files && files[index] ? await this.minioService.uploadFile(files[index], 'notes') : null,
              }))
            : []; 

        if (ingredientDtos.length > 0) {
            const resolvedIngredientDtos = await Promise.all(ingredientDtos);
            return this.ingredientRepository.storeMultiple(resolvedIngredientDtos);
        } else {
            return this.ingredientRepository.store({
                name: ingredientDto.name,
                color: ingredientDto.color,
                width: ingredientDto.width,
                type: ingredientDto.type,
                image: files && files[0] ? await this.minioService.uploadFile(files[0], 'notes') : null,
            });
        }
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
