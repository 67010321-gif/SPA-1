const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DBFILE = path.join(__dirname, 'visits.db');

const db = new sqlite3.Database(DBFILE, (err) => {
  if (err) {
    console.error('DB open error', err);
    process.exit(1);
  }
});

// Ensure table exists
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS visits (id INTEGER PRIMARY KEY, count INTEGER)', (err) => {
    if (err) console.error('Create table error', err);
  });
});

app.get('/', (req, res) => {
  // read -> increment -> save -> respond
  db.get('SELECT count FROM visits WHERE id = 1', (err, row) => {
    if (err) {
      console.error('DB read error', err);
      return res.status(500).send('DB error');
    }
    if (row) {
      const next = row.count + 1;
      db.run('UPDATE visits SET count = ? WHERE id = 1', next, function (uerr) {
        if (uerr) {
          console.error('DB update error', uerr);
          return res.status(500).send('DB error');
        }
        res.send(`<h1>Visit count: ${next}</h1>`);
      });
    } else {
      db.run('INSERT INTO visits (id, count) VALUES (1, 1)', function (ierr) {
        if (ierr) {
          console.error('DB insert error', ierr);
          return res.status(500).send('DB error');
        }
        res.send('<h1>Visit count: 1</h1>');
      });
    }
  });
});

// graceful close on exit
process.on('SIGINT', () => {
  db.close(() => process.exit(0));
});

app.listen(PORT, () => console.log(`Listening http://localhost:${PORT}/`));
