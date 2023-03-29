const AddReply = require('../../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.verifyThreadAvailability(
      useCasePayload.threadId
    );
    await this._commentRepository.verifyCommentAvailability(
      useCasePayload.commentId
    );
    const newReply = new AddReply(useCasePayload);
    return this._replyRepository.addReply(newReply);
  }
}

module.exports = AddReplyUseCase;
