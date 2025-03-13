import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ReviewDto } from "src/core/dto/review.dto";
import { ReviewEntity } from "src/core/entities/review.entity";
import { ReviewInterface } from "src/core/interfaces/review.interface";
import { Review as ReviewDocument } from "../db/schemas/review.schema";
import { Model } from "mongoose";

@Injectable()
export class ReviewRepositoryImpl implements ReviewInterface {

    constructor(@InjectModel(ReviewDocument.name) private readonly reviewModel: Model<ReviewDocument>) {}

    async store(reviewDto: ReviewDto): Promise<ReviewEntity> {
        const newReview = new this.reviewModel(reviewDto);
        await newReview.save();
        return new ReviewEntity(newReview.user, newReview.perfume, newReview.rating, newReview.comment, newReview.recommended);
    }

    async index(): Promise<ReviewEntity[]> {
        const reviews = await this.reviewModel.find().populate("user", "name").populate("perfume", "name image");
        return reviews.map(review => new ReviewEntity(review.user, review.perfume, review.rating, review.comment, review.recommended));
    }

    async show(id: string): Promise<ReviewEntity> {
        const review = await this.reviewModel.findById(id).populate("user", "name").populate("perfume", "name image");
        if (!review) throw new NotFoundException("Review not found");
        return new ReviewEntity(review.user, review.perfume, review.rating, review.comment, review.recommended);
    }

    async update(id: string, reviewDto: ReviewDto): Promise<{ message: string }> {
        const updatedReview = await this.reviewModel.findByIdAndUpdate(id, reviewDto, { new: true });
        if (!updatedReview) throw new NotFoundException("Review not found");
        return { message: "Review updated successfully" };
    }

    async delete(id: string): Promise<{ message: string }> {
        const deletedReview = await this.reviewModel.findByIdAndDelete(id);
        if (!deletedReview) throw new NotFoundException("Review not found");
        return { message: "Review deleted successfully" };
    }

    async getReviewsByPerfume(perfumeId: string): Promise<ReviewEntity[]> {
        const reviews = await this.reviewModel.find({ perfume: perfumeId }).populate("user", "name").populate("perfume", "name image");
        return reviews.map(review => new ReviewEntity(review.user, review.perfume, review.rating, review.comment, review.recommended));
    }

    async getReviewsByUser(userId: string): Promise<ReviewEntity[]> {
        const reviews = await this.reviewModel.find({ user: userId }).populate("perfume", "name image").populate("perfume", "name image");
        return reviews.map(review => new ReviewEntity(review.user, review.perfume, review.rating, review.comment, review.recommended));
    }
}
