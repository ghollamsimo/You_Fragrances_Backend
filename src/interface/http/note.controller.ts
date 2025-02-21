import { Controller, Post, Body, UploadedFiles, UseInterceptors, Delete, Param, Get } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { MinioService } from 'src/application/usecases/minio.usecase';
import { NoteUseCase } from 'src/application/usecases/note.usecase';

@Controller('notes')
export class NoteController {
  constructor(
    private readonly noteUseCase: NoteUseCase,
    private readonly minioService: MinioService,
  ) {}

  @Post('store')
  @UseInterceptors(AnyFilesInterceptor())
  async createNote(@Body() body: any, @UploadedFiles() files: Express.Multer.File[]) {
    try {
      const ingredients = await Promise.all(
        (Array.isArray(body.ingredients) ? body.ingredients : [body.ingredients]).map(
          async (ingredient, i) => {
            if (!ingredient.name || !ingredient.color || !ingredient.width) {
              throw new Error('Missing required ingredient fields');
            }
  
            const file = files.find(f => f.fieldname === `ingredients[${i}][image]`);
            return { ...ingredient, image: file ? await this.minioService.uploadFile(file, 'notes') : null };
          }
        )
      );
  
      return this.noteUseCase.store({ type: body.type, ingredients });
    } catch (error) {
      console.error('Error:', error.message);
      throw new Error('Invalid ingredient data format');
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
}
