const AddThread = require('../AddThread');

describe('a AddThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'abc',
      body: 'abc',
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError(
      'ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 123,
      body: true,
      owner: 'abc',
      date: '2023',
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError(
      'ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should throw error when owner contains more than 50 character', () => {
    // Arrange
    const payload = {
      title: 'Dicoding',
      body: 'Body',
      owner: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
      date: '01032023',
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError(
      'ADD_THREAD.OWNER_LIMIT_CHAR'
    );
  });

  it('should create AddThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'Tutle',
      body: 'Body',
      owner: 'Owner',
      date: '01032023',
    };

    // Action
    const { title, body, owner, date } = new AddThread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(owner).toEqual(payload.owner);
    expect(date).toEqual(payload.date);
  });
});
