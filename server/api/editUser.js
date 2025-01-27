const { sequelize, Organization, Role, Position, User, UserPosition, generateUuid } = require('../ORM.js');

async function editUser(req, res) {
  const { userId } = req.params;
  const { userName, role, organization } = req.body;

  try {

    await sequelize.transaction(async (t) => {

      await User.update(
        { user_name: userName },
        { where: { uuid: userId }, transaction: t }
      );

      //for loop and findAll is needed here, but in our easy template is no need.
      const userPosition = await UserPosition.findOne({ where: { user_uuid: userId }, transaction: t });

      const myPosition = await Position.findOne({ where: { uuid: userPosition.position_uuid }, transaction: t });

      await Position.update(
        { pos_name: organization + " " + role },
        { where: { uuid: userPosition.position_uuid }, transaction: t }
      );

      await Role.update(
        { role_name: role },
        { where: { uuid: myPosition.role_uuid }, transaction: t }
      );

      await Organization.update(
        { org_name: organization },
        { where: { uuid: myPosition.org_uuid }, transaction: t }
      );

    });

    res.json({ message: 'User information updated successfully' });
  } catch (error) {
    console.error('Error updating user information:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = { editUser };
