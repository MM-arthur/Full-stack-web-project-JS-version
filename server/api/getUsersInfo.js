async function getUsersInfo(req, res, sequelize) {
    const { page, pageSize, userId, userName, position, role, organization } = req.query;
    
    let whereClause = '';
    
    let params = [];
    if (userId) {
      whereClause += `AND u.uuid = ?`;
      params.push(userId);
    }
    if (userName) {
      whereClause += `AND u.user_name LIKE ?`;
      params.push(`%${userName}%`);
    }
    if (position) {
      whereClause += `AND p.pos_name = ?`;
      params.push(position);
    }
    if (role) {
      whereClause += `AND r.role_name = ?`;
      params.push(role);
    }
    if (organization) {
      whereClause += `AND o.org_name = ?`;
      params.push(organization);
    }

    const offset = Number((page - 1) * pageSize);
    const limit = Number(pageSize);
    
    const sql = `
      SELECT
        u.*,
        p.pos_name,
        o.org_name,
        r.role_name
      FROM
      users u
      LEFT JOIN user_positions up ON u.uuid = up.user_uuid
      LEFT JOIN positions p ON up.position_uuid = p.uuid
      LEFT JOIN organizations o ON p.org_uuid = o.uuid
      LEFT JOIN roles r ON p.role_uuid = r.uuid
      WHERE
        1=1 ${whereClause}
      LIMIT ?, ?
    `;

    try {
      const [results] = await sequelize.query(sql, {
        replacements: [...params, offset, limit],
      });

      const [totalResults] = await sequelize.query(`
        SELECT COUNT(*) AS total
        FROM
        users u
        LEFT JOIN user_positions up ON u.uuid = up.user_uuid
        LEFT JOIN positions p ON up.position_uuid = p.uuid
        LEFT JOIN organizations o ON p.org_uuid = o.uuid
        LEFT JOIN roles r ON p.role_uuid = r.uuid
        WHERE
          1=1 ${whereClause}
      `, {
        replacements: params,
      });

      const userList = results.map(row => ({
        uuid: row.uuid,
        userName: row.user_name,
        position: row.pos_name,
        role: row.role_name,
        organization: row.org_name
      }));
    
      res.json({
        totalNumber: totalResults[0].total,
        usersList: userList
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
  module.exports = { getUsersInfo };