import { Not, ObjectLiteral, Repository } from 'typeorm';
import { Request } from 'express';
import { DataProvider } from './data.provider';
import { StatusEnum } from '../enum/status.enum';
import { ForbiddenException } from '@nestjs/common';

export class CommerceProvider<
  Entity extends ObjectLiteral
> extends DataProvider<Entity> {
  constructor(
    private readonly _middleRequest: Request,
    private readonly _commerceSubEntityRepository: Repository<Entity>,
  ) {
    super(_middleRequest, _commerceSubEntityRepository);
  }

  /**
   * Activate commerce sub entity
   * @param {number} id - id of the commerce sub entity to be activated
   * @param {number} commerce - commerce owner of the sub entity
   * @returns {Promise<Entity>}
   */
  async activate(id: number, commerce: number): Promise<Entity> {
    return await this.activateByStatus(
      await this.getByCommerceAndId(commerce, id),
    );
  }

  /**
   * Delete commerce sub entity
   * @param {number} id - id of the commerce sub entity to be deleted
   * @param {number} commerce - commerce owner of the sub entity
   */
  async delete(id: number, commerce: number) {
    await this.deleteByStatus(await this.getByCommerceAndId(commerce, id));
  }

  /**
   * Inactivate commerce sub entity
   * @param {number} id - id of the commerce sub entity to be inactivated
   * @param {number} commerce - commerce owner of the sub entity
   * @returns {Promise<Entity>}
   */
  async inactivate(id: number, commerce: number): Promise<Entity> {
    return await this.inactivateByStatus(
      await this.getByCommerceAndId(commerce, id),
    );
  }

  /**
   * Get all sub-entities of a commerce in database
   * @returns {Promise<Entity[]>}
   */
  async getByCommerce(commerce: number): Promise<Entity[]> {
    return await this._commerceSubEntityRepository.find({
      where: { commerce, status: Not(StatusEnum.deleted) },
    });
  }

  /**
   * Get sub-entity by commerce and id
   * @param {number} commerce - commerce owner of the sub entity
   * @param {number} id - id of the commerce sub entity to be found
   * @returns {Promise<Entity>}
   */
  async getByCommerceAndId(commerce: number, id: number): Promise<Entity> {
    const commerceEntity = await this._commerceSubEntityRepository
      .findOneOrFail({
        where: { id, commerce, status: Not(StatusEnum.deleted) },
      })
      .catch(() => {
        throw new ForbiddenException({
          success: false,
          message: 'You do not have permission on commerce.',
        });
      });

    return commerceEntity;
  }
}
