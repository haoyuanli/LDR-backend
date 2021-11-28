import { Context, controller, Get, HttpResponseOK, UseSessions } from '@foal/core';
import { ActivitiesController, AuthController, ProfileController, ProgressController } from './api';
import { fetchUser } from '@foal/typeorm';
import { User } from '../entities';
import { Activity } from '../entities';

@UseSessions({
  cookie: true,
  user: fetchUser(User),
  userCookie: (ctx: Context<User|undefined>) => ctx.user ? JSON.stringify({ id: ctx.user.id, name: ctx.user.preferred_name }) : '',
})


export class ApiController {
  subControllers = [
    controller('/activities', ActivitiesController),
    controller('/progress', ProgressController),
    controller('/auth', AuthController),
    controller('/profile', ProfileController)
  ];


  @Get('/')
  index(ctx: Context) {
    return new HttpResponseOK('Hello world!');
  }

}
