import { User } from './user.entity';

describe('User EntitySchema', () => {
  it('should be defined with correct table and properties', () => {
    expect(User).toBeDefined();
    expect(User.meta.tableName).toBe('users');
    expect(User.meta.properties.id).toBeDefined();
    expect(User.meta.properties.firstName).toBeDefined();
    expect(User.meta.properties.lastName).toBeDefined();
    expect(User.meta.properties.googleId).toBeDefined();
    expect(User.meta.properties.emailId).toBeDefined();
    expect(User.meta.properties.createdAt).toBeDefined();
    expect(User.meta.properties.updatedAt).toBeDefined();
    expect(User.meta.properties.deletedAt).toBeDefined();
  });

  it('should be a dumb schema without ORM lifecycle hooks', () => {
    expect(User.meta.properties.createdAt).toBeDefined();
    expect(User.meta.properties.updatedAt).toBeDefined();
    expect(User.meta.properties.deletedAt).toBeDefined();
    expect(User.meta.properties.createdAt.onCreate).toBeUndefined();
    expect(User.meta.properties.updatedAt.onCreate).toBeUndefined();
    expect(User.meta.properties.updatedAt.onUpdate).toBeUndefined();
    expect(User.meta.properties.deletedAt.nullable).toBe(true);
  });
});
