import { ReviewDto } from "../dto/review.dto";
import { ReviewEntity } from "../entities/review.entity";

export interface ReviewInterface {
    store(reviewDto: ReviewDto): Promise<ReviewEntity>
    delete(id: string): Promise<{message: string}>
    update(id: string, reviewDto: ReviewDto): Promise<{message: string}>
    index();
    show(id: string)
    getReviewsByPerfume(perfumeId: string)
    getReviewsByUser(userId: string)
}