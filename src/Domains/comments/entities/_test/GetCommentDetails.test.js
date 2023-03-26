const GetCommentDetails = require('../GetCommentDetails');

describe('a GetCommentDetails entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '01032023',
    };

    // Action and Assert
    expect(() => new GetCommentDetails(payload)).toThrowError(
      'COMMENT_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '01032023',
      content: 123,
      isDelete: 'false',
      replies: [],
    };

    // Action and Assert
    expect(() => new GetCommentDetails(payload)).toThrowError(
      'COMMENT_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should return **komentar telah dihapus** when isDelete true', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      content: 'Content',
      date: '01032023',
      isDelete: true,
      replies: [],
    };
    const expected = {
      id: payload.id,
      username: payload.username,
      date: payload.date,
      replies: payload.replies,
      content: '**komentar telah dihapus**',
    };
    // Action
    const getCommentDetails = new GetCommentDetails(payload);
    // Assert
    expect(getCommentDetails).toEqual(expected);
  });
});
