const express = require('express');
const Artwork = require('../models/Artwork');
const { authenticateToken } = require('../middleware/auth');
const logger = require('../config/logger');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const filters = req.query;
    const artworks = await Artwork.findAll(filters);
    res.json(artworks);
  } catch (error) {
    logger.error('Error fetching artworks:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) {
      return res.status(404).json({ error: 'Artwork not found' });
    }
    res.json(artwork);
  } catch (error) {
    logger.error('Error fetching artwork:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, image_url, tags } = req.body;
    
    if (!title || !description || !image_url) {
      return res.status(400).json({ error: 'Title, description, and image URL are required' });
    }

    const artworkData = {
      title,
      description,
      image_url,
      tags: tags || '',
      artist_id: req.user.id
    };

    const artwork = await Artwork.create(artworkData);
    logger.info(`Artwork created: ${title} by user ${req.user.id}`);
    res.status(201).json(artwork);
  } catch (error) {
    logger.error('Error creating artwork:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, description, image_url, tags } = req.body;
    const artwork = await Artwork.update(req.params.id, { title, description, image_url, tags });
    
    if (!artwork) {
      return res.status(404).json({ error: 'Artwork not found' });
    }
    
    logger.info(`Artwork updated: ${req.params.id}`);
    res.json(artwork);
  } catch (error) {
    logger.error('Error updating artwork:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await Artwork.delete(req.params.id);
    logger.info(`Artwork deleted: ${req.params.id}`);
    res.json({ message: 'Artwork deleted successfully' });
  } catch (error) {
    logger.error('Error deleting artwork:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;