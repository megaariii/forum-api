const AddReply = require('../../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute({ threadId, commentId, content, owner, date }) {
    const useCasePayload = new AddReply({
      threadId,
      commentId,
      content,
      owner,
      date,
    });

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
