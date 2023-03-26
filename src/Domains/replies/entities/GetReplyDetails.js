class GetReplyDetails {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, username, content, date } = payload;

    this.id = id;
    this.username = username;
    this.content = content;
    this.date = date;
  }

  _verifyPayload(payload) {
    if (
      !payload.id ||
      !payload.username ||
      !payload.date ||
      !payload.content ||
      payload.isDelete === undefined
    ) {
      throw new Error('REPLY_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (
      typeof payload.id !== 'string' ||
      typeof payload.username !== 'string' ||
      typeof payload.date !== 'string' ||
      typeof payload.content !== 'string' ||
      typeof payload.isDelete !== 'boolean'
    ) {
      throw new Error('REPLY_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (payload.isDelete) {
      payload.content = '**balasan telah dihapus**';
    }
  }
}

module.exports = GetReplyDetails;
