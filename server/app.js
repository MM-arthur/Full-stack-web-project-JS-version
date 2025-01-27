const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config/config.js');
const { Sequelize, DataTypes } = require('sequelize');
const { getUsersInfo } = require('./api/getUsersInfo.js');
const { addUser } = require('./api/addUser.js');
const { editUser } = require('./api/editUser.js');
const { deleteUser } = require('./api/deleteUser.js');
const app = express();
const port = config.appConfig.port;
const sequelize = new Sequelize(config.dbConfig.database, config.dbConfig.username, config.dbConfig.password, {
    host: config.dbConfig.host,
    port: config.dbConfig.port,
    dialect: config.dbConfig.dialect,
});


app.use(cors());
app.use(express.json());

// Read of CRUD
app.get('/api/getUsersInfo', async (req, res) => {
  try {
    await getUsersInfo(req, res, sequelize);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create of CRUD
app.post('/api/addUser', async (req, res) => {
  try {
    await addUser(req, res, sequelize);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update of CRUD
app.patch('/api/editUsers/:userId', async (req, res) => {
  try {
    await editUser(req, res, sequelize);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete of CRUD
// In most situtation, we don't delete user, we use active/inactive field instead. So, use update method.
app.delete('/api/deleteUser/:userId', async (req, res) => {
  try {
    await deleteUser(req, res, sequelize);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('System running');
});

/**
 * if package and deploy, need transfer router control to vue.
 */
// app.use(express.static(path.join(__dirname, './dist')));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, './dist', 'index.html'));
// });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
