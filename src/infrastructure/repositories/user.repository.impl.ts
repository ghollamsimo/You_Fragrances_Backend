import {UserInterface} from '../../core/interfaces/user.interface';
import {Injectable} from '@nestjs/common';
import {User} from '../../core/entities/user.entity';
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {User as UserDocument} from '../db/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserRepositoryImpl implements UserInterface {
    constructor(@InjectModel(UserDocument.name) private userModel: Model<UserDocument>) {}

    index(user: User): User {
        const users = this.userModel.find();
        if (!users) return null;
        return new User(user.name, user.email, user.password, user.gender, user.phone);
    }

    async store(user: User): Promise<User> {
        const saltRounds = 10;
        user.password = await bcrypt.hash(user.password, saltRounds);
        const newUser = new this.userModel(user);
        const savedUser = await newUser.save();
        return new User(
            savedUser._id,
            savedUser.name,
            savedUser.email,
            savedUser.password,
            savedUser.phone,
        );
    }
}
