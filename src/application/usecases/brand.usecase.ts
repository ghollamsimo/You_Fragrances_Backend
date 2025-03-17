import { Inject, Injectable } from "@nestjs/common";
import { BrandDTO } from "src/core/dto/brand.dto";
import { BrandEntity } from "src/core/entities/brand.entity";
import { BrandInterface } from "src/core/interfaces/brand.interface";
import { MinioService } from "./minio.usecase";

@Injectable()
export class BrandUseCase {
    constructor(@Inject('BrandInterface') private readonly brandRepositoryImpl: BrandInterface, private readonly minioService: MinioService){}

    async store(brandDTO: BrandDTO, file?: Express.Multer.File): Promise<BrandEntity>{
        const imageUrl = file ? await this.minioService.uploadFile(file, 'brands') : null;
        return this.brandRepositoryImpl.store({...brandDTO, image: imageUrl})
    }

    delete(id: string):  Promise<{ message: string }>{
        return this.brandRepositoryImpl.delete(id)
    }

    async update(id: string, brandDTO: BrandDTO, file?: Express.Multer.File): Promise<{ message: string }> {
        const imageUrl = file ? await this.minioService.uploadFile(file, 'brands') : brandDTO.image;
        const updatedBrandDTO = new BrandDTO(
            brandDTO.name,        
            imageUrl,             
            brandDTO.description, 
            brandDTO.country,     
            brandDTO.founded      
        );

        return this.brandRepositoryImpl.update(id, updatedBrandDTO);
    }
    

    index(){
        return this.brandRepositoryImpl.index()
    }

    show(id: string){
        return this.brandRepositoryImpl.show(id)
    }

    getIndexScreen() {
        return this.brandRepositoryImpl.getIndexScreen()
    }
}
