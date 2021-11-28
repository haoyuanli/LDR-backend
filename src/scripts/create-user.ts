// 3p
import { hashPassword } from '@foal/core';
import { createConnection, getConnection } from 'typeorm';

// App
import { User } from '../app/entities';

export const schema = {
  additionalProperties: false,
  properties: {
    email: { type: 'string', format: 'email', maxLength: 255 },
    password: { type: 'string' },
    preferred_name: { type: 'string', maxLength: 255 },
    partner_name: { type: 'string', maxLength: 255 },
    relationship_start_date: { type: 'string', format: 'date' },
  },
  required: [ 'email', 'password' ],
  type: 'object',
};

export async function main(args: { email: string, password: string, preferred_name: string, partner_name: string, relationship_start_date: string }) {
  const user = new User();
  user.email = args.email;
  user.password = await hashPassword(args.password);
  user.preferred_name = args.preferred_name;
  user.partner_name = args.partner_name;
  user.relationship_start_date = new Date(args.relationship_start_date);

  await createConnection();

  try {
    console.log(await user.save());
  } catch (error: any) {
    console.log(error.message);
  } finally {
    await getConnection().close();
  }
}
