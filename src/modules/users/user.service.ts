import { UserRepository } from './user.repository';
import { UpdateUserDto, UpdateProfileDto } from './user.dto';
import { UserQueryParams } from './user.types';
import { IUser } from './user.interface';
import { ApiError } from '../../utils/ApiError';
import { comparePassword, hashPassword } from '../../utils/hash';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getUserById(id: string): Promise<IUser> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user;
  }

  async getAllUsers(query: UserQueryParams): Promise<{ data: IUser[]; total: number }> {
    return this.userRepository.findAll(query);
  }

  async updateProfile(id: string, data: UpdateProfileDto): Promise<IUser> {
    const user = await this.getUserById(id);

    if (data.email && data.email !== user.email) {
      const emailExists = await this.userRepository.findByEmail(data.email);
      if (emailExists) {
        throw new ApiError(409, 'Email already in use');
      }
    }

    return this.userRepository.update(id, data);
  }

  async changePassword(id: string, data: any): Promise<void> {
    const user = await this.getUserById(id);

    const isMatch = await comparePassword(data.currentPassword, user.password as string);
    if (!isMatch) {
      throw new ApiError(400, 'Current password is incorrect');
    }

    const hashedPassword = await hashPassword(data.newPassword);
    await this.userRepository.update(id, { password: hashedPassword });
  }

  async adminUpdateUser(id: string, data: UpdateUserDto): Promise<IUser> {
    const user = await this.getUserById(id);

    if (data.email && data.email !== user.email) {
      const emailExists = await this.userRepository.findByEmail(data.email);
      if (emailExists) {
        throw new ApiError(409, 'Email already in use');
      }
    }

    return this.userRepository.update(id, data);
  }

  async deleteUser(id: string): Promise<IUser> {
    await this.getUserById(id);
    return this.userRepository.delete(id);
  }
}
