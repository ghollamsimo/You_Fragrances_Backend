import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../interface/http/user.controller';
import { UserUseCase } from '../application/usecases/user.usecase';
import { User } from '../core/entities/user.entity';

describe('UserController', () => {
    let userController: UserController;
    let userUseCase: UserUseCase;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                {
                    provide: UserUseCase,
                    useValue: {
                        execute: jest.fn(),
                    },
                },
            ],
        }).compile();

        userController = module.get<UserController>(UserController);
        userUseCase = module.get<UserUseCase>(UserUseCase);
    });

    describe('store', () => {
        it('should call UserUseCase.execute with correct data and return a User object', async () => {
            const userDto = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                gender: 'male',
                phone: 123456789,
            };

            const createdUser = new User(
                'Test User',
                'test@example.com',
                'hashedpassword123',
                'male',
                123456789,
            );

            jest.spyOn(userUseCase, 'execute').mockResolvedValue(createdUser);

            const result = await userController.store(userDto);
            expect(userUseCase.execute).toHaveBeenCalledWith(
                userDto.name,
                userDto.email,
                userDto.password,
                userDto.gender,
                userDto.phone,
            );


            expect(result).toEqual(createdUser);
        });
    });
});
