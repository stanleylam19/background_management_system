import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Form, Select, Input } from 'antd'

const Item = Form.Item
const Option = Select.Option

class AddForm extends Component {
    
    static propTypes = {
        setForm: PropTypes.func.isRequired,
        categorys: PropTypes.array.isRequired,
        parentId: PropTypes.string.isRequired
    }
    
    componentWillMount() {
        this.props.setForm(this.props.form)
    }
    
    render() {
        const {categorys, parentId} = this.props
        const {getFieldDecorator} = this.props.form
        return (
            <Form>
                <Item>
                    {
                        getFieldDecorator('parentId', {initialValue: parentId})(
                            <Select>
                                <Option value='0'>Category</Option>
                                {
                                    categorys.map(c => <Option value={c._id}>{c.name}</Option>)
                                }
                            </Select>
                        )
                    }
                </Item>
                <Item>
                {
                    getFieldDecorator('categoryName', {
                        initialValue: '',
                        rules: [
                            {required: true, message: 'Please input a name'}
                        ]
                      })(
                        <Input placeholder='Please input the name of category'/>
                    )
                }
                </Item>
            </Form>
        )
    }
}
export default Form.create()(AddForm)