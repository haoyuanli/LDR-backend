import { Context, Delete, Get, Put, HttpResponseCreated, HttpResponseNoContent, HttpResponseNotFound, HttpResponseOK, Post, UserRequired, ValidateBody, ValidatePathParam, ValidateQueryParam } from '@foal/core';
import { Progress, User } from '../../entities'
import {getConnection} from "typeorm";

export class ProfileController {

  @Get()
  @UserRequired()
  async readProfile(ctx: Context) {
    /***
     * Get the user's profile.
     */
    const userId = ctx.user.id as number|undefined;

    let queryBuilder = User.createQueryBuilder('user')
    .select(['user.id', 'user.email', 'user.preferred_name', 'user.partner_name', 'user.relationship_start_date']);

    if (userId !== undefined) {
      queryBuilder = queryBuilder.where('user.id = :userId', { userId });
    }

    const profile = await queryBuilder.getOne();

    return new HttpResponseOK(profile);
  }

}
