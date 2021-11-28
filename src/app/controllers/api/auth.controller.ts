import { Context, hashPassword, HttpResponseForbidden, HttpResponseNoContent, HttpResponseOK, HttpResponseUnauthorized, Post, Session, ValidateBody, verifyPassword } from '@foal/core';
import { User, Progress, Activity } from '../../entities';

const credentialsSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email', maxLength: 255 },
    password: { type: 'string' }
  },
  required: [ 'email', 'password' ],
  additionalProperties: false,
};

const registrationSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email', maxLength: 255 },
    password: { type: 'string' },
    preferred_name: { type: 'string' },
    partner_name: { type: 'string' },
    relationship_start_date: { type: 'string' }
  },
  required: [ 'email', 'password', 'preferred_name', 'partner_name', 'relationship_start_date' ],
  additionalProperties: false,
};

async function populateInitialActivities(user: User) {
  /***
   * All newly-signed-up users get a set of activities.
   * TODO: Refactor this into a hook.
   */
    let queryBuilder = Activity.createQueryBuilder('activity');
    const activities = await queryBuilder.getMany();

    for (let i = 0; i < activities.length; i++) {
        const new_user_activity = new Progress()
        new_user_activity.user = user;
        new_user_activity.activity = activities[i];
        new_user_activity.date_of_completion = new Date('2000-01-01');
        new_user_activity.status = 'incompleted';

        await new_user_activity.save();
    }
}

export class AuthController {

  @Post('/login')
  @ValidateBody(credentialsSchema)
  async login(ctx: Context<User|undefined, Session>) {
    const email = ctx.request.body.email;
    const password = ctx.request.body.password;

    const user = await User.findOne({ email });
    if (!user) {
      return new HttpResponseUnauthorized();
    }

    if (!(await verifyPassword(password, user.password))) {
      return new HttpResponseUnauthorized();
    }

    ctx.session.setUser(user);
    ctx.user = user;

    return new HttpResponseOK({
      id: user.id,
      name: user.preferred_name,
    });
  }

  @Post('/logout')
  async logout(ctx: Context<User|undefined, Session>) {
    await ctx.session.destroy();
    return new HttpResponseNoContent();
  }

  @Post('/signup')
  @ValidateBody(registrationSchema)
  async signup(ctx: Context<User|undefined, Session>) {

    const email = ctx.request.body.email;
    const password = ctx.request.body.password;
    const preferred_name = ctx.request.body.preferred_name;
    const partner_name = ctx.request.body.partner_name;
    const relationship_start_date = ctx.request.body.relationship_start_date;

    const user = new User();
    user.email = email;
    user.password = await hashPassword(password);
    user.preferred_name = preferred_name;
    user.partner_name = partner_name;
    user.relationship_start_date = new Date(relationship_start_date)

    try {
      await user.save();
    }
    catch (err) {
      return new HttpResponseForbidden("An account with this email already exists!");
    }

    populateInitialActivities(user);

    ctx.session.setUser(user);
    ctx.user = user;

    return new HttpResponseOK({
      id: user.id,
      name: user.preferred_name,
    });
  }

}
