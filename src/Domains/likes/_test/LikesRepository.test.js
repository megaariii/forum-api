const LikesRepository = require('../LikesRepository');

describe('LikesRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const likesRepository = new LikesRepository();

    // Action and Assert
    expect(likesRepository.verifyCommentHasBeenLiked({})).rejects.toThrowError(
      'LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
    expect(likesRepository.postLikeOnComment({})).rejects.toThrowError(
      'LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
    expect(likesRepository.deleteLikeOnComment({})).rejects.toThrowError(
      'LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
    expect(likesRepository.getLikesOnComment({})).rejects.toThrowError(
      'LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
  });
});
