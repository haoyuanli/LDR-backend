import { Context, Delete, Get, HttpResponseCreated, HttpResponseForbidden, HttpResponseNoContent, HttpResponseNotFound, HttpResponseOK, Post, UserRequired, ValidateBody, ValidatePathParam, ValidateQueryParam } from '@foal/core';
import { Activity } from '../../entities';
const { Config } = require('@foal/core');

export class ActivitiesController {
  @Get()
  async readActivities(ctx: Context) {
    /***
     * Get all platform-supplied activities.
     */

    let queryBuilder = Activity.createQueryBuilder('activity');

    const activities = await queryBuilder.getMany();

    return new HttpResponseOK(activities);
  }

  @Post()
  @ValidateBody({
    type: 'object',
    properties: {
      title: { type: 'string', maxLength: 255 },
      content: { type: 'string', maxLength: 255 },
    },
    required: [ 'title', 'content' ],
    additionalProperties: false,
  })

  async createActivity(ctx: Context) {
    /***
     * Create a new platform-based activity.
     */

    // Admin only.
    if (ctx.request.header("x-ldr-key") !== Config.get('secret', '')) {
        return new HttpResponseForbidden();
    }

    const activity = new Activity();
    activity.title = ctx.request.body.title;
    activity.content = ctx.request.body.content;

    await activity.save();

    return new HttpResponseCreated();
  }

}
