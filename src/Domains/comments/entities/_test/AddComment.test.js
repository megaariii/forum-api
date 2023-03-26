const AddComment = require('../AddComment');

describe('a AddComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'abc',
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError(
      'ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      content: 'Content',
      owner: ['123'],
      date: '01032023',
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError(
      'ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create AddComment object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      content: 'Content',
      owner: 'user-123',
      date: '27092000',
    };

    // Action
    const { threadId, content, owner, date } = new AddComment(payload);

    // Assert
    expect(threadId).toEqual(payload.threadId);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
    expect(date).toEqual(payload.date);
  });
});
