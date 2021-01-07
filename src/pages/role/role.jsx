import React, {Component} from 'react'
import { Card, Button, Table, message, Modal } from 'antd'
import {PAGE_SIZE} from '../../utils/constants'
import {reqRoles, reqAddRole, reqUpdateRole} from '../../api'
import AddForm from './add-form'
import AuthForm from './auth-form'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import {formatDate} from '../../utils/dateUtils'

export default class Role extends Component {
    
    state = {
        roles: [],
        role: {},
        isShowAddRole: false,
        isShowAuth: false
    }
    
    getRoles = async () => {
        const result = await reqRoles()
        if(result.status===0){
            const roles = result.data
            this.setState({roles})
        }
    }
    
    constructor(props) {
        super(props)
        
        this.auth = React.createRef()
    }
    
    initColumn = () => {
        this.columns = [
            {
                title: 'Role Name',
                dataIndex: 'name'
            },
            {
                title: 'Create Time',
                dataIndex: 'create_time',
                render: (create_time) => formatDate(create_time)
            },
            {
                title: 'Auth Time',
                dataIndex: 'auth_time',
                render: formatDate
            },
            {
                title: 'Auth Name',
                dataIndex: 'auth_name'
            }
        ]
    }
    
    onRow = (role) => {
        return {
            onClick: event => {
                this.setState({
                  role
                })
            }
        }
    }
    
    addRole = () => {
        this.form.validateFields(async (error, values) => {
            if(!error){
                this.setState({isShowAddRole: false})
                const {roleName} = values
                this.form.resetFields()
                console.log(roleName)
                const result = await reqAddRole(roleName)
                if(result.status === 0) {
                    message.success('Add Role Successfully')
                    const role = result.data
                    this.setState(state => ({
                        roles: [...state.roles, role]
                      })
                    )
                } else {
                    message.error('Add Role Failed')
                }
            }
        })
    }
    
    updateRole = async () => {
        
        this.setState({
            isShowAuth: false
        })
        
        const role = this.state.role
        const menus = this.auth.current.getMenus()
        role.menus = menus
        role.auth_name = memoryUtils.user.username
        role.auth_time = Date.now()
        
        const result = await reqUpdateRole(role)
        if(result.status===0){
            if(role._id === memoryUtils.user.role_id){
                memoryUtils.user = {}
                storageUtils.removeUser()
                this.props.history.replace('/login')
                message.success('The privilege of the current user has changed, Please login again')
            } else {
                message.success('Role privilege has set')
                this.setState({
                    roles: [...this.state.roles]
                })
            }
        } else {
            message.error('Failed to set role privilege')
        }
    }
    
    componentWillMount() {
        this.initColumn()
    }
    
    componentDidMount(){
        this.getRoles()
    }
    
    render(){
        
        const {roles, role, isShowAddRole, isShowAuth} = this.state
        
        const title = (
            <span>
                <Button type='primary' onClick={() => this.setState({isShowAddRole: true})}>Create Role</Button>
                &nbsp;&nbsp;
                <Button type='primary' disabled={!role._id} onClick={() => this.setState({isShowAuth: true})}>Set Role Privilege</Button>
            </span>
        )
        
        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={roles}
                    columns={this.columns}
                    pagination={{defaultPageSize: PAGE_SIZE}}
                    rowSelection={
                      {
                        type: 'radio', 
                        selectedRowKeys: [role._id],
                        onSelect: (role) => { // 选择某个radio时回调
                        this.setState({
                            role
                          })
                        }
                      }
                    }
                    onRow={this.onRow}
                />
                
                <Modal
                    title="Add Role"
                    visible={isShowAddRole}
                    onOk={this.addRole}
                    onCancel={() => { 
                        this.setState({isShowAddRole: false})
                        this.form.resetFields()
                      }
                    }
                >
                    <AddForm
                        setForm={(form) => this.form = form}
                    />
                </Modal>
                
                <Modal
                    title="Set Role Privilege"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={() => { 
                        this.setState({isShowAuth: false})
                      }
                    }
                >
                    <AuthForm ref={this.auth} role={role}/>
                </Modal>
            </Card>
        )
    }
}