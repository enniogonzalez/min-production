import { User } from '../../../models/user.entity';
import { userStub } from '../test/stubs/user.stub';

export const UserRepositoryMock = {
  findOneOrFail: jest.fn(
    async (id): Promise<User> => {
      return userStub();
    },
  ),
  createQueryBuilder: jest.fn().mockReturnThis(),
  addSelect: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  getOneOrFail: jest.fn().mockResolvedValue(userStub()),
};
