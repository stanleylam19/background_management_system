import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import { Form, Icon, Input, Button, message } from 'antd'

import './login.less'
import logo from '../../assets/images/logo.png'
import {reqLogin} from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

const Item = Form.Item

class Login extends Component {
    
    handleSubmit = (event) => {
        event.preventDefault()
        
        this.props.form.validateFields(async (err, values) => {
            if(!err){
                const {username, password} = values
                const result = await reqLogin(username, password)
                if(result.status === 0) { // login success
                    message.success('login success')
                    const user = result.data
                    memoryUtils.user = user
                    storageUtils.saveUser(user)
                    this.props.history.replace('/')
                } else { //login fail
                    message.error(result.msg)
                }
            } else {
                console.log('verification failed!')
            }
        });
        
        //const form = this.props.form
        //const values = form.getFieldsValue()
    }
    
    validatePwd = (rule, value, callback) => {
        if(!value){
            callback("Password cannot be empty")
        } else if (value.length < 4) {
            callback("Password length cannot be lesser than 4")
        } else if (value.length > 12) {
            callback("Password length cannot be greater than 12")
        } else if (!/^[a-zA-Z0-9]+$/.test(value)){
            callback("Password must contain only English letters and numbers")
        } else {
            callback()
        }
    }
    
    render() {
        
        const user = memoryUtils.user
        if(user && user._id) {
            return <Redirect to='/'/>
        }
        
        const form = this.props.form
        const {getFieldDecorator} = form;
        
        return(
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo"/>
                    <h1>React Project: Background Management System</h1>
                </header>
                <section className="login-content">
                    <h2>User Login</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Item>
                        {
                            getFieldDecorator('username', {
                                rules: [
                                { required: true, message: "Please input your username!" },
                                { min: 4, message: "Username contains at least 4 characters!" },
                                { max: 12, message: "Username contains at most 12 characters!" },
                                { pattern: /^[a-zA-Z0-9_]+$/, message: "Username must contain only English letters, numbers or underscore!" },
                              ],
                            })(
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="Username"
                            />
                            )
                        }
                        </Item>
                        <Item>
                        {
                            getFieldDecorator('password', {
                            rules: [{ validator: this.validatePwd }]
                            })(
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(221,0,0,.25)' }} />}
                                type="password"
                                placeholder="Password"
                            />
                            )
                        }
                        </Item>
                        <Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Log in
                            </Button>
                        </Item>
                    </Form>
                </section>
            </div>
        )
    }
}
const WrapLogin = Form.create()(Login)
export default WrapLogin