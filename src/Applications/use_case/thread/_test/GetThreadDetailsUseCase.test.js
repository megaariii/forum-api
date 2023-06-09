const GetThreadDetails = require('../../../../Domains/threads/entities/GetThreadDetails');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const LikeRepository = require('../../../../Domains/likes/LikeRepository');
const GetThreadDetailsUseCase = require('../GetThreadDetailsUseCase');

describe('GetThreadDetailsUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const expectedThreadDetails = new GetThreadDetails({
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
          content: 'Content',
          likeCount: 1,
          replies: [
            {
              id: 'reply-123',
              username: 'dicoding',
              content: 'Content',
              date: '01032023',
            },
          ],
        },
      ],
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadDetails = jest.fn(() =>
      Promise.resolve({
        id: 'thread-123',
        title: 'Title',
        body: 'Body',
        owner: 'user-123',
        date: '01032023',
        username: 'dicoding',
      })
    );

    mockCommentRepository.getCommentsByThreadId = jest.fn(() =>
      Promise.resolve([
        {
          id: 'comment-123',
          username: 'dicoding',
          content: 'Content',
          date: '01032023',
          replies: [],
        },
      ])
    );

    mockReplyRepository.getRepliesByCommentId = jest.fn(() =>
      Promise.resolve([
        {
          id: 'reply-123',
          comment_id: 'comment-123',
          username: 'dicoding',
          content: 'Content',
          date: '01032023',
        },
      ])
    );

    mockLikeRepository.getLikes = jest.fn(() =>
      Promise.resolve([
        { id: 'like-123', comment_id: 'comment-123', owner: 'user-123' },
      ])
    );

    /** creating use case instance */
    const getThreadDetailsUseCase = new GetThreadDetailsUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    const getThreadDetails = await getThreadDetailsUseCase.execute(
      expectedThreadDetails.id
    );

    // Assert
    expect(getThreadDetails).toStrictEqual(expectedThreadDetails);
    expect(mockThreadRepository.getThreadDetails).toBeCalledWith(
      expectedThreadDetails.id
    );
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      expectedThreadDetails.id
    );
    expect(mockReplyRepository.getRepliesByCommentId).toBeCalledWith([
      expectedThreadDetails.comments[0].id,
    ]);
    expect(mockLikeRepository.getLikes).toBeCalledWith([
      expectedThreadDetails.comments[0].id,
    ]);
  });
});
