import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { BrandUseCase } from "src/application/usecases/brand.usecase";
import { BrandDTO } from "src/core/dto/brand.dto";
import { JwtAuthGuard } from "src/guard/guard";

@Controller('brand')
export class BrandController {
    constructor(private readonly brandUseCase: BrandUseCase){}
    
    // @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('image'))
    @Post('store')
    async store(@Body() body: {name: string, image: string, description: string, country: string, founded: number},  @UploadedFile() file: Express.Multer.File){
        const brandDto: BrandDTO = new BrandDTO(body.name, body.image, body.description, body.country, body.founded)
        return await this.brandUseCase.store(brandDto, file)
    }
    @Delete('destroy/:id')
    delete(@Param('id') id: string){
        return this.brandUseCase.delete(id)
    }
    @UseInterceptors(FileInterceptor('image')) 
  @Patch('update/:id')
  async update(
    @Param('id') id: string,                  
    @Body() brandDto: BrandDTO,               
    @UploadedFile() file: Express.Multer.File 
  ): Promise<{ message: string }> {
 
    return this.brandUseCase.update(id, brandDto, file);
  }
    

    @Get('allBrands')
    index(){
        return this.brandUseCase.index()
    }

    @Get('show/:id')
    show(@Param('id') id: string){
        return this.brandUseCase.show(id)
    }

    @Get('index')
    async getIndexScreen(){
        return await this.brandUseCase.getIndexScreen()
    }
}