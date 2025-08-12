const pool = require('../config/database');

class Artwork {
  static async create(artworkData) {
    const { title, description, image_url, tags, artist_id } = artworkData;
    const result = await pool.query(
      'INSERT INTO artworks (title, description, image_url, tags, artist_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, image_url, tags, artist_id]
    );
    return result.rows[0];
  }

  static async findAll(filters = {}) {
    let query = `
      SELECT a.*, u.username as artist_name 
      FROM artworks a 
      JOIN users u ON a.artist_id = u.id
    `;
    const params = [];
    const conditions = [];

    if (filters.tags) {
      conditions.push(`tags ILIKE $${params.length + 1}`);
      params.push(`%${filters.tags}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, params);
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT a.*, u.username as artist_name FROM artworks a JOIN users u ON a.artist_id = u.id WHERE a.id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async update(id, artworkData) {
    const { title, description, image_url, tags } = artworkData;
    const result = await pool.query(
      'UPDATE artworks SET title = $1, description = $2, image_url = $3, tags = $4 WHERE id = $5 RETURNING *',
      [title, description, image_url, tags, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM artworks WHERE id = $1', [id]);
  }
}

module.exports = Artwork;