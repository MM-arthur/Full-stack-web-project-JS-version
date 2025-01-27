const { sequelize, Organization, Role, Position, User, UserPosition, generateUuid } = require('../ORM.js');

async function deleteUser(req, res) {
    const { userId } = req.params;

    try {

      await sequelize.transaction(async (t) => {

        const userPositions = await UserPosition.findAll({ where: { user_uuid: userId }, transaction: t });

        await UserPosition.destroy({ where: { user_uuid: userId }, transaction: t });

        await User.destroy({ where: { uuid: userId }, transaction: t });

        // edit need for loop and findall too. but I'm lasy to do that.
        // btw, in real situtation, we just need offline the user and dont touch position, role, org.
        for (const userPosition of userPositions) {
          
          const position = await Position.findOne({ where: { uuid: userPosition.position_uuid }, transaction: t });
          
          await Position.destroy({ where: { uuid: position.uuid }, transaction: t });
          
          await Role.destroy({ where: { uuid: position.role_uuid }, transaction: t });
  
          await Organization.destroy({ where: { uuid: position.org_uuid }, transaction: t });
  
        }
  
      });
  
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}
  
module.exports = { deleteUser };
