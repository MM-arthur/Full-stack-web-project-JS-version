const config = require('./config/config.js');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(config.dbConfig.database, config.dbConfig.username, config.dbConfig.password, {
    host: config.dbConfig.host,
    port: config.dbConfig.port,
    dialect: config.dbConfig.dialect,
});

const { v4: uuidv4 } = require('uuid');
function generateUuid() {
  return uuidv4();
}

const Organization = sequelize.define('Organization', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  uuid: {
    type: DataTypes.CHAR(36),
    unique: true,
    allowNull: false
  },
  org_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'organizations',
  timestamps: false
});

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  uuid: {
    type: DataTypes.CHAR(36),
    unique: true,
    allowNull: false
  },
  role_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'roles',
  timestamps: false
});


const Position = sequelize.define('Position', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  uuid: {
    type: DataTypes.CHAR(36),
    unique: true,
    allowNull: false
  },
  org_uuid: {
    type: DataTypes.CHAR(36),
    allowNull: false
  },
  role_uuid: {
    type: DataTypes.CHAR(36),
    allowNull: false
  },
  pos_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  valid_to: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'positions',
  timestamps: false
});


const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  uuid: {
    type: DataTypes.CHAR(36),
    unique: true,
    allowNull: false
  },
  user_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: false
});


const UserPosition = sequelize.define('UserPosition', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  user_uuid: {
    type: DataTypes.CHAR(36),
    allowNull: false
  },
  position_uuid: {
    type: DataTypes.CHAR(36),
    allowNull: false
  }
}, {
  tableName: 'user_positions',
  timestamps: false
});


Position.belongsTo(Organization, { foreignKey: 'org_uuid' });
Position.belongsTo(Role, { foreignKey: 'role_uuid' });
UserPosition.belongsTo(User, { foreignKey: 'user_uuid' });
UserPosition.belongsTo(Position, { foreignKey: 'position_uuid' });

module.exports = {
  sequelize,
  Organization,
  Role,
  Position,
  User,
  UserPosition,
  generateUuid
};
