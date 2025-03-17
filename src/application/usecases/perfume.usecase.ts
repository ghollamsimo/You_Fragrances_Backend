import { Inject, Injectable } from "@nestjs/common";
import { PerfumeDTO } from "src/core/dto/perfume.dto";
import { PerfumeInterface } from "src/core/interfaces/perfume.interface";
import { MinioService } from "./minio.usecase";

@Injectable()
export class PerfumeUseCase {
    constructor(@Inject('PerfumeInterface') private readonly perfumeRepositoryImpl:PerfumeInterface,    private readonly minioService: MinioService,
    ){}

    async store(perfumeDto: PerfumeDTO, file?: Express.Multer.File) {
        const imageUrl = file ? await this.minioService.uploadFile(file, 'perfumes') : null;
        return this.perfumeRepositoryImpl.store({ ...perfumeDto, image: imageUrl });
    }

    delete(id: string):  Promise<{ message: string }>{
        return this.perfumeRepositoryImpl.delete(id)
    }

    async update(id: string, perfumeDto: PerfumeDTO, file?: Express.Multer.File): Promise<{ message: string }> {
        const imageUrl = file ? await this.minioService.uploadFile(file, 'perfumes') : perfumeDto.image;
    
        const updatePerfume = new PerfumeDTO(
            perfumeDto.name,
            imageUrl,
            perfumeDto.brand,
            perfumeDto.topNotes,
            perfumeDto.middleNotes,
            perfumeDto.baseNotes,
            perfumeDto.TargetAudience,
            perfumeDto.Volume,
            perfumeDto.Concentration,
            perfumeDto.sillage,
            perfumeDto.Barcode
        );
    
        return this.perfumeRepositoryImpl.update(id, updatePerfume);
    }

    index(){
        return this.perfumeRepositoryImpl.index()
    }

    show(id: string){
        return this.perfumeRepositoryImpl.show(id)
    }

    getIndexScreen() {
       return this.perfumeRepositoryImpl.getIndexScreen()
    }
    
    getBestPerfume(){
        return this.perfumeRepositoryImpl.getBestPerfume()
    }
}
