import { Test, TestingModule } from '@nestjs/testing';
import { PerfumeUseCase } from "src/application/usecases/perfume.usecase";
import { PerfumeInterface } from "src/core/interfaces/perfume.interface";
import { MinioService } from "src/application/usecases/minio.usecase";
import { PerfumeDTO } from "src/core/dto/perfume.dto";
import { GetPerfumeIndexScreenDto } from "src/core/dto/get/perfume-get-index.dto";

describe('PerfumeUseCase', () => {
    let perfumeUseCase: PerfumeUseCase;
    let perfumeRepository: jest.Mocked<PerfumeInterface>;
    let minioService: jest.Mocked<MinioService>;

    const perfumeRepositoryMock: jest.Mocked<PerfumeInterface> = {
        store: jest.fn(),
        delete: jest.fn(),
        update: jest.fn(),
        index: jest.fn(),
        show: jest.fn(),
        getIndexScreen: jest.fn(),
        getBestPerfume: jest.fn(),
    };

    const minioServiceMock = {
        uploadFile: jest.fn(),
        onModuleInit: jest.fn(),
    } as Partial<jest.Mocked<MinioService>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PerfumeUseCase,
                { provide: 'PerfumeInterface', useValue: perfumeRepositoryMock },
                { provide: MinioService, useValue: minioServiceMock },
            ],
        }).compile();

        perfumeUseCase = module.get<PerfumeUseCase>(PerfumeUseCase);
        perfumeRepository = perfumeRepositoryMock;
        minioService = minioServiceMock as jest.Mocked<MinioService>;
    });

    it('should be defined', () => {
        expect(perfumeUseCase).toBeDefined();
    });

    it('should store a perfume with an image', async () => {
        const perfumeDto: PerfumeDTO = {
            name: 'Test Perfume',
            brand: 'Test Brand',
            image: '',
            topNotes: [],
            middleNotes: [],
            baseNotes: [],
            TargetAudience: '',
            Volume: '',
            Concentration: '',
            sillage: ''
        };
        const file: Express.Multer.File = { filename: 'test.jpg' } as any;
        minioService.uploadFile.mockResolvedValue('image_url');
        perfumeRepository.store.mockResolvedValue({ id: '1', ...perfumeDto, image: 'image_url' } as any);

        const result = await perfumeUseCase.store(perfumeDto, file);
        expect(result).toEqual({ id: '1', ...perfumeDto, image: 'image_url' });
        expect(minioService.uploadFile).toHaveBeenCalledWith(file, 'perfumes');
        expect(perfumeRepository.store).toHaveBeenCalledWith({ ...perfumeDto, image: 'image_url' });
    });

    it('should delete a perfume', async () => {
        perfumeRepository.delete.mockResolvedValue({ message: 'Deleted' });
        const result = await perfumeUseCase.delete('1');
        expect(result).toEqual({ message: 'Deleted' });
        expect(perfumeRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should update a perfume', async () => {
        const perfumeDto: PerfumeDTO = {
            name: 'Updated Perfume',
            brand: 'Updated Brand',
            image: '',
            topNotes: [],
            middleNotes: [],
            baseNotes: [],
            TargetAudience: '',
            Volume: '',
            Concentration: '',
            sillage: '',
        };
        perfumeRepository.update.mockResolvedValue({ message: 'Updated' });
        const result = await perfumeUseCase.update('1', perfumeDto);
        expect(result).toEqual({ message: 'Updated' });
        expect(perfumeRepository.update).toHaveBeenCalledWith('1', perfumeDto);
    });

    it('should return all perfumes', async () => {
        perfumeRepository.index.mockResolvedValue([{ id: '1', name: 'Test Perfume' }]);
        const result = await perfumeUseCase.index();
        expect(result).toEqual([{ id: '1', name: 'Test Perfume' }]);
        expect(perfumeRepository.index).toHaveBeenCalled();
    });

    it('should return a single perfume', async () => {
        perfumeRepository.show.mockResolvedValue({ id: '1', name: 'Test Perfume' });
        const result = await perfumeUseCase.show('1');
        expect(result).toEqual({ id: '1', name: 'Test Perfume' });
        expect(perfumeRepository.show).toHaveBeenCalledWith('1');
    });

    it('should return index screen data', async () => {
        perfumeRepository.getIndexScreen.mockResolvedValue([{ _id: '1', name: 'Index Screen Data', image: '', brand: '', averageRating: 0 }] as GetPerfumeIndexScreenDto[]);
        const result = await perfumeUseCase.getIndexScreen();
        expect(result).toEqual([{ _id: '1', name: 'Index Screen Data', image: '', brand: '', averageRating: 0 }]);
        expect(perfumeRepository.getIndexScreen).toHaveBeenCalled();
    });

    it('should return best perfume data', async () => {
        perfumeRepository.getBestPerfume.mockResolvedValue([{ _id: '1', name: 'Best Perfume', image: '', brand: '', averageRating: 0 }] as GetPerfumeIndexScreenDto[]);
        const result = await perfumeUseCase.getBestPerfume();
        expect(result).toEqual([{ _id: '1', name: 'Best Perfume', image: '', brand: '', averageRating: 0 }]);
        expect(perfumeRepository.getBestPerfume).toHaveBeenCalled();
    });
});