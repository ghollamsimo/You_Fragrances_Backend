import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserUseCase } from "../../application/usecases/user.usecase";
import { UserEntity } from "../../core/entities/user.entity";
import { RegisterDto } from "../../core/dto/register.dto";
import { LoginDto } from "../../core/dto/login.dto";
import { JwtAuthGuard } from "src/guard/guard";
import { FileInterceptor } from "@nestjs/platform-express";


@Controller('users')
export class UserController {
    constructor(private readonly userUseCase: UserUseCase) {}

    @Post('/store')
    @UseInterceptors(FileInterceptor('image'))
    async store(@Body() body: RegisterDto, @UploadedFile() file: Express.Multer.File): Promise<UserEntity> {
        return await this.userUseCase.execute(body, file);
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
    async followBrand(@Param('brand_id') brandId: string, @Req() request) {
      const userId = request?.user?.id;       
      return await this.userUseCase.followBrand(userId, brandId);
    }

    @Get('/count')
    async count() {
      try {
        const result = await this.userUseCase.count();
        return { success: true, data: result };
      } catch (error) {
        throw new HttpException(
          { success: false, message: error.message },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

}
