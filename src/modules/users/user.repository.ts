import { prisma } from '../../config/database';
import { IUser } from './user.interface';
import { UpdateUserDto } from './user.dto';
import { UserQueryParams } from './user.types';
import { getPaginationOptions } from '../../utils/pagination';
import { Prisma } from '@prisma/client';

export class UserRepository {
  async create(data: any): Promise<IUser> {
    return prisma.user.create({
      data,
    });
  }

  async findById(id: string): Promise<IUser | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findByVerificationToken(token: string): Promise<IUser | null> {
    return prisma.user.findFirst({
      where: { verificationToken: token },
    });
  }

  async findByResetToken(token: string): Promise<IUser | null> {
    return prisma.user.findFirst({
      where: { resetPasswordToken: token },
    });
  }

  async findAll(query: UserQueryParams): Promise<{ data: IUser[]; total: number }> {
    const { skip, take, orderBy } = getPaginationOptions(query);

    const where: Prisma.UserWhereInput = {};

    if (query.role) {
      where.role = query.role;
    }
    if (query.isVerified !== undefined) {
      where.isVerified = String(query.isVerified) === 'true';
    }
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy,
      }),
      prisma.user.count({ where }),
    ]);

    return { data, total };
  }

  async update(id: string, data: UpdateUserDto | any): Promise<IUser> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<IUser> {
    return prisma.user.delete({
      where: { id },
    });
  }
}
