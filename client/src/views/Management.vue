<template>
  <h3>XX管理系统(增删改查系统) -- Basic Management System</h3>
  <el-container>
    <el-main>
      <el-row :gutter="20" class="mb-20">
        <el-col :span="4">
          <!--In user view, they just know mean of 'id'. In program view, 'id' may cause problems, so we name it as userId-->
          <el-input v-model="search.userId" placeholder="Id..."></el-input>
        </el-col>
        <el-col :span="4">
          <!--The reason same as above-->
          <el-input v-model="search.userName" placeholder="Name..."></el-input>
        </el-col>
        <el-col :span="4">
          <el-input v-model="search.position" placeholder="Position..."></el-input>
        </el-col>
        <el-col :span="4">
          <el-input v-model="search.role" placeholder="Role..."></el-input>
        </el-col>
        <el-col :span="4">
          <el-input v-model="search.organization" placeholder="Organization..."></el-input>
        </el-col>
        <el-col :span="4" class="text-right">
          <el-button type="primary" @click="searchData" class="custom-small-button">Search</el-button>
          <el-button type="success" @click="showAddDialog" class="custom-small-button">Add</el-button>
        </el-col>
      </el-row>
      <!-- you can add second row -->
      <!-- <el-row :gutter="20" class="mb-20"></el-row> -->
      <!-- sheet -->
      <el-table :data="tableData" width="100%">
        <el-table-column prop="userId" label="Id"></el-table-column>
        <el-table-column prop="userName" label="Name"></el-table-column>
        <el-table-column prop="position" label="Position"></el-table-column>
        <el-table-column prop="role" label="Role"></el-table-column>
        <el-table-column prop="organization" label="Organization"></el-table-column>
        <el-table-column label="Action">
          <template #default="scope">
            <el-button size="small" @click="showEditDialog(scope.row)" class="custom-small-button">Edit</el-button>
            <el-button size="small" type="danger" @click="deleteUserAction(scope.row)"
              class="custom-small-button">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="prev, pager, next" :total="total" :page-size="pageSize"
        @current-change="handlePageChange" class="mt-20">
      </el-pagination>
    </el-main>
  </el-container>
  <div v-if="addDialogVisible" class="modal">
    <div class="modal-content">
      <span class="close" @click="addDialogVisible = false">&times;</span>
      <h2>Add User</h2>
      <el-form :model="newUser" ref="newUserForm" label-width="80px">
        <!-- Can add other validate rules here, use the regx -->
        <!-- In most situtation, role, org is use selection -->
        <el-form-item label="Name" prop="userName" :rules="[{ required: true, message: 'Name...', trigger: 'blur' }]">
          <el-input v-model="newUser.userName"></el-input>
        </el-form-item>
        <el-form-item label="Role" prop="role" :rules="[{ required: true, message: 'Role...', trigger: 'blur' }]">
          <el-input v-model="newUser.role"></el-input>
        </el-form-item>
        <el-form-item label="Organization" prop="organization" :rules="[{ required: true, message: 'Organization...', trigger: 'blur' }]">
          <el-input v-model="newUser.organization"></el-input>
        </el-form-item>
      </el-form>
      <div class="modal-footer">
        <el-button @click="addDialogVisible = false">Cancal</el-button>
        <el-button type="primary" @click="addUserAction">Add</el-button>
      </div>
    </div>
  </div>
  <div v-if="editDialogVisible" class="modal">
    <div class="modal-content">
      <span class="close" @click="editDialogVisible = false">&times;</span>
      <h2>Edit User</h2>
      <el-form :model="editUser" ref="editUserForm" label-width="80px">
        <!-- Can add other validate rules here, use the regx -->
        <!-- In most situtation, role, org is use selection -->
        <el-form-item label="Name" prop="userName" :rules="[{ required: true, message: 'Name...', trigger: 'blur' }]">
          <el-input v-model="editUser.userName"></el-input>
        </el-form-item>
        <el-form-item label="Role" prop="role" :rules="[{ required: true, message: 'Role...', trigger: 'blur' }]">
          <el-input v-model="editUser.role"></el-input>
        </el-form-item>
        <el-form-item label="Organization" prop="organization" :rules="[{ required: true, message: 'Organization...', trigger: 'blur' }]">
          <el-input v-model="editUser.organization"></el-input>
        </el-form-item>
      </el-form>
      <div class="modal-footer">
        <el-button @click="editDialogVisible = false">Cancal</el-button>
        <el-button type="primary" @click="editUserAction">Save</el-button>
      </div>
    </div>
  </div>
  <h3>XX管理系统其他细节功能属性均基于此延伸</h3>
  <h3>The other detailed functional attributes of the Management System are all extended based on this.</h3>
  <h3>仅作为基本案例实现增删改查，真实场景需要分开用户管理、角色管理、组织架构管理等，且涉及多对多等复杂关系。数据库表是基于复杂关系设计的，但该实现案例无法体现出数据库多对多关系设计的必要性，案例做了简化，仅为一对一</h3>
  <h3>Only basic cases are implemented for CRUD. Real situtation require separate user management, role management, organizational management, and involve complex relationships such as many-to-many relationships. The database table is designed based on complex relationships, but this implementation case cannot reflect the necessity of database many-to-many relationship design. The case is simplified and only serves as a basic case for CRUD one-to-one relationships.</h3>
