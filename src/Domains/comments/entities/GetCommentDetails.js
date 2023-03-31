class GetCommentDetails {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, username, content, date, is_delete } = payload;

    this.id = id;
    this.username = username;
    this.content = content;
    this.content = is_delete ? '**komentar telah dihapus**' : content;
    this.date = date;
    this.replies = [];
  }

  _verifyPayload(payload) {
    if (!payload.id || !payload.username || !payload.date || !payload.content) {
      throw new Error('COMMENT_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (
      typeof payload.id !== 'string' ||
      typeof payload.username !== 'string' ||
      typeof payload.date !== 'string' ||
      typeof payload.content !== 'string'
    ) {
      throw new Error('COMMENT_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (payload.isDelete) {
      payload.content = '**komentar telah dihapus**';
    }
  }
}

module.exports = GetCommentDetails;
