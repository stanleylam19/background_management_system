import React, {Component} from 'react'
import { Card, Button, Table, Modal, message } from 'antd'
import {formatDate} from '../../utils/dateUtils'
import LinkButton from '../../components/link-button/link-button'
import {PAGE_SIZE} from '../../utils/constants'
import {reqUsers, reqAddOrUpdateUser, reqDeleteUser} from '../../api/index'
import UserForm from './user-form'

export default class User extends Component {
    
    state = {
        users: [],
        roles: [],
        isShow: false,
    }
    
    initColumns  = () => {
        this.columns = [
          {
            title: 'Username',
            dataIndex: 'username'
          },
          {
            title: 'Email',
            dataIndex: 'email'
          },
          {
            title: 'Phone',
            dataIndex: 'phone'
          },
          {
            title: 'Register Time',
            dataIndex: 'create_time',
            render: formatDate
          },
          {
            title: 'Role',
            dataIndex: 'role_id',
            render: (role_id) => this.roleNames[role_id]
          },
          {
            title: 'operation',
            render: (user) => (
                <span>
                    <LinkButton onClick={() => this.showUpdate(user)}>Change</LinkButton>
                    <LinkButton onClick={() => this.deleteUser(user)}>Delete</LinkButton>
                </span>
            )
          }
        ]
    }
    
    initRoleNames = (roles) => {
        const roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name
            return pre
        }, {})
        this.roleNames = roleNames
    }
    
    deleteUser = (user) => {
        Modal.confirm({
            title: `Are you sure to delete ${user.username}?`,
            onOk: async () => {
                const result = await reqDeleteUser(user._id)
                if(result.status===0){
                    message.success('Delete user successfully')
                    this.getUsers()
                }
            }
        })
    }
    
    showAdd = () => {
        this.user = null
        this.setState({isShow: true})
    }
    
    showUpdate = (user) => {
        this.user = user
        this.setState({
            isShow: true
        })
    }
    
    addOrUpdateUser = async () => {
        
        this.setState({isShow: false})
        
        const user = this.form.getFieldsValue()
        this.form.resetFields()
        
        if (this.user) {
              user._id = this.user._id
        }
        
        const result = await reqAddOrUpdateUser(user)
        if(result.status===0){
            message.success('Added User successfully')
            this.getUsers()
        }
        else {
            message.error('Failed to add user')
        }
    }
    
    getUsers = async () => {
        const result = await reqUsers()
        if(result.status===0){
            const {users, roles} = result.data
            this.initRoleNames(roles)
            this.setState({users, roles})
        }
    }
    
    componentWillMount() {
        this.initColumns()
    }
    
    componentDidMount() {
        this.getUsers()
    }
    
    render(){
        const {users, isShow, roles} = this.state
        const user = this.user || {}
        
        const title = <Button type='primary' onClick={this.showAdd}>Create User</Button>
        
        return (
            <Card title={title}>
                <Table
                    bordered={true}
                    rowKey='_id'
                    dataSource={users}
                    columns={this.columns}
                    pagination={{defaultPageSize: PAGE_SIZE}}
                />
                
                <Modal
                    title={user._id ? "Update User" : "Add User"}
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel={() => {
                        this.form.resetFields()
                        this.setState({isShow: false})
                      }
                    }
                >
                    <UserForm
                        setForm={form => this.form = form}
                        roles={roles}
                        user={user}
                    />
                </Modal>
            </Card>
        )
    }
}