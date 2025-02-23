import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards, Request } from "@nestjs/common";
import { ReviewUseCase } from "src/application/usecases/review.usescase";
import { ReviewDto } from "src/core/dto/review.dto";
import { JwtAuthGuard } from "src/guard/guard";


@Controller("reviews")
export class ReviewController {
    constructor(private readonly reviewUseCase: ReviewUseCase) {}

    @UseGuards(JwtAuthGuard)
    @Post('store/:perfumeId') 
    async createReview(
      @Request() req, 
      @Body() reviewDto: ReviewDto, 
      @Param('perfumeId') perfumeId: string
    ) {
        const userId = req.user.id;  
        return this.reviewUseCase.createReview({ ...reviewDto, user: userId, perfume: perfumeId });
    }
    

    @Get()
    async getAllReviews() {
        return this.reviewUseCase.getAllReviews();
    }

    @Get(":id")
    async getReviewById(@Param("id") id: string) {
        return this.reviewUseCase.getReviewById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(":id")
    async updateReview(@Request() req, @Param("id") id: string, @Body() reviewDto: ReviewDto) {
        const userId = req.user.id;
        return this.reviewUseCase.updateReview(id, userId, reviewDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(":id")
    async deleteReview(@Request() req, @Param("id") id: string) {
        const userId = req.user.id;
        return this.reviewUseCase.deleteReview(id, userId);
    }

    @Get("/perfume/:perfumeId")
    async getReviewsByPerfume(@Param("perfumeId") perfumeId: string) {
        return this.reviewUseCase.getReviewsByPerfume(perfumeId);
    }

    @UseGuards(JwtAuthGuard)
    @Get("/user")
    async getReviewsByUser(@Request() req) {
        const userId = req.user.id;
        return this.reviewUseCase.getReviewsByUser(userId);
    }
}
