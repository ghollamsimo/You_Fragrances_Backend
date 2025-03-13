import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../interface/http/user.controller';
import { UserUseCase } from '../application/usecases/user.usecase';
import { JwtService } from '@nestjs/jwt'; // Import JwtService
import { RegisterDto, Role } from '../core/dto/register.dto';
import { JwtAuthGuard } from 'src/guard/guard';

describe('UserController', () => {
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
                JwtService,  
                JwtAuthGuard,  
            ],
        }).compile();

        userUseCase = module.get<UserUseCase>(UserUseCase);
    });

    it('should call the method of execute (register)', () => {
        const register = jest.spyOn(userUseCase, 'execute');
        const name = 'ghollam';
        const email = 'ghollam@gmail.com';
        const password = 'password';
        const role: Role = Role.ADMIN;
        const gender = 'male';
        const image = 'image';
        const registerDto = new RegisterDto(name, email, role, password, gender, image);
        userUseCase.execute(registerDto);
        expect(register).toHaveBeenCalledTimes(1);
        expect(register).toBeCalledWith(registerDto);
        expect(register).toReturn();
    });
});
