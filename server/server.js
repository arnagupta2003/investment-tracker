const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');
const { calculateXIRR } = require('./xirr');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(bodyParser.json());

// GET all investments
app.use('/api/investments', (req, res, next) => {
  if (req.method !== 'GET') return next();
  try {
    const stmt = db.prepare('SELECT * FROM investments ORDER BY date ASC');
    const investments = stmt.all();
    res.json(investments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new investment
app.post('/api/investments', (req, res) => {
  const { asset_type, amount, date } = req.body;
  if (!asset_type || !amount || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const stmt = db.prepare('INSERT INTO investments (asset_type, amount, date) VALUES (?, ?, ?)');
    const info = stmt.run(asset_type, amount, date);
    res.json({ id: info.lastInsertRowid, asset_type, amount, date });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE investment
app.delete('/api/investments/:id', (req, res) => {
  const { id } = req.params;
  try {
    const stmt = db.prepare('DELETE FROM investments WHERE id = ?');
    const info = stmt.run(id);
    if (info.changes === 0) {
      return res.status(404).json({ error: 'Investment not found' });
    }
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET Metrics (Aggregated)
app.get('/api/metrics', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM investments ORDER BY date ASC');
    const investments = stmt.all();

    if (investments.length === 0) {
      return res.json({
        totalValue: 0,
        absoluteReturn: 0,
        xirr: 0
      });
    }

    // Group by Asset Type to find First and Latest for each asset?
    // Or Global Portfolio First and Latest?
    // Proposal: Global Portfolio Level.
    // First Date = Min Date. Value on that date (sum of all assets on that date? No, might be sparse).
    // Simplification for MVP:
    // "Total Value" = Sum of Latest Entry for EACH Asset Type.
    // "First Value" = Sum of First Entry for EACH Asset Type.

    const assets = {};
    for (const inv of investments) {
      if (!assets[inv.asset_type]) {
        assets[inv.asset_type] = [];
      }
      assets[inv.asset_type].push(inv);
    }

    let totalInitial = 0;
    let totalCurrent = 0;
    let weightedXIRR = 0; // Complexity: XIRR of portfolio is ... complicated with gaps.
    // Let's stick to:
    // Total Value = Sum of Latest Values.
    // Absolute Return = (Total Current - Total Initial) / Total Initial.
    // XIRR = we can approximate by treating "Total Initial" as occurring at "Average Start Date".

    let minDate = investments[0].date;
    let maxDate = investments[investments.length - 1].date;

    for (const type in assets) {
      const history = assets[type];
      // Sort by date just in case
      history.sort((a, b) => new Date(a.date) - new Date(b.date));

      const first = history[0];
      const last = history[history.length - 1];

      totalInitial += first.amount;
      totalCurrent += last.amount;
    }

    const absoluteReturn = totalInitial > 0 ? ((totalCurrent - totalInitial) / totalInitial) * 100 : 0;

    // Approximate XIRR:
    // Treat Total Initial as single outflow at MinDate.
    // Treat Total Current as single inflow at MaxDate.
    const xirr = calculateXIRR(totalInitial, minDate, totalCurrent, maxDate) * 100;

    res.json({
      totalValue: totalCurrent,
      absoluteReturn: parseFloat(absoluteReturn.toFixed(2)),
      xirr: parseFloat(xirr.toFixed(2))
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
