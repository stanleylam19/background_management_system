import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import { Form, Select, Input } from 'antd'

const Item = Form.Item
const Option = Select.Option

class UserForm extends PureComponent {
    
    static propTypes = {
        setForm: PropTypes.func.isRequired,
        roles: PropTypes.array.isRequired,
        user: PropTypes.object
    }
    
    componentWillMount() {
        this.props.setForm(this.props.form)
    }
    
    render() {
        const {roles} = this.props
        const user = this.props.user || {}
        const {getFieldDecorator} = this.props.form
        
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 15 }
        }
        
        return (
            <Form {...formItemLayout}>
                <Item label='Username' >
                {
                    getFieldDecorator('username', {
                        initialValue: user.username,
                        rules: [
                            {required: true, message: 'Please input username'}
                        ]
                      })(
                        <Input placeholder='Please input username'/>
                    )
                }
                </Item>
                {
                    user._id ? null :
                    <Item label='Password' >
                    {
                        getFieldDecorator('password', {
                            initialValue: user.password,
                            rules: [
                                {required: true, message: 'Please input password'}
                            ]
                          })(
                            <Input type='password' placeholder='Please input password'/>
                        )
                    }
                    </Item>
                }
                <Item label='Phone' >
                {
                    getFieldDecorator('phone', {
                        initialValue: user.phone,
                        rules: [
                            {required: true, message: 'Please input a phone number'}
                        ]
                      })(
                        <Input placeholder='Please input a phone number'/>
                    )
                }
                </Item>
                <Item label='Email' >
                {
                    getFieldDecorator('email', {
                        initialValue: user.email,
                        rules: [
                            {required: true, message: 'Please input an email'}
                        ]
                      })(
                        <Input placeholder='Please input an email'/>
                    )
                }
                </Item>
                <Item label='Role' >
                {
                    getFieldDecorator('role_id', {
                        initialValue: user.role_id,
                        rules: [
                            {required: true, message: 'Please input a role'}
                        ]
                      })(
                        <Select placeholder=''>
                        {
                            roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                        }
                        </Select>
                    )
                }
                </Item>
            </Form>
        )
    }
}
export default Form.create()(UserForm)