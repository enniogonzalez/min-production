import { ForbiddenException, Inject, Injectable, Scope } from '@nestjs/common';
import { User } from '../../models/user.entity';
import { DataProvider } from '../../common/providers/data.provider';
import { getCoordinateFromDatabaseField } from '../../common/libs/coordinate.lib';
import { StatusEnum } from '../../common/enum/status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class UsersService extends DataProvider<User> {
  constructor(
    @Inject(REQUEST)
    private readonly _userRequest: Request,
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
  ) {
    super(_userRequest, _userRepository);
  }

  /**
   * Get user by id
   * @param {number} id - id of the user to be found
   * @returns {Promise<User>} - User in system
   */
  async getById(id: number): Promise<User> {
    const user = await this._userRepository
      .findOneOrFail({
        where: { id, status: Not(StatusEnum.deleted) },
      })
      .catch(() => {
        throw new ForbiddenException({
          success: false,
          message: 'You do not have permission on user.',
        });
      });

    return this.format(user);
  }

  /**
   * Inactivate user
   * @param {number} id - id of the user to be activated
   * @returns {Promise<User>} - Inactivate User
   */
  async inactivate(id: number): Promise<User> {
    return await this.inactivateByStatus(await this.getById(id));
  }

  /**
   * Format data of specific user
   * @param {User} user - user to format its data
   * @returns {User} - User Formatted
   */
  private format(user: User): User {
    if (user.coordinate) {
      user.coordinate = getCoordinateFromDatabaseField(user.coordinate);
    }

    if (user.creatorCoordinate) {
      user.creatorCoordinate = getCoordinateFromDatabaseField(
        user.creatorCoordinate,
      );
    }

    if (user.modifierCoordinate) {
      user.modifierCoordinate = getCoordinateFromDatabaseField(
        user.modifierCoordinate,
      );
    }

    delete user.password;

    return user;
  }
}
