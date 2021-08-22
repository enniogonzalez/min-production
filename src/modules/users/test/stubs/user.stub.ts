import { User } from '../../../../models/user.entity';

export const userStub = (): User => {
  return {
    id: 1,
    firstName: 'Ennio',
    lastName: 'Gonzalez',
    email: 'mr.ennio@gmail.com',
    status: 'Active',
    phone: '+1 1111111111',
  };
};
