const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

// Routes
app.use('/api/characters', require('./routes/characters'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/combat', require('./routes/combat'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/shops', require('./routes/shops'));
app.use('/api/refine', require('./routes/refine'));
app.use('/api/bonuses', require('./routes/bonuses'));
app.use('/api/crafting', require('./routes/crafting'));
app.use('/api/lifeskills', require('./routes/lifeskills'));
app.use('/api/idle', require('./routes/idle'));
app.use('/api/areas', require('./routes/areas'));
app.use('/api/npcs', require('./routes/npcs'));
app.use('/api/healer', require('./routes/healer'));
app.use('/api/storage', require('./routes/storage'));
app.use('/api/kingdoms', require('./routes/kingdoms'));
app.use('/api/classes', require('./routes/classes'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Error handler
app.use((err, req, res, next) => {
  console.error('[Error]', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Erro interno do servidor' });
});

module.exports = app;
