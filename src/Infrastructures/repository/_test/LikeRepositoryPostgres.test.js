const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');

describe('LikeRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await LikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyCommentHasBeenLiked function', () => {
    it('should return 1 if liked are available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await LikesTableTestHelper.addLike({});

      const payload = {
        commentId: 'comment-123',
        owner: 'user-123',
      };

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const isAvailable =
        await likeRepositoryPostgres.verifyCommentHasBeenLiked(payload);

      // Assert
      expect(isAvailable).toStrictEqual(1);
    });

    it('should return -1 if liked are not available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const payload = {
        commentId: 'comment-123',
        owner: 'user-123',
      };

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const isAvailable =
        await likeRepositoryPostgres.verifyCommentHasBeenLiked(payload);

      // Assert
      expect(isAvailable).toStrictEqual(-1);
    });
  });

  describe('addLike function', () => {
    it('should persist add like correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const payload = {
        commentId: 'comment-123',
        owner: 'user-123',
      };

      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await likeRepositoryPostgres.addLike(payload);

      // Assert
      const like = await LikesTableTestHelper.getLikeDetail('like-123');
      expect(like).toHaveLength(1);
      expect(like[0]['comment_id']).toEqual(payload.commentId);
    });
  });

  describe('deleteLike', () => {
    it('should delete like from database', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await LikesTableTestHelper.addLike({});

      const payload = {
        commentId: 'comment-123',
        owner: 'user-123',
      };

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      await likeRepositoryPostgres.deleteLike(payload);

      // Assert
      const like = await LikesTableTestHelper.getLikeDetail('like-123');
      expect(like).toHaveLength(0);
    });
  });

  describe('Get likes count Function', () => {
    it('should persist get likes correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await LikesTableTestHelper.addLike({});

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      // Action

      const like = await likeRepositoryPostgres.getLikes(['comment-123']);
      // Assert

      expect(like).toEqual([
        {
          id: 'like-123',
          comment_id: 'comment-123',
          owner: 'user-123',
        },
      ]);
    });
  });
});
