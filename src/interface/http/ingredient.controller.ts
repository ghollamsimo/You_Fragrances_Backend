import { Controller, Post, Get, Param, Body, Delete, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IngredientUseCase } from 'src/application/usecases/ingredient.usecase';
import { IngredientDTO } from 'src/core/dto/ingredient.dto';  // DTO for Ingredient

@Controller('ingredients')
export class IngredientController {
    constructor(private readonly ingredientService: IngredientUseCase) {}

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    
    async store(@Body() ingredientDto: IngredientDTO,  @UploadedFile() file: Express.Multer.File) {
        return this.ingredientService.store(ingredientDto, file);
    }

    @Get()
    async index() {
        return this.ingredientService.index();
    }

    @Get(':id')
    async show(@Param('id') id: string) {
        return this.ingredientService.show(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() ingredientDto: IngredientDTO) {
        return this.ingredientService.update(id, ingredientDto);
    }

    @Delete(':id')
    async destroy(@Param('id') id: string) {
        return this.ingredientService.destroy(id);
    }
}
