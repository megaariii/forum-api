const GetThreadDetails = require('../../../../Domains/threads/entities/GetThreadDetails');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const GetThreadDetailsUseCase = require('../GetThreadDetailsUseCase');

describe('GetThreadDetailsUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const mockThreadDetails = new GetThreadDetails({
      id: 'thread-123',
      title: 'Title',
      body: 'Body',
      date: '01032023',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          username: 'dicoding',
          date: '01032023',
          replies: [
            {
              id: 'reply-123',
              username: 'dicoding',
              date: '01032023',
              content: 'Content',
            },
          ],
          content: 'Content',
        },
      ],
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadDetails = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThreadDetails));
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThreadDetails.comments));
    mockReplyRepository.getRepliesByCommentId = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(mockThreadDetails.comments[0].replies)
      );

    /** creating use case instance */
    const getThreadDetailsUseCase = new GetThreadDetailsUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const getThreadDetails = await getThreadDetailsUseCase.execute(
      mockThreadDetails.id
    );

    // Assert
    expect(getThreadDetails).toStrictEqual(mockThreadDetails);
  });
});
