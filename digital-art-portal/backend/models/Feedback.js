const pool = require('../config/database');

class Feedback {
  static async create(feedbackData) {
    const { artwork_id, curator_id, comment, rating } = feedbackData;
    const result = await pool.query(
      'INSERT INTO feedback (artwork_id, curator_id, comment, rating) VALUES ($1, $2, $3, $4) RETURNING *',
      [artwork_id, curator_id, comment, rating]
    );
    return result.rows[0];
  }

  static async findByArtworkId(artworkId) {
    const result = await pool.query(
      'SELECT f.*, u.username as curator_name FROM feedback f JOIN users u ON f.curator_id = u.id WHERE f.artwork_id = $1',
      [artworkId]
    );
    return result.rows;
  }

  static async update(id, feedbackData) {
    const { comment, rating } = feedbackData;
    const result = await pool.query(
      'UPDATE feedback SET comment = $1, rating = $2 WHERE id = $3 RETURNING *',
      [comment, rating, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM feedback WHERE id = $1', [id]);
  }
}

module.exports = Feedback;