</template>

<script>
import axios from 'axios';
import apiConfig from '../config/apiConfig.js';

export default {
  data() {
    return {
      QUERYTYPE: {
        INITIAL_QUERY: 1,
        UNCONDITIONAL_QUERY: 2,
        INITIAL_OR_UNCONDITIONAL_QUERY_WITH_PAGINATION: 3,
        CONDITIONAL_QUERY: 4,
        CONDITIONAL_QUERY_WITH_PAGINATION: 5,
      },
      search: {
        userId: '',
        userName: '',
        position: '',
        role: '',
        organization: ''
      },
      searchParams: {
        userId: '',
        userName: '',
        position: '',
        role: '',
        organization: ''
      },
      newUser: {
        userName: '',
        role: '',
        organization: ''
      },
      editUser: {
        userId: '',
        userName: '',
        role: '',
        organization: ''
      },
      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      isSearch: false,
      addDialogVisible: false,
      editDialogVisible: false,
    };
  },
  mounted() {
    //console.log(import.meta.env.VITE_API_BASE_URL);
    this.queryUsersList(this.QUERYTYPE.INITIAL_QUERY);
  },
  methods: {
    /**
     * About Query / Pagination Query / Conditional Query
     * 1.Initial Query 2.Unconditional Query 3.Initial Query or Unconditional Query with pagination
     * 4.Conditional Query 5.Conditional Query with pagination
     * To avoid data disruption.
     * Best practices: When querying for the first time, obtain the total parameter and display the total number of pages, allowing users to clearly know the total number of pages and thus better navigate through pagination.
     */
    queryUsersList(queryType) {
      let apiUrl = `${apiConfig.baseUrl}/getUsersInfo`

      if(queryType === 1 || queryType === 2) {

        this.currentPage = 1;

        let params = {
          pageSize: this.pageSize,
          page: this.currentPage,
        }

        axios.get(apiUrl, {
          // headers: { 
          //   'Authorization': `Bearer ${yourToken}` // if token is needed.
          // }
          params: params,
        })
        .then(response => {

          if(response.data) {
            this.total = response.data.totalNumber;
            let usersList = []

            for (let item of response.data.usersList) {
              let userData = {
                userId: item.uuid,
                userName: item.userName,
                position: item.position,
                role: item.role,
                organization: item.organization,
              }
              usersList.push(userData);
            }

            this.tableData = usersList;
          }
        })
        .catch(error => {
          console.error(error);
          this.$message.error('Failed to fetch data');
        });
      } else if(queryType === 3) {
        
        let params = {
          pageSize: this.pageSize,
          page: this.currentPage,
        }

        axios.get(apiUrl, {
          // headers: { 
          //   'Authorization': `Bearer ${yourToken}` // if token is needed.
          // }
          params: params,
        })
        .then(response => {

          if(response.data) {
            let usersList = []

            for (let item of response.data.usersList) {
              let userData = {
                userId: item.uuid,
                userName: item.userName,
                position: item.position,
                role: item.role,
                organization: item.organization,
              }
              usersList.push(userData);
            }

            this.tableData = usersList;
          }
        })
        .catch(error => {
          console.error(error);
          this.$message.error('Failed to fetch data');
        });
      } else if(queryType === 4) {
        this.currentPage = 1;

        let params = {
          pageSize: this.pageSize,
          page: this.currentPage,
          userId: this.searchParams.userId,
          userName: this.searchParams.userName,
          position: this.searchParams.position,
          role: this.searchParams.role,
          organization: this.searchParams.organization,
        }

        axios.get(apiUrl, {
          // headers: { 
          //   'Authorization': `Bearer ${yourToken}` // if token is needed.
          // }
          params: params,
        })
        .then(response => {

          if(response.data) {
            this.total = response.data.totalNumber;
            let usersList = []

            for (let item of response.data.usersList) {
              let userData = {
                userId: item.uuid,
                userName: item.userName,
                position: item.position,
                role: item.role,
                organization: item.organization,
              }
              usersList.push(userData);
            }

            this.tableData = usersList;
          }
        })
        .catch(error => {
          console.error(error);
          this.$message.error('Failed to fetch data');
        });
      } else if(queryType === 5) {

        let params = {
          pageSize: this.pageSize,
          page: this.currentPage,
          userId: this.searchParams.userId,
          userName: this.searchParams.userName,
          position: this.searchParams.position,
          role: this.searchParams.role,
          organization: this.searchParams.organization,
        }

        axios.get(apiUrl, {
          // headers: { 
          //   'Authorization': `Bearer ${yourToken}` // if token is needed.
          // }
          params: params,
        })
        .then(response => {

          if(response.data) {
            
            let usersList = []

            for (let item of response.data.usersList) {
              let userData = {
                userId: item.uuid,
                userName: item.userName,
                position: item.position,
                role: item.role,
                organization: item.organization,
              }
              usersList.push(userData);
            }

            this.tableData = usersList;
          }
        })
        .catch(error => {
          console.error(error);
          this.$message.error('Failed to fetch data');
        });
      } else {
        console.error('Invalid query type');
      }

    },

    searchData() {
      
      if(!this.search.userId && !this.search.userName && !this.search.position && !this.search.role && !this.search.organization) {
        this.$message.error(`At least one keyword please`);
        // this.queryUsersList(this.QUERYTYPE.UNCONDITIONAL_QUERY);
        return;

      }

      for (const key in this.search) {
        if (this.search[key] && !this.validateInput(this.search[key])) {
          this.$message.error(`${key} is wrong`);
          return;
        }
      }

      this.isSearch = true;
      this.searchParams.userId = this.search.userId;
      this.searchParams.userName =  this.search.userName;
      this.searchParams.position =  this.search.position;
      this.searchParams.role =  this.search.role;
      this.searchParams.organization =  this.search.organization;
      
      this.queryUsersList(this.QUERYTYPE.CONDITIONAL_QUERY);

    },

    validateInput(input) {
      // Form validation: Non-empty and special characters.
      // Generate by AI. As you can say, we don't need to REMEMBER the regular expression.
      return /^[a-zA-Z0-9-]+( [a-zA-Z0-9-]+)*$/.test(input.trim());
    },

    handlePageChange(page) {
      this.currentPage = page;

      if(this.isSearch) {
        this.queryUsersList(this.QUERYTYPE.CONDITIONAL_QUERY_WITH_PAGINATION);
      } else {
        this.queryUsersList(this.QUERYTYPE.INITIAL_OR_UNCONDITIONAL_QUERY_WITH_PAGINATION);
      }
      
    },

    /**
     * Be care of init situtation.
     */
    searchDataInit() {
      this.search = {
        userId: '',
        userName: '',
        position: '',
        role: '',
        organization: ''
      };
    },

    searchParamsDataInit() {
      this.searchParams = {
        userId: '',
        userName: '',
        position: '',
        role: '',
        organization: ''
      };
    },

    addDataInit() {
      this.newUser = {
        userName: '',
        role: '',
        organization: ''
      };
    },

    editDataInit() {
      this.editUser = {
        userId: '',
        userName: '',
        role: '',
        organization: ''
      };
    },

    /**
     * create, update, delete
     */
    showAddDialog() {
      this.addDataInit();
      this.addDialogVisible = true;
    },

    addUserAction() {
      // Validate the new user fields
      this.$refs.newUserForm.validate((valid) => {
        if (valid) {
          // Add the new user to the tableData
          let apiUrl = `${apiConfig.baseUrl}/addUser`

          let params = {
            userName: this.newUser.userName,
            role: this.newUser.role,
            organization: this.newUser.organization,
          }

          axios.post(apiUrl, params, {
            // headers: { 
            //   'Authorization': `Bearer ${yourToken}` // if token is needed.
            // }
          })
          .then(response => {
            this.addDialogVisible = false;
            this.addDataInit()
            this.searchDataInit()
            this.searchParamsDataInit()
            this.$refs.newUserForm.resetFields();
            this.queryUsersList(this.QUERYTYPE.INITIAL_QUERY);
            this.$message.success('Add User success');
          })
          .catch(error => {
            this.addDialogVisible = false;
            this.addDataInit()
            this.searchDataInit()
            this.searchParamsDataInit()
            this.$refs.newUserForm.resetFields();
            this.queryUsersList(this.QUERYTYPE.INITIAL_QUERY);
            this.$message.error('Add User failed');
          });

        } else {
          this.$message.error('Please input the right data');
          return false;
        }
      });
    },

    showEditDialog(row) {
      this.editUser.userId = row.userId,
      this.editUser.userName = row.userName,
      this.editUser.role = row.role,
      this.editUser.organization = row.organization,

      this.editDialogVisible = true;
    },

    editUserAction() {
      // Validate the new user fields
      this.$refs.editUserForm.validate((valid) => {
        if (valid) {
          // Add the new user to the tableData
          let apiUrl = `${apiConfig.baseUrl}/editUsers/${this.editUser.userId}`;

          let params = {
            userName: this.editUser.userName,
            role: this.editUser.role,
            organization: this.editUser.organization,
          }

          axios.patch(apiUrl, params, {
            // headers: { 
            //   'Authorization': `Bearer ${yourToken}` // if token is needed.
            // }
          })
          .then(response => {
            this.editDialogVisible = false;
            this.editDataInit()
            this.searchDataInit()
            this.searchParamsDataInit()
            this.$refs.editUserForm.resetFields();
            this.queryUsersList(this.QUERYTYPE.INITIAL_QUERY);
            this.$message.success('Edit User success');
          })
          .catch(error => {
            this.editDialogVisible = false;
            this.editDataInit()
            this.searchDataInit()
            this.searchParamsDataInit()
            this.$refs.editUserForm.resetFields();
            this.queryUsersList(this.QUERYTYPE.INITIAL_QUERY);
            this.$message.error('Edit User failed');
          });

        } else {
          this.$message.error('Please input the right data');
          return false;
        }
      });
    },

    deleteUserAction(row) {

      let apiUrl = `${apiConfig.baseUrl}/deleteUser/${row.userId}`

      axios.delete(apiUrl, {
        // headers: { 
        //   'Authorization': `Bearer ${yourToken}`
        // }
      })
      .then(response => {

        this.addDataInit()
        this.editDataInit()
        this.searchDataInit()
        this.searchParamsDataInit()
        this.queryUsersList(this.QUERYTYPE.INITIAL_QUERY);

        this.$message.success('Delete User success');
      })
      .catch(error => {

        this.addDataInit()
        this.editDataInit()
        this.searchDataInit()
        this.searchParamsDataInit()
        this.queryUsersList(this.QUERYTYPE.INITIAL_QUERY);

        this.$message.error('Delete User failed');
      });
    },

  }
};
</script>

<style scoped>
.mb-20 {
  margin-bottom: 20px;
}

.mt-20 {
  margin-top: 20px;
}

.text-right {
  text-align: right;
}

.custom-small-button {
  padding: 5px 10px;
  font-size: 12px;
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #fff;
  padding: 60px;
  border-radius: 5px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
.close {
  color: #aaa;
  float: right;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
}

</style>