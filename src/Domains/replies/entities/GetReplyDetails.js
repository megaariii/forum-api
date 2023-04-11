class GetReplyDetails {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, comment_id, username, content, date, is_delete } = payload;

    this.id = id;
    this.comment_id = comment_id;
    this.username = username;
    this.content = is_delete ? '**balasan telah dihapus**' : content;
    this.date = date;
  }

  _verifyPayload(payload) {
    if (!payload.id || !payload.username || !payload.date || !payload.content) {
      throw new Error('REPLY_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (
      typeof payload.id !== 'string' ||
      typeof payload.username !== 'string' ||
      typeof payload.date !== 'string' ||
      typeof payload.content !== 'string'
    ) {
      throw new Error('REPLY_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetReplyDetails;
