const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      owner: 'user-123',
      replyId: 'reply-123',
      commentId: 'comment-123',
    };

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockReplyRepository.checkOwnerOfReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Action
    await deleteReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockReplyRepository.checkOwnerOfReply).toBeCalledWith(
      useCasePayload
    );
    expect(mockReplyRepository.deleteReply).toBeCalledWith(useCasePayload);
  });
});
