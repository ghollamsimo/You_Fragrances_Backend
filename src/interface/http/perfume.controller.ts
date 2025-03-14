import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { identity } from "rxjs";
import { PerfumeUseCase } from "src/application/usecases/perfume.usecase";
import { PerfumeDTO } from "src/core/dto/perfume.dto";

@Controller('perfumes')
export class PerfumeController{
    constructor(private readonly perfumeUseCase: PerfumeUseCase){}

    @Post('store')
    @UseInterceptors(FileInterceptor('image'))
    async store(@Body() perfumeDTO: PerfumeDTO, @UploadedFile() file: Express.Multer.File){
        return await this.perfumeUseCase.store(perfumeDTO, file)
    }

    @Get('allPerfumes')
    async index(){
        return await this.perfumeUseCase.index()
    }

    @Get('index')
    async getIndexScreen(){
        return await this.perfumeUseCase.getIndexScreen()
    }
    @Get('show/:perfumeId')
    async show(@Param('perfumeId')perfumeId: string){
        return await this.perfumeUseCase.show(perfumeId)
    }

    @Delete('destroy/:id')
    async delete(@Param('id') id: string){
        return await this.perfumeUseCase.delete(id)
    }

    @Put('update/:id')
    async update(@Param('id') id: string, perfumeDto: PerfumeDTO){
        
    }

    @Get('/bestPerfume')
    async getBestPerfume(){
        return await this.perfumeUseCase.getBestPerfume()
    }
}