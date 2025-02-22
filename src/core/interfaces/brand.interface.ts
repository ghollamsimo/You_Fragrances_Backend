import { BrandDTO } from "../dto/brand.dto";
import { GetBrandIndexScreenDto } from "../dto/get/brand-get-index.dto";
import { BrandEntity } from "../entities/brand.entity";

export interface BrandInterface {
    store(brandDTO: BrandDTO): Promise<BrandEntity>
    delete(id: string): Promise<{message: string}>
    update(id: string, brandDTO: BrandDTO): Promise<{message: string}>
    index();
    show(id: string)
    getIndexScreen(): Promise<GetBrandIndexScreenDto[]>
    
}