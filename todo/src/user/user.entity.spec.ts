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

  it('should execute onCreate and onUpdate date callbacks', () => {
    const createdAtOnCreate = User.meta.properties.createdAt.onCreate;
    const updatedAtOnCreate = User.meta.properties.updatedAt.onCreate;
    const updatedAtOnUpdate = User.meta.properties.updatedAt.onUpdate;

    expect(createdAtOnCreate).toBeDefined();
    expect(updatedAtOnCreate).toBeDefined();
    expect(updatedAtOnUpdate).toBeDefined();

    if (typeof createdAtOnCreate === 'function') {
      const date = (createdAtOnCreate as () => unknown)();
      expect(date).toBeInstanceOf(Date);
    }
    if (typeof updatedAtOnCreate === 'function') {
      const date = (updatedAtOnCreate as () => unknown)();
      expect(date).toBeInstanceOf(Date);
    }
    if (typeof updatedAtOnUpdate === 'function') {
      const date = (updatedAtOnUpdate as () => unknown)();
      expect(date).toBeInstanceOf(Date);
    }
  });
});
