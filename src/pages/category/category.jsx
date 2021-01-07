import React, {Component} from 'react'
import { Card, Table, Button, Icon, message, Modal } from 'antd'
import LinkButton from '../../components/link-button/link-button'
import {reqCategorys, reqUpdateCategory, reqAddCategory} from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'

export default class Category extends Component {

    state = {
        loading: false,
        categorys: [],
        subCategorys: [],
        parentId: '0',
        parentName: '',
        modalShowStatus: 0, // 0: neither, 1: show add, 2： show update
    }
    
    initColumns = () => {
        this.columns = [
            {
                title: 'Name of Category',
                dataIndex: 'name'
            },
            {
                title: 'operation',
                width: 300,
                render: (category) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdateModal(category)}>Update category</LinkButton>
                        {this.state.parentId === '0' ? 
                            <LinkButton onClick={() => this.showSubCategorys(category)}>
                                Show sub-category
                            </LinkButton>
                            : null
                        }
                    </span>
                )
            }
        ]
    }
    
    getCategorys = async (parentId) => {
        this.setState({loading: true})
        parentId = parentId || this.state.parentId
        const result = await reqCategorys(parentId)
        this.setState({loading: false})
        if(result.status === 0){
            const categorys = result.data
            if(parentId==='0'){
                this.setState({ categorys: categorys })
            } else {
                this.setState({ subCategorys: categorys })
            }
        } else {
            message.error("Failed to get categorys list!")
        }
    }
    
    showCategorys = () => {
        this.setState({
            parentId: '0',
            parentName: '',
            subCategorys: []
        })
    }
    
    showSubCategorys = (category) => {
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => {
              this.getCategorys()
        })
    }
    
    showAddModal = () => {
        this.setState({ modalShowStatus: 1 })
    }
    
    addCategory = () => {
        this.form.validateFields(async (err, values) => {
            if(!err) {
                this.setState({ modalShowStatus: 0 })
                const {parentId, categoryName} = values
                this.form.resetFields()
                const result = await reqAddCategory(categoryName, parentId)
                if(result.status === 0){
                    if(parentId === this.state.parentId) {
                        this.getCategorys()
                    } else if (parentId === '0') {
                        this.getCategorys('0')
                    }
                }
            }
        })
    }
    
    showUpdateModal = (category) => {
        this.category = category
        this.setState({ modalShowStatus: 2 })
    }
    
    updateCategory = () => {
        this.form.validateFields(async (err, values) => {
            if(!err) {
                this.setState({ modalShowStatus: 0 })
        
                const categoryId = this.category._id
                const {categoryName} = values
                this.form.resetFields()
                const result = await reqUpdateCategory({categoryId, categoryName})
                if(result.status === 0) {
                    console.log(result)
                    this.getCategorys()
                } else {
                    console.log(result)
                }
            }
        })
    }
    
    handleCancel = () => {
        this.form.resetFields()
        this.setState({ modalShowStatus: 0})
    }
    
    componentWillMount() {
        this.initColumns()
    }
    
    componentDidMount() {
        this.getCategorys()
    }

    render(){
        
        const {categorys, subCategorys, parentId, parentName, loading, modalShowStatus} = this.state
        const category = this.category || {}
        
        const title = parentId === '0' ? 'List' : (
            <span>
                <LinkButton onClick={this.showCategorys}>List</LinkButton>
                <Icon type='arrow-right' style={{marginRight: 5}}></Icon>
                <span>{parentName}</span>
            </span>
        )
        const extra = (
            <Button type='primary' onClick={this.showAddModal}>
                <Icon type='plus'></Icon>
                Add More
            </Button>
        )
        
        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered={true}
                    rowKey='_id'
                    loading={loading}
                    dataSource={parentId==='0' ? categorys : subCategorys}
                    columns={this.columns}
                    pagination={{defaultPageSize: 5, showQuickJumper: true}}
                />
                
                <Modal
                    title="Add Category"
                    visible={modalShowStatus === 1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <AddForm 
                        categorys={categorys}
                        parentId={parentId}
                        setForm={(form) => {this.form = form}}
                    />
                </Modal>
                
                <Modal
                    title="Update Category"
                    visible={modalShowStatus === 2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    <UpdateForm 
                        categoryName={category.name} 
                        setForm={(form) => {this.form = form}}
                    />
                </Modal>
            </Card>
            )
    }
}