const GetThreadDetails = require('../../../Domains/threads/entities/GetThreadDetails');

class GetThreadDetailsUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
    likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadDetails(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(
      threadId
    );

    const commentIds = comments.map((obj) => obj['id']);
    const replies = await this._replyRepository.getRepliesByCommentId(
      commentIds
    );

    const likes = await this._likeRepository.getLikes(commentIds);
    const result = [];

    for (const comment of comments) {
      comment.replies = replies.filter(
        (reply) => reply.comment_id === comment.id
      );

      const likeCount = likes.filter((like) => like.comment_id === comment.id);

      const modifiedReplies = comment.replies.map((obj) => {
        delete obj['comment_id'];
        return obj;
      });

      result.push({
        ...comment,
        likeCount: likeCount.length,
        replies: modifiedReplies,
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
