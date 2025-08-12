const express = require('express');
const Feedback = require('../models/Feedback');
const { authenticateToken } = require('../middleware/auth');
const logger = require('../config/logger');

const router = express.Router();

router.get('/artwork/:artworkId', async (req, res) => {
  try {
    const feedback = await Feedback.findByArtworkId(req.params.artworkId);
    res.json(feedback);
  } catch (error) {
    logger.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { artwork_id, comment, rating } = req.body;
    
    if (!artwork_id || !comment || !rating) {
      return res.status(400).json({ error: 'Artwork ID, comment, and rating are required' });
    }

    if (req.user.role !== 'curator') {
      return res.status(403).json({ error: 'Only curators can provide feedback' });
    }

    const feedbackData = {
      artwork_id,
      curator_id: req.user.id,
      comment,
      rating
    };

    const feedback = await Feedback.create(feedbackData);
    logger.info(`Feedback created for artwork ${artwork_id} by curator ${req.user.id}`);
    res.status(201).json(feedback);
  } catch (error) {
    logger.error('Error creating feedback:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { comment, rating } = req.body;
    const feedback = await Feedback.update(req.params.id, { comment, rating });
    
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    
    logger.info(`Feedback updated: ${req.params.id}`);
    res.json(feedback);
  } catch (error) {
    logger.error('Error updating feedback:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await Feedback.delete(req.params.id);
    logger.info(`Feedback deleted: ${req.params.id}`);
    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    logger.error('Error deleting feedback:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;