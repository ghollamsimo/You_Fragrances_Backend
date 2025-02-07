import { Inject, Injectable } from "@nestjs/common";
import { BrandDTO } from "src/core/dto/brand.dto";
import { BrandEntity } from "src/core/entities/brand.entity";
import { BrandInterface } from "src/core/interfaces/brand.interface";

@Injectable()
export class BrandUseCase {
    constructor(@Inject('BrandInterface') private readonly brandRepositoryImpl: BrandInterface){}

    store(brandDTO: BrandDTO): Promise<BrandEntity>{
        return this.brandRepositoryImpl.store(brandDTO)
    }

    delete(id: string):  Promise<{ message: string }>{
        return this.brandRepositoryImpl.delete(id)
    }

    update(id: string, brandDTO: BrandDTO): Promise<{ message: string }>{
        return this.brandRepositoryImpl.update(id, brandDTO)
    }

    index(){
        return this.brandRepositoryImpl.index()
    }

    show(id: string){
        return this.brandRepositoryImpl.show(id)
    }
}
