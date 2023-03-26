class AddThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { title, body, owner, date } = payload;

    this.title = title;
    this.body = body;
    this.owner = owner;
    this.date = date;
  }

  _verifyPayload({ title, body, owner, date }) {
    if (!title || !body || !owner || !date) {
      throw new Error('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof title !== 'string' ||
      typeof body !== 'string' ||
      typeof owner !== 'string' ||
      typeof date !== 'string'
    ) {
      throw new Error('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (owner.length > 50) {
      throw new Error('ADD_THREAD.OWNER_LIMIT_CHAR');
    }
  }
}

module.exports = AddThread;
