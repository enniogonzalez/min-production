import { ObjectLiteral, Repository } from 'typeorm';
import { Request } from 'express';
import { CoordinateInterface } from '../interfaces/coordinate.interface';
import { StatusEnum } from '../enum/status.enum';
import { getCoordinateFromObject } from '../libs/coordinate.lib';

export class DataProvider<Entity extends ObjectLiteral> {
  constructor(
    private readonly _request: Request,
    private readonly _repository: Repository<Entity>,
  ) {}

  /**
   * Set the status of the entity as Active
   * @param {Entity} entity - entity to activate
   * @param {number} [user] - User performing the request
   * @returns {Promise<Entity>} - Activated Entity
   */
  protected async activateByStatus(
    entity: Entity,
    user?: number,
  ): Promise<Entity> {
    return this.updateEntity(entity, { status: StatusEnum.active }, user);
  }

  /**
   * Set the status of the entity as Deleted
   * @param {Entity} entity - entity to delete
   * @param {number} [user] - User performing the request
   * @returns {Promise<Entity>} - Deleted Entity
   */
  protected async deleteByStatus(
    entity: Entity,
    user?: number,
  ): Promise<Entity> {
    return this.updateEntity(entity, { status: StatusEnum.deleted }, user);
  }

  /**
   * Generate Random Code by Length
   * @param {number} length - length of the code to be generated
   * @returns {string} - Code generated
   */
  protected generateRandomCodeByLength(
    length: number,
    options?: string,
  ): string {
    let result = '';

    const characters =
      options && options.trim() !== '' ? options : process.env.ENCRYPTION_CHARS;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }

    return result;
  }

  /**
   * Set the status of the entity as Inactive
   * @param {Entity} entity - entity to inactivate
   * @param {number} [user] - User performing the request
   * @returns {Promise<Entity>} - Inactivated Entity
   */
  protected async inactivateByStatus(
    entity: Entity,
    user?: number,
  ): Promise<Entity> {
    return this.updateEntity(entity, { status: StatusEnum.inactive }, user);
  }

  /**
   * Save entity
   * @param {*} data - Data to save in database
   * @param {number} [user] - User performing the request
   * @returns {Promise<Entity>} - Entity saved
   */
  protected async save(data: any, user?: number): Promise<Entity> {
    const { ip, coordinate } = this.getIpAndCoordinate();
    if (!isNaN(+user)) {
      data.creator = +user;
    }

    const userRequest = this.getUserFromRequest();
    if (!data.creator && !isNaN(+userRequest) && userRequest) {
      data.creator = +userRequest;
    }

    data.status =
      !data.status || data.status.trim() === '' ? 'Active' : data.status.trim();
    data.creatorIp = ip;
    data.creatorCoordinate = coordinate;

    return this.cleanDataAfterSave(
      await this._repository.save(this.cleanData(data)),
    );
  }

  /**
   * Update an entity
   * @param {Entity} entity - entity in database
   * @param {*} dataToUpdate - Data to be updated
   * @param {number} [user] - User performing the request
   * @returns {Promise<Entity>} - Entity Updated
   */
  protected async updateEntity(
    entity: Entity,
    dataToUpdate: any,
    user?: number,
  ): Promise<Entity> {
    const { ip, coordinate } = this.getIpAndCoordinate();
    if (!isNaN(+user)) {
      dataToUpdate.modifier = +user;
    }

    dataToUpdate.modifierIp = ip;
    dataToUpdate.modifierCoordinate = coordinate;

    const userRequest = this.getUserFromRequest();
    if (!dataToUpdate.modifier && !isNaN(+userRequest)) {
      dataToUpdate.modifier = +userRequest;
    }

    this._repository.merge(entity, dataToUpdate);
    return this.cleanDataAfterSave(
      await this._repository.save(this.cleanData(entity)),
    );
  }

  /**
   * Clean Entity Data after saving it in the database
   * @param {Entity} entity - entity saved in database
   * @returns {Promise<Entity>} - Entity Cleaned
   */
  private cleanDataAfterSave(data: Entity): Entity {
    delete data.creator;
    delete data.creatorCoordinate;
    delete data.creatorIp;
    delete data.creationDate;
    delete data.modifier;
    delete data.modifierCoordinate;
    delete data.modifierIp;
    delete data.modificationDate;

    return data;
  }

  /**
   * Clean data to be able to save it in the database
   * @param {*} data - Data to be cleaned
   * @returns {*} - Data cleaned
   */
  private cleanData(data: any): any {
    for (const key in data) {
      if (
        data[key] &&
        typeof data[key] &&
        !isNaN(data[key]['longitude']) &&
        !isNaN(data[key]['latitude'])
      ) {
        data[key] = `${data[key]['latitude']},${data[key]['longitude']}`;
      }
    }

    return data;
  }

  /**
   * Function to get the ip from the request and the coordinate
   * from the query params
   * @returns {{ip: string, coordinate: CoordinateInterface}} - Ip and coordinate
   */
  private getIpAndCoordinate(): {
    ip: string;
    coordinate: CoordinateInterface;
  } {
    const ip: string =
      this._request.socket.remoteAddress !== ''
        ? this._request.socket.remoteAddress
        : null;

    const coordinate = getCoordinateFromObject(this._request.query);

    return { ip, coordinate };
  }

  /**
   * Get id of the user that is making the request
   * @returns {number} - Id number of the user
   */
  private getUserFromRequest(): number {
    if (this._request.user && !isNaN(+this._request.user['id'])) {
      return +this._request.user['id'];
    }

    return null;
  }
}
