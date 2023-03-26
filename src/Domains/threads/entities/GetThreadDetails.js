class GetThreadDetails {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, title, body, date, username, comments } = payload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.username = username;
    this.comments = comments;
  }

  _verifyPayload({ id, title, body, date, username, comments }) {
    if (
      !id ||
      !title ||
      !body ||
      !date ||
      !username ||
      !comments ||
      !comments[0]
    ) {
      throw new Error('THREAD_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof title !== 'string' ||
      typeof body !== 'string' ||
      typeof date !== 'string' ||
      typeof username !== 'string' ||
      !(comments instanceof Array) ||
      !(comments[0].replies instanceof Array)
    ) {
      throw new Error('THREAD_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetThreadDetails;
