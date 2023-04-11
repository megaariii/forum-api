const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist create thread and should return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'user-123' });
      const addThread = new AddThread({
        title: 'Title',
        body: 'dicoding',
        owner: 'user-123',
        date: '01032023',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(addThread);

      // Assert
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: 'thread-123',
          title: 'Title',
          owner: 'user-123',
        })
      );
    });

    it('should persist add thread', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      const addThread = new AddThread({
        title: 'Title',
        body: 'dicoding',
        owner: 'user-123',
        date: '01032023',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await threadRepositoryPostgres.addThread(addThread);

      // Assert
      const thread = await ThreadsTableTestHelper.getThreadDetail('thread-123');
      expect(thread).toHaveLength(1);
    });
  });

  describe('getDetailsThreadById function', () => {
    it('should throw error when using invalid threadId', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(
        threadRepositoryPostgres.getThreadDetails('wrong-id')
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError if thread available', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyThreadAvailability('thread-123')
      ).resolves.not.toThrow(NotFoundError);
    });

    it('should persist get detail by threadId correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      const date = new Date().toISOString();
      await ThreadsTableTestHelper.addThread({ date });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const threadDetail = await threadRepositoryPostgres.getThreadDetails(
        'thread-123'
      );

      // Assert
      expect(threadDetail).toStrictEqual({
        id: 'thread-123',
        title: 'Thread',
        body: 'Sebuah Thread',
        owner: 'user-123',
        date,
        username: 'dicoding',
      });
    });
  });

  describe('verifyThreadAvailability function', () => {
    it('should throw error when using invalid threadId', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(
        threadRepositoryPostgres.verifyThreadAvailability('wrong-id')
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError if thread available', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyThreadAvailability('thread-123')
      ).resolves.not.toThrow(NotFoundError);
    });
  });
});
