class AddLikeUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute({ threadId, commentId, owner }) {
    await this._threadRepository.verifyThreadAvailability(threadId);
    await this._commentRepository.verifyCommentAvailability(commentId);
    const isLiked = await this._likeRepository.verifyCommentHasBeenLiked({
      commentId,
      owner,
    });
    if (isLiked === -1) {
      await this._likeRepository.addLike({ commentId, owner });
    } else {
      await this._likeRepository.deleteLike({ commentId, owner });
    }
  }
}

module.exports = AddLikeUseCase;
