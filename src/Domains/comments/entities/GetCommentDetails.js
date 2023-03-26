class GetCommentDetails {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, username, content, date, replies } = payload;

    this.id = id;
    this.username = username;
    this.content = content;
    this.date = date;
    this.replies = replies;
  }

  _verifyPayload(payload) {
    if (
      !payload.id ||
      !payload.username ||
      !payload.date ||
      !payload.content ||
      payload.isDelete === undefined ||
      !payload.replies
    ) {
      throw new Error('COMMENT_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (
      typeof payload.id !== 'string' ||
      typeof payload.username !== 'string' ||
      typeof payload.date !== 'string' ||
      typeof payload.content !== 'string' ||
      typeof payload.isDelete !== 'boolean' ||
      !(payload.replies instanceof Array)
    ) {
      throw new Error('COMMENT_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (payload.isDelete) {
      payload.content = '**komentar telah dihapus**';
    }
  }
}

module.exports = GetCommentDetails;
