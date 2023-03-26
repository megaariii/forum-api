const GetThreadDetails = require('../../../Domains/threads/entities/GetThreadDetails');

class GetThreadDetailsUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadDetails(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(
      threadId
    );

    const result = [];

    for (const comment of comments) {
      result.push({
        ...comment,
        replies: await this._replyRepository.getRepliesByCommentId(comment.id),
      });
    }

    const getThreadDetails = new GetThreadDetails({
      ...thread,
      comments: result,
    });
    return getThreadDetails;
  }
}

module.exports = GetThreadDetailsUseCase;
