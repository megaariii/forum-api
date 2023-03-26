class AddReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const { threadId, commentId, content, owner, date } = payload;

    this.threadId = threadId;
    this.commentId = commentId;
    this.content = content;
    this.owner = owner;
    this.date = date;
  }

  _verifyPayload({ threadId, commentId, content, owner, date }) {
    if (!threadId || !commentId || !content || !owner || !date) {
      throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof threadId !== 'string' ||
      typeof commentId !== 'string' ||
      typeof content !== 'string' ||
      typeof owner !== 'string' ||
      typeof date !== 'string'
    ) {
      throw new Error('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddReply;
