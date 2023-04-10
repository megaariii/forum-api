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

  describe('Update Like function', () => {
    it('should persist add like when comment not liked correctly', async () => {
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
      const spyVerifyCommentHasBeenLiked = jest.spyOn(
        likeRepositoryPostgres,
        'verifyCommentHasBeenLiked'
      );
      const spyAddLike = jest.spyOn(likeRepositoryPostgres, 'addLike');

      // Action
      await likeRepositoryPostgres.verifyCommentHasBeenLiked(payload);
      await likeRepositoryPostgres.addLike(payload);

      // Assert
      expect(spyVerifyCommentHasBeenLiked).toBeCalledWith(payload);
      expect(spyAddLike).toBeCalledWith(payload);
    });

    it('should persist add like when comment has been liked correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await LikesTableTestHelper.addLike({});

      const payload = {
        commentId: 'comment-123',
        owner: 'user-123',
      };

      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      const spyVerifyCommentHasBeenLiked = jest.spyOn(
        likeRepositoryPostgres,
        'verifyCommentHasBeenLiked'
      );
      const spyDeleteLike = jest.spyOn(likeRepositoryPostgres, 'deleteLike');

      // Action
      await likeRepositoryPostgres.verifyCommentHasBeenLiked(payload);
      await likeRepositoryPostgres.deleteLike(payload);

      // Assert
      expect(spyVerifyCommentHasBeenLiked).toBeCalledWith(payload);
      expect(spyDeleteLike).toBeCalledWith(payload);
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
