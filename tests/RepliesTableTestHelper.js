/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const ReplyTableTestHelper = {
  async addReply({
    id = 'reply-123',
    commentId = 'comment-123',
    content = 'Sebuah Balasan',
    owner = 'user-123',
    isDelete = false,
    date = new Date().toISOString(),
  }) {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, commentId, content, owner, isDelete, date],
    };

    await pool.query(query);
  },

  async getReply({ owner = 'user-123', id = 'reply-123' }) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1 AND owner = $2',
      values: [id, owner],
    };
    const result = await pool.query(query);
    return { ...result.rows[0], isDelete: result.rows[0].is_delete };
  },

  async getRepliesByCommentId({
    owner = 'user-123',
    commentId = 'comment-123',
  }) {
    const query = {
      text: 'SELECT * FROM replies WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };
    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = ReplyTableTestHelper;
