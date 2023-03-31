const GetThreadDetails = require('../GetThreadDetails');

describe('a GetThreadDetails entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Title',
      body: 'Body',
      date: '01032023',
    };

    // Action and Assert
    expect(() => new GetThreadDetails(payload)).toThrowError(
      'THREAD_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Title',
      body: true,
      date: '01032023',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          username: 'dicoding',
          date: '01032023',
          replies: [],
          content: 'Content',
        },
      ],
    };

    // Action and Assert
    expect(() => new GetThreadDetails(payload)).toThrowError(
      'THREAD_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should get ThreadDetails object correctly', () => {
    // Arrange

    const payload = {
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
    };

    // Action
    const getThreadDetails = new GetThreadDetails(payload);
    // Assert
    expect(getThreadDetails).toEqual(payload);
  });
});
