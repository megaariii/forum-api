const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist create comment and should return added comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      const addComment = new AddComment({
        threadId: 'thread-123',
        content: 'Content',
        owner: 'user-123',
        date: '01032023',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(
        addComment
      );

      // Assert
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: 'comment-123',
          content: 'Content',
          owner: 'user-123',
        })
      );
    });

    it('should persist add comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      const addComment = new AddComment({
        threadId: 'thread-123',
        content: 'Content',
        owner: 'user-123',
        date: '01032023',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await commentRepositoryPostgres.addComment(addComment);

      // Assert
      const comment = await CommentsTableTestHelper.getCommentDetail(
        'comment-123'
      );
      expect(comment).toHaveLength(1);
    });
  });

  describe('checkOwnerOfComment function', () => {
    it('should return NotFound Error when using invalid body', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      // Action and Assert
      await expect(
        commentRepositoryPostgres.checkOwnerOfComment({})
      ).rejects.toThrow(NotFoundError);
    });

    it('should return Authorization Error when is not owner', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const payload = {
        owner: 'Not Owner',
        commentId: 'comment-123',
        threadId: 'thread-123',
      };

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      // Action and Assert
      await expect(
        commentRepositoryPostgres.checkOwnerOfComment(payload)
      ).rejects.toThrow(AuthorizationError);
    });

    it('should persist verify owner of comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const spyVerifyOwnerComment = jest.spyOn(
        commentRepositoryPostgres,
        'checkOwnerOfComment'
      );
      const payload = {
        owner: 'user-123',
        commentId: 'comment-123',
        threadId: 'thread-123',
      };

      // Action and Assert
      await expect(
        commentRepositoryPostgres.checkOwnerOfComment(payload)
      ).resolves.not.toThrowError();
      expect(spyVerifyOwnerComment).toBeCalledTimes(1);
    });
  });

  describe('deleteComment function', () => {
    it('should persist delete comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const payload = {
        owner: 'user-123',
        commentId: 'comment-123',
        threadId: 'thread-123',
      };

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.checkOwnerOfComment(payload);
      await commentRepositoryPostgres.deleteComment(payload);
      const deletedComment = await CommentsTableTestHelper.getComment(payload);

      // Assert
      expect(deletedComment).toHaveProperty('is_delete');
      expect(deletedComment.is_delete).toEqual(true);
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should persist get comment by threadId correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      const date = new Date().toISOString();
      await CommentsTableTestHelper.addComment({ date, is_delete: true });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const commentByThreadId =
        await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

      // Assert
      expect({ ...commentByThreadId[0] }).toStrictEqual({
        id: 'comment-123',
        content: '**komentar telah dihapus**',
        username: 'dicoding',
        date,
        replies: [],
      });
    });
  });

  describe('verifyCommentAvailability function', () => {
    it('should throw error when using invalid commentId', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(
        commentRepositoryPostgres.verifyCommentAvailability('wrong-id')
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError if comment available', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentAvailability('comment-123')
      ).resolves.not.toThrow(NotFoundError);
    });
  });
});
