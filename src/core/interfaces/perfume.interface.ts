import { GetPerfumeIndexScreenDto } from "../dto/get/perfume-get-index.dto";
import { PerfumeDTO } from "../dto/perfume.dto";
import { PerfumeEntity } from "../entities/perfume.entity";

export interface PerfumeInterface {
      store(perfumeDto: PerfumeDTO): Promise<PerfumeEntity>
        delete(id: string): Promise<{message: string}>
        update(id: string, perfumeDto: PerfumeDTO): Promise<{message: string}>
        index();
        show(id: string)
      getIndexScreen(): Promise<GetPerfumeIndexScreenDto[]>
      getBestPerfume()
}