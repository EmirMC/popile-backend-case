import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/user/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDetail } from './user-detail.interface';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  public _getUserDetail(user: UserDocument): UserDetail {
    return {
      id: user._id,
      email: user.email,
      username: user.username,
    };
  }

  public async fineByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  public async create(user: CreateUserDto): Promise<UserDocument> {
    const created = new this.userModel(user);
    return created.save();
  }
}
