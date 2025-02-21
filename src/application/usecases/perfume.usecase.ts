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

    update(id: string, perfumeDto: PerfumeDTO): Promise<{ message: string }>{
        return this.perfumeRepositoryImpl.update(id, perfumeDto)
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
    
}
