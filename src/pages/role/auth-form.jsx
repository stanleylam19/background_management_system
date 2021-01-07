import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Tree } from 'antd'
import menuList from '../../config/menuConfig'

const Item = Form.Item
const { TreeNode } = Tree;

export default class AuthForm extends PureComponent {
    
    static propTypes = {
        role: PropTypes.object
    }
    
    state = {
        checkedKeys: []
    }
    
    constructor(props) {
        super(props)
        
    const {menus} = this.props.role
        this.state = {
            checkedKeys: menus
        }
    }
    
    getMenus = () => this.state.checkedKeys
    
    getTreeNodes = (menuList) => {
        return menuList.reduce((pre, item) => {
            pre.push(
                <TreeNode title={item.title} key={item.key}>
                    { item.children ? this.getTreeNodes(item.children) : null }
                </TreeNode>
            )
            return pre
        }, [])
    }
    
    onCheck = checkedKeys => {
        this.setState({ checkedKeys })
    }
    
    componentWillMount() {
        this.treeNodes = this.getTreeNodes(menuList)
    }
    
    componentWillReceiveProps(nextProps) {
        const menus = nextProps.role.menus
        this.setState({
            checkedKeys: menus
        })
    }
    
    render() {
        
        const {role} = this.props
        const {checkedKeys} = this.state

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 15 }
        }
        
        return (
            <div>
                <Item label='Role Name' {...formItemLayout}>
                    <Input value={role.name} disabled/>
                </Item>
                
                <Tree
                    checkable
                    defaultExpandAll={true}
                    checkedKeys={checkedKeys}
                    onCheck={this.onCheck}
                >
                    <TreeNode title="" key="all">
                        {this.treeNodes}
                    </TreeNode>
                </Tree>
            </div>
        )
    }
}
