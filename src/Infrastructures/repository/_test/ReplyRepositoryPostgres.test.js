const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist create reply and should return added reply correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const addReply = new AddReply({
        threadId: 'thread-123',
        commentId: 'comment-123',
        content: 'Content',
        owner: 'user-123',
        date: '01032023',
      });

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(addReply);

      // Assert
      expect(addedReply).toStrictEqual(
        new AddedReply({
          id: 'reply-123',
          content: 'Content',
          owner: 'user-123',
        })
      );
    });

    it('should persist add thread', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const addReply = new AddReply({
        threadId: 'thread-123',
        commentId: 'comment-123',
        content: 'Content',
        owner: 'user-123',
        date: '01032023',
      });

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await replyRepositoryPostgres.addReply(addReply);

      // Assert
      const reply = await RepliesTableTestHelper.getReplyDetail('reply-123');
      expect(reply).toHaveLength(1);
    });
  });

  describe('checkOwnerOfReply function', () => {
    it('should return NotFound Error when using invalid body', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(
        replyRepositoryPostgres.checkOwnerOfReply({})
      ).rejects.toThrow(NotFoundError);
    });

    it('should return Authorization Error when is not owner', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});

      const payload = {
        owner: 'Not Owner',
        replyId: 'reply-123',
        commentId: 'comment-123',
      };

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(
        replyRepositoryPostgres.checkOwnerOfReply(payload)
      ).rejects.toThrow(AuthorizationError);
    });

    it('should persist verify owner of reply correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      const spyVerifyOwnerReply = jest.spyOn(
        replyRepositoryPostgres,
        'checkOwnerOfReply'
      );

      const payload = {
        owner: 'user-123',
        replyId: 'reply-123',
        commentId: 'comment-123',
      };

      // Action
      await replyRepositoryPostgres.checkOwnerOfReply(payload);

      // Assert
      expect(spyVerifyOwnerReply).toBeCalledWith(payload);
      expect(spyVerifyOwnerReply).toBeCalledTimes(1);
    });
  });

  describe('deleteReply function', () => {
    it('should persist delete reply correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});

      const payload = {
        owner: 'user-123',
        replyId: 'reply-123',
        commentId: 'comment-123',
      };

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      await replyRepositoryPostgres.checkOwnerOfReply(payload);
      await replyRepositoryPostgres.deleteReply(payload);
      const deletedReply = await RepliesTableTestHelper.getReply(payload);

      // Assert
      expect(deletedReply).toHaveProperty('is_delete');
      expect(deletedReply.is_delete).toEqual(true);
    });
  });

  describe('getRepliesByCommentId function', () => {
    it('should persist get replies by commentId correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const date = new Date().toISOString();
      await RepliesTableTestHelper.addReply({ date, is_delete: true });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const repliesByCommentId =
        await replyRepositoryPostgres.getRepliesByCommentId(['comment-123']);

      // Assert
      expect({ ...repliesByCommentId[0] }).toStrictEqual({
        id: 'reply-123',
        comment_id: 'comment-123',
        content: '**balasan telah dihapus**',
        username: 'dicoding',
        date,
      });
    });
  });
});
