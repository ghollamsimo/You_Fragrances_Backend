import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { Brand as BrandDocument } from "../db/schemas/brand.schema";
import { Model } from "mongoose";
import { BrandInterface } from "src/core/interfaces/brand.interface";
import { BrandEntity } from "src/core/entities/brand.entity";
import { BrandDTO } from "src/core/dto/brand.dto";

@Injectable()
export class BrandRepositoryImpl implements BrandInterface {
  constructor(@InjectModel(BrandDocument.name) private readonly brandModel: Model<BrandDocument>) {}

  async store(brandDTO: BrandDTO): Promise<BrandEntity> {
    const createdBrand = new this.brandModel(brandDTO);
    const savedBrand = await createdBrand.save();
    return new BrandEntity(savedBrand.name, savedBrand.image, savedBrand.description, savedBrand.type);
  }

  async delete(id: string): Promise<{ message: string }> {
    const deletedBrand = await this.brandModel.findByIdAndDelete(id);
    if (!deletedBrand) {
      throw new NotFoundException('Brand not found');
    }
    return { message: 'Brand deleted successfully' };
  }

  async update(id: string, brandDTO: BrandDTO): Promise<{ message: string }> {
    const updatedBrand = await this.brandModel.findByIdAndUpdate(id, brandDTO, { new: true });
    if (!updatedBrand) {
      throw new NotFoundException('Brand not found');
    }
    return { message: 'Brand updated successfully' };
  }

  async index() {
    return this.brandModel.find().exec();
  }

  async show(id: string) {
    const brand = await this.brandModel.findById(id);
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    return brand
  }
}
