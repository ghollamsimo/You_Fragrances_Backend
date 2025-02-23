import { Inject, Injectable, UnauthorizedException, NotFoundException } from "@nestjs/common";
import { ReviewDto } from "src/core/dto/review.dto";
import { ReviewEntity } from "src/core/entities/review.entity";
import { ReviewInterface } from "src/core/interfaces/review.interface";

@Injectable()
export class ReviewUseCase {
    constructor(@Inject('ReviewInterface') private readonly reviewRepository: ReviewInterface) {}

    async createReview(reviewDto: ReviewDto): Promise<ReviewEntity> {
        return await this.reviewRepository.store(reviewDto);
    }

    async getAllReviews(): Promise<ReviewEntity[]> {
        return await this.reviewRepository.index();
    }

 
    async getReviewById(id: string): Promise<ReviewEntity> {
        return await this.reviewRepository.show(id);
    }

    async updateReview(id: string, userId: string, reviewDto: ReviewDto): Promise<{ message: string }> {
        const review = await this.reviewRepository.show(id);
        if (!review) throw new NotFoundException("Review not found");
        if (review.user !== userId) throw new UnauthorizedException("You can only update your own review");

        return await this.reviewRepository.update(id, reviewDto);
    }

    async deleteReview(id: string, userId: string): Promise<{ message: string }> {
        const review = await this.reviewRepository.show(id);
        if (!review) throw new NotFoundException("Review not found");
        if (review.user !== userId) throw new UnauthorizedException("You can only delete your own review");

        return await this.reviewRepository.delete(id);
    }

    async getReviewsByPerfume(perfumeId: string): Promise<ReviewEntity[]> {
        return await this.reviewRepository.getReviewsByPerfume(perfumeId);
    }

    async getReviewsByUser(userId: string): Promise<ReviewEntity[]> {
        return await this.reviewRepository.getReviewsByUser(userId);
    }
}
