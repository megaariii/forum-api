const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../../Domains/likes/LikeRepository');
const AddLikeUseCase = require('../AddLikeUseCase');

describe('AddLikeUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add like action correctly when comment are not liked', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-123',
      owner: 'user-123',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn(() =>
      Promise.resolve()
    );
    mockCommentRepository.verifyCommentAvailability = jest.fn(() =>
      Promise.resolve()
    );
    mockLikeRepository.verifyCommentHasBeenLiked = jest.fn(() =>
      Promise.resolve(-1)
    );
    mockLikeRepository.addLike = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const addLikeUseCase = new AddLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await addLikeUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalled();
    expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith(
      useCasePayload.commentId
    );
    expect(mockLikeRepository.verifyCommentHasBeenLiked).toBeCalledWith(
      useCasePayload
    );
    expect(mockLikeRepository.addLike).toBeCalledWith(useCasePayload);
  });

  it('should orchestrating the delete like action correctly when comment are liked', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-123',
      owner: 'user-123',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn(() =>
      Promise.resolve()
    );
    mockCommentRepository.verifyCommentAvailability = jest.fn(() =>
      Promise.resolve()
    );
    mockLikeRepository.verifyCommentHasBeenLiked = jest.fn(() =>
      Promise.resolve(1)
    );
    mockLikeRepository.deleteLike = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const addLikeUseCase = new AddLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await addLikeUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalled();
    expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith(
      useCasePayload.commentId
    );
    expect(mockLikeRepository.verifyCommentHasBeenLiked).toBeCalledWith(
      useCasePayload
    );
    expect(mockLikeRepository.deleteLike).toBeCalledWith(useCasePayload);
  });
});
