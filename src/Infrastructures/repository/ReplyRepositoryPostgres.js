const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const GetReplyDetails = require('../../Domains/replies/entities/GetReplyDetails');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(newReply) {
    const { commentId, content, owner, date } = newReply;
    const id = `reply-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, false, $5) RETURNING id, content, owner',
      values: [id, commentId, content, owner, date],
    };

    const result = await this._pool.query(query);

    return new AddedReply({ ...result.rows[0] });
  }

  async checkOwnerOfReply({ owner, replyId, commentId }) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1 AND comment_id = $2',
      values: [replyId, commentId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Reply tidak ditemukan');
    }

    const reply = result.rows[0];
    if (reply.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async deleteReply({ owner, replyId, commentId }) {
    const query = {
      text: 'UPDATE replies SET is_delete = true WHERE id = $1 AND owner = $2 AND comment_id = $3',
      values: [replyId, owner, commentId],
    };

    await this._pool.query(query);
  }

  async getRepliesByCommentId(commentIds) {
    const query = {
      text: `SELECT replies.*, users.username FROM replies
      LEFT JOIN users ON replies.owner = users.id
      WHERE replies.comment_id = ANY($1::text[])
      ORDER BY replies.date ASC`,
      values: [commentIds],
    };

    const result = await this._pool.query(query);

    return result.rows.map((reply) => {
      const getReplyDetails = new GetReplyDetails({
        ...reply,
        isDelete: reply.is_delete,
      });
      return { ...getReplyDetails };
    });
  }
}

module.exports = ReplyRepositoryPostgres;
