const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const GetCommentDetails = require('../../Domains/comments/entities/GetCommentDetails');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { threadId, content, owner, date } = newComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, false, $5) RETURNING id, content, owner',
      values: [id, threadId, content, owner, date],
    };

    const result = await this._pool.query(query);

    return new AddedComment(result.rows[0]);
  }

  async checkOwnerOfComment({ owner, commentId, threadId }) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND thread_id = $2',
      values: [commentId, threadId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError(
        'tidak dapat menghapus comment karena comment tidak ditemukan'
      );
    }

    const comment = result.rows[0];
    if (comment.owner !== owner) {
      throw new AuthorizationError('anda tidak berhak mengakses resource ini');
    }
  }

  async deleteComment({ owner, commentId, threadId }) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1 AND owner = $2 AND thread_id = $3',
      values: [commentId, owner, threadId],
    };

    await this._pool.query(query);
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT comments.id, users.username, content, comments.date, comments.is_delete FROM comments 
      LEFT JOIN users ON comments.owner = users.id 
      WHERE thread_id = $1
      ORDER BY comments.date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows.map((comment) => new GetCommentDetails(comment));
  }

  async verifyCommentAvailability(commentId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new NotFoundError('Comment tidak ditemukan');
    }
  }
}

module.exports = CommentRepositoryPostgres;
