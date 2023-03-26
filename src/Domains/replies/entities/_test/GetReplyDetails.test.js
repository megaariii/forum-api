const GetReplyDetails = require('../GetReplyDetails');

describe('a GetReplyDetails entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'dicoding',
      date: '01032023',
    };

    // Action and Assert
    expect(() => new GetReplyDetails(payload)).toThrowError(
      'REPLY_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'dicoding',
      date: '01032023',
      content: 123,
      isDelete: 'false',
    };

    // Action and Assert
    expect(() => new GetReplyDetails(payload)).toThrowError(
      'REPLY_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should return content value properly without change the value when isDelete false', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'dicoding',
      content: 'Content',
      date: '01032023',
      isDelete: false,
    };

    const expected = {
      id: payload.id,
      username: payload.username,
      content: payload.content,
      date: payload.date,
    };
    // Action
    const getReplyDetails = new GetReplyDetails(payload);
    // Assert
    expect(getReplyDetails).toEqual(expected);
  });

  it('should return **balasan telah dihapus** when isDelete true', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'dicoding',
      content: 'Content',
      date: '01032023',
      isDelete: true,
    };

    const expected = {
      id: payload.id,
      username: payload.username,
      content: '**balasan telah dihapus**',
      date: payload.date,
    };
    // Action
    const getReplyDetails = new GetReplyDetails(payload);
    // Assert
    expect(getReplyDetails).toEqual(expected);
  });
});
