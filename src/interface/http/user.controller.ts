import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { UserUseCase } from "../../application/usecases/user.usecase";
import { UserEntity } from "../../core/entities/user.entity";
import { RegisterDto } from "../../core/dto/register.dto";
import { LoginDto } from "../../core/dto/login.dto";
import { JwtAuthGuard } from "src/guard/guard";


@Controller('users')
export class UserController {
    constructor(private readonly userUseCase: UserUseCase) {}

    @Post('/store')
    async store(@Body() body: RegisterDto): Promise<UserEntity> {
        return await this.userUseCase.execute(body);
    }

    @Post("login")
    async login(
      @Body() body: { email: string; password: string }
    ): Promise<{ token: string }> {
      const loginDto = new LoginDto(body.email, body.password);
      return this.userUseCase.login(loginDto);
    }
  
    @Get('/index')
    async index(){
      const users = this.userUseCase.index()
      return users
    } 

    @Delete('/delete/:id')
    async delete(@Param('id') id: string){
      return await this.userUseCase.delete(id);
    }

    @Put('/update/:id')
    async update(@Param('id') id: string, @Body() body: RegisterDto){
        return await this.userUseCase.update(id, body)
    }

      @UseGuards(JwtAuthGuard)
    @Post('/followBrand/:brand_id')
    async followBrand(@Param('brand_id') brandId: string, @Req() request: Request) {
      const userId = request?.user?.id;       
      return await this.userUseCase.followBrand(userId, brandId);
    }
}
