const { sequelize, Organization, Role, Position, User, UserPosition, generateUuid } = require('../ORM.js');

async function addUser(req, res) {
    const { userName, role, organization } = req.body;
  
    try {

      const result = await sequelize.transaction(async (t) => {
        const orgUuid = generateUuid();
        const roleUuid = generateUuid();
        const posUuid = generateUuid();
        const userUuid = generateUuid();

        const myOrganization = await Organization.create(
            { uuid: orgUuid, org_name: organization },
            { transaction: t }
        );

        const myRole = await Role.create(
            { uuid: roleUuid, role_name: role },
            { transaction: t }
        );
  
        const myPosition = await Position.create(
            {
              uuid: posUuid,
              org_uuid: myOrganization.uuid,
              role_uuid: myRole.uuid,
              pos_name: organization+" "+role
            },
            { transaction: t }
        );
  
        const myUser = await User.create(
            { 
              uuid: userUuid, 
              user_name: userName 
            },
            { transaction: t }
        );
  
        await UserPosition.create(
          {
            user_uuid: myUser.uuid,
            position_uuid: myPosition.uuid
          },
          { transaction: t }
        );
  
        return { userId: myUser.uuid, positionId: myPosition.uuid };
      });
  
      res.status(201).json({ message: 'User, role, organization, and position added successfully', userId: result.userId, positionId: result.positionId });
    } catch (error) {
      console.error('Error adding user, role, organization, and position:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { addUser };
