import { defineEntity, type InferEntity, p } from '@mikro-orm/core';

export const User = defineEntity({
  name: 'User',
  tableName: 'users',
  properties: {
    id: p.uuid().primary(),
    firstName: p.string().fieldName('first_name').length(255),
    lastName: p.string().fieldName('last_name').length(255).nullable(),
    googleId: p.string().fieldName('google_id').length(255).unique(),
    emailId: p.string().fieldName('email_id').length(255).unique(),
    createdAt: p
      .datetime()
      .fieldName('created_at')
      .columnType('timestamptz')
      .onCreate(() => new Date()),
    updatedAt: p
      .datetime()
      .fieldName('updated_at')
      .columnType('timestamptz')
      .onCreate(() => new Date())
      .onUpdate(() => new Date()),
    deletedAt: p
      .datetime()
      .fieldName('deleted_at')
      .columnType('timestamptz')
      .nullable(),
  },
});

export type IUser = InferEntity<typeof User>;
