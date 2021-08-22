import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '../users.service';
import { User } from '../../../models/user.entity';
import { userStub } from './stubs/user.stub';
import { UserRepositoryMock } from '../__mocks__/user-repository.mock';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: UserRepositoryMock,
        },
      ],
    }).compile();

    service = await module.resolve<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get user', async () => {
    expect(await service.getById(1)).toEqual(userStub());
  });

  it('should inactivate user', async () => {
    jest.spyOn(service, 'inactivateByStatus').mockImplementation(() => {
      const user = userStub();
      user.status = 'Inactive';
      return user;
    });
    const acceptableUser = userStub();
    acceptableUser.status = 'Inactive';

    expect(await service.inactivate(1)).toEqual(acceptableUser);
  });
});
