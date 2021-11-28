import { Context, Delete, Get, Put, HttpResponseCreated, HttpResponseNoContent, HttpResponseNotFound, HttpResponseOK, Post, UserRequired, ValidateBody, ValidatePathParam, ValidateQueryParam, HttpResponseForbidden } from '@foal/core';
import { Progress, User } from '../../entities'
import {getConnection} from "typeorm";

export class ProgressController {

  @Get()
  @UserRequired()
  async readProgress(ctx: Context) {
    const userId = ctx.user.id as number|undefined;

    let queryBuilder = Progress
      .createQueryBuilder('progress')
      .leftJoinAndSelect('progress.user', 'user')
      .leftJoinAndSelect('progress.activity', 'activity')
      .select([
        'progress.id',
        'progress.status',
        'progress.notes',
        'progress.date_of_completion',
        'user.id',
        'user.preferred_name',
        'activity.id',
        'activity.title',
        'activity.content'
      ]);

    if (userId !== undefined) {
      queryBuilder = queryBuilder.where('user.id = :userId', { userId });
    }

    const user_activities = await queryBuilder.getMany();

    return new HttpResponseOK(user_activities);
  }


  @Post()
  @ValidateBody({
    type: 'object',
    properties: {
      activity_id: { type: 'number', maxLength: 20 },
      date_of_completion: { type: 'string', maxLength: 255 },
      status: { type: 'string', maxLength: 255}
    },
    required: [ 'activity_id', 'date_of_completion', 'status' ],
    additionalProperties: false,
  })
  @UserRequired()
  async createProgress(ctx: Context) {
    const progress = new Progress();
    progress.activity = ctx.request.body.activity_id;
    progress.status = ctx.request.body.status;
    progress.date_of_completion = ctx.request.body.date_of_completion;
    // Set the current user as the author of the activity.
    progress.user = ctx.user;
    await progress.save();

    return new HttpResponseCreated();
  }

  @Put('/:id')
  @ValidateBody({
    type: 'object',
    properties: {
      date_of_completion: { type: 'string', maxLength: 255 },
      status: { type: 'string', maxLength: 255},
      notes: { type: 'string' }
    },
    required: [ 'date_of_completion', 'status' ],
    additionalProperties: false,
  })
  @UserRequired()
  async updateProgress(ctx: Context) {
    /**
     *  Update the progress of a user's activity. 
     * */
    const status = ctx.request.body.status;
    const date_of_completion = ctx.request.body.date_of_completion;
    const notes = ctx.request.body.notes;
    const userId = ctx.user.id as number|undefined;

    let queryBuilder = Progress
    .createQueryBuilder('progress')
    .leftJoinAndSelect('progress.user', 'user')
    .select([
      'progress.id',
      'user.id'
    ])
    .where('progress.id = :id', { id: ctx.request.params.id });

    const progress_owner = await queryBuilder.getOne();

    // Only the owner of the progress can update it.
    if (progress_owner?.user.id !== userId) {
      return new HttpResponseForbidden();
    }

    await getConnection()
    .createQueryBuilder()
    .update(Progress)
    .set({ date_of_completion: date_of_completion, status: status, notes: notes })
    .where("id = :id", { id: ctx.request.params.id })
    .execute();

    return new HttpResponseOK('Successfully updated.');
  }

}
