import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './model/user.schema';
import { IUser } from './interfaces/user.interface';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(user: IUser): Promise<User> {
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async findByField(field: keyof User, value: string): Promise<User | null> {
    return this.userModel.findOne({ [field]: value }).exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async updateById(
    id: string,
    updateData: Partial<IUser>,
  ): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async toggleUserStatus(id: string): Promise<User | null> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    return this.userModel
      .findByIdAndUpdate(id, { isDeleted: !user.isDeleted }, { new: true })
      .exec();
  }
}
