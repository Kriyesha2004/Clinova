const express = require('express');
const router = express.Router();
const BloodStock = require('../models/BloodStock');
const BloodLog = require('../models/BloodLog');
const WardSupply = require('../models/WardSupply');

// GET all blood stock
router.get('/blood-stock', async (req, res) => {
  try {
    const stock = await BloodStock.find();
    res.json(stock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST adjust blood stock directly (e.g. from inline increment/decrement)
router.post('/blood-stock/adjust', async (req, res) => {
  const { group, delta } = req.body;

  if (!group || delta === undefined) {
    return res.status(400).json({ message: 'Group and delta are required' });
  }

  try {
    const stock = await BloodStock.findOne({ group });
    if (!stock) {
      return res.status(404).json({ message: 'Blood group not found' });
    }

    stock.units = Math.max(0, Math.min(stock.max, stock.units + delta));
    const saved = await stock.save();
    res.json({ message: 'Stock adjusted successfully', data: saved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all blood logs
router.get('/blood-logs', async (req, res) => {
  try {
    const logs = await BloodLog.find().sort({ createdAt: -1 }).limit(50);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create transaction log and adjust stock
router.post('/blood-logs', async (req, res) => {
  const { group, units, type, dest } = req.body;

  if (!group || !units || !type || !dest) {
    return res.status(400).json({ message: 'Group, units, type, and dest are required' });
  }

  try {
    // 1. Save the transaction log
    const timeStr = new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    const newLog = new BloodLog({
      group,
      units,
      type,
      dest,
      time: timeStr
    });
    const savedLog = await newLog.save();

    // 2. Adjust blood stock count
    const delta = type === 'received' ? units : -units;
    const stock = await BloodStock.findOne({ group });
    if (stock) {
      stock.units = Math.max(0, Math.min(stock.max, stock.units + delta));
      await stock.save();
    }

    res.status(201).json({ message: 'Transaction logged and stock updated', log: savedLog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all ward supplies
router.get('/ward-supplies', async (req, res) => {
  try {
    const supplies = await WardSupply.find();
    res.json(supplies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST adjust ward supply stock
router.post('/ward-supplies/adjust', async (req, res) => {
  const { id, delta } = req.body;

  if (!id || delta === undefined) {
    return res.status(400).json({ message: 'ID and delta are required' });
  }

  try {
    const supply = await WardSupply.findById(id);
    if (!supply) {
      return res.status(404).json({ message: 'Supply item not found' });
    }

    supply.stock = Math.max(0, supply.stock + delta);
    const saved = await supply.save();
    res.json({ message: 'Supply adjusted successfully', data: saved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST replenish ward supply (e.g. mock restock of +50)
router.post('/ward-supplies/replenish', async (req, res) => {
  const { id, count } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'ID is required' });
  }

  const replenishmentAmount = count || 50;

  try {
    const supply = await WardSupply.findById(id);
    if (!supply) {
      return res.status(404).json({ message: 'Supply item not found' });
    }

    supply.stock += replenishmentAmount;
    const saved = await supply.save();
    res.json({ message: 'Supply replenished successfully', data: saved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create a new ward supply
router.post('/ward-supplies', async (req, res) => {
  const { name, category, stock, minTarget } = req.body;

  if (!name || !category || stock === undefined || minTarget === undefined) {
    return res.status(400).json({ message: 'Name, category, stock, and minTarget are required' });
  }

  try {
    const newSupply = new WardSupply({
      name,
      category,
      stock,
      minTarget
    });
    const saved = await newSupply.save();
    res.status(201).json({ message: 'Supply item created successfully', data: saved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
