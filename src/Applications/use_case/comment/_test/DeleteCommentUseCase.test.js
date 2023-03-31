const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-123',
      owner: 'user-123',
      threadId: 'thread-123',
    };

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.checkOwnerOfComment = jest.fn(() =>
      Promise.resolve()
    );
    mockCommentRepository.deleteComment = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const getCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await getCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.checkOwnerOfComment).toBeCalledWith(
      useCasePayload
    );
    expect(mockCommentRepository.deleteComment).toBeCalledWith(useCasePayload);
  });
});
