import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { BrandUseCase } from "src/application/usecases/brand.usecase";
import { BrandDTO } from "src/core/dto/brand.dto";
import { JwtAuthGuard } from "src/guard/guard";

@Controller('brand')
export class BrandController {
    constructor(private readonly brandUseCase: BrandUseCase){}
    
    @UseGuards(JwtAuthGuard)
    @Post('store')
    async store(@Body() body: {name: string, image: string, description: string, type: any}){
        const brandDto: BrandDTO = new BrandDTO(body.name, body.image, body.description, body.type)
        return await this.brandUseCase.store(brandDto)
    }
    @Delete('destroy/:id')
    delete(@Param('id') id: string){
        return this.brandUseCase.delete(id)
    }
    @Patch('update/:id')
    update(@Param('id') id: string, brandDto: BrandDTO){
        return this.brandUseCase.update(id, brandDto)
    }

    @Get('index')
    index(){
        return this.brandUseCase.index()
    }

    @Get('show/:id')
    show(@Param('id') id: string){
        return this.brandUseCase.show(id)
    }
}