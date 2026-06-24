const express = require('express');
const router = express.Router();
const DengueContent = require('../models/DengueContent');

// GET all dengue content
router.get('/', async (req, res) => {
  try {
    const content = await DengueContent.find().sort({ createdAt: -1 });
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new dengue content
router.post('/', async (req, res) => {
  const { title, category, content, image } = req.body;

  if (!title || !category || !content) {
    return res.status(400).json({ message: 'Title, category, and content are required' });
  }

  if (!['prevention', 'safety', 'help'].includes(category)) {
    return res.status(400).json({ message: 'Invalid category' });
  }

  try {
    const newContent = new DengueContent({
      title,
      category,
      content,
      image: image || ''
    });

    const saved = await newContent.save();
    res.status(201).json({ message: 'Content created successfully', data: saved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT update dengue content
router.put('/:id', async (req, res) => {
  const { title, category, content, image } = req.body;

  try {
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (category !== undefined) {
      if (!['prevention', 'safety', 'help'].includes(category)) {
        return res.status(400).json({ message: 'Invalid category' });
      }
      updateData.category = category;
    }
    if (content !== undefined) updateData.content = content;
    if (image !== undefined) updateData.image = image;

    const updated = await DengueContent.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json({ message: 'Content updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE dengue content
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await DengueContent.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.json({ message: 'Content deleted successfully', data: deleted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
