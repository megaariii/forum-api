const AddComment = require('../../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute({ threadId, content, owner, date }) {
    const useCasePayload = new AddComment({
      threadId,
      content,
      owner,
      date,
    });

    await this._threadRepository.verifyThreadAvailability(
      useCasePayload.threadId
    );

    return this._commentRepository.addComment(useCasePayload);
  }
}

module.exports = AddCommentUseCase;
