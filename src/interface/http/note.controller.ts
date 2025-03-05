import { Controller, Post, Body, UploadedFiles, UseInterceptors, Delete, Param, Get, Req, BadRequestException, UploadedFile } from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { MinioService } from 'src/application/usecases/minio.usecase';
import { NoteUseCase } from 'src/application/usecases/note.usecase';
import { NoteDTO } from 'src/core/dto/note.dto';
import { Ingredient } from 'src/infrastructure/db/schemas/note.schema';

@Controller('notes')
export class NoteController {
  constructor(
    private readonly noteUseCase: NoteUseCase,
    private readonly minioService: MinioService,
  ) {}

  @Post('store')
@UseInterceptors(AnyFilesInterceptor())
async createNote(
  @Body() body: any, 
  @UploadedFiles() files: Express.Multer.File[],
) {
  try {
    if (!body.type || !body.category) {
      throw new BadRequestException(`Missing required fields: type=${body.type}, category=${body.category}`);
    }

    let ingredients = body.ingredients || [];
    if (!Array.isArray(ingredients)) {
      ingredients = Array.isArray(ingredients) ? ingredients : [ingredients];
    }

    const formattedIngredients = await Promise.all(
      ingredients.map(async (ingredient: any, i: number) => {
        if (!ingredient.name || !ingredient.color || !ingredient.width) {
          throw new BadRequestException('Missing required ingredient fields');
        }
        const file = files.find(f => f.fieldname === `ingredients[${i}][image]`);
        return {
          ...ingredient,
          image: file ? await this.minioService.uploadFile(file, 'notes') : null,
        };
      })
    );

    const noteDTO = new NoteDTO(body.type, body.category, formattedIngredients);
    return this.noteUseCase.store(noteDTO);
  } catch (error) {
    throw new BadRequestException(error.message);
  }
}

  @Delete('destroy/:id')
  async delete(@Param('id') id: string){
    return await this.noteUseCase.delete(id)
  }
  
  @Get('index')
  async index(){
    return await this.noteUseCase.index()
  }

  @Post('ingredient/:id')
  @UseInterceptors(AnyFilesInterceptor())
  async addMultipleIngredients(
      @Param('id') noteId: string,
      @Body() body: any,
      @UploadedFiles() files: Express.Multer.File[],
  ) {
      const ingredients = body.ingredients || [];
      const formattedIngredients = await Promise.all(
          ingredients.map(async (ingredient: any, i: number) => {
              const file = files.find((f) => f.fieldname === `ingredients[${i}][image]`);
              return {
                  name: ingredient.name,
                  color: ingredient.color,
                  width: ingredient.width,
                  image: file ? await this.minioService.uploadFile(file, 'notes') : undefined,
              };
          }),
      );
  
      for (const ingredient of formattedIngredients) {
          await this.noteUseCase.storeSingleIngredient(noteId, ingredient);
      }
  
      return { message: "Ingredients added successfully" };
  }
}
