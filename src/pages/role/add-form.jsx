import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Form, Input } from 'antd'

const Item = Form.Item

class AddForm extends Component {
    
    static propTypes = {
        setForm: PropTypes.func.isRequired
    }
    
    componentWillMount() {
        this.props.setForm(this.props.form)
    }
    
    render() {
        const {getFieldDecorator} = this.props.form
        
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 8 }
        }
        
        return (
            <Form>
                <Item label='Role Name: ' {...formItemLayout}>
                {
                    getFieldDecorator('roleName', {
                        initialValue: '',
                        rules: [
                            {required: true, message: 'Please input a role name'}
                        ]
                      })(
                        <Input placeholder='Input a role name'/>
                    )
                }
                </Item>
            </Form>
        )
    }
}
export default Form.create()(AddForm)