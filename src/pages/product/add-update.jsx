import React, {Component} from 'react'
import { Card, Icon, Form, Input, Cascader, Button, message } from 'antd'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'
import LinkButton from '../../components/link-button/link-button'
import {reqCategorys, reqAddOrUpdateProduct} from '../../api' 

const {Item} = Form
const {TextArea} = Input

class ProductAddUpdate extends Component {
    
    state = {
        options: []
    }
    
    constructor(props) {
        super(props)
        
        this.pw = React.createRef()
        this.editor = React.createRef()
    }
    
    initOptions = async (categorys) => {
        const options = categorys.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false
          })
        )
        
        const {isUpdate, product} = this
        const {pCategoryId} = product
        if(isUpdate && pCategoryId !== '0'){
            const subCategorys = await this.getCategorys(pCategoryId)
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true
              })
            )
            
            const targetOption = options.find(option => option.value === pCategoryId)
            
            targetOption.children = childOptions
        }
        
        this.setState({
            options
        })
    }
    
    getCategorys = async (parentId) => {
        const result = await reqCategorys(parentId)
        if(result.status===0){
            const categorys = result.data
            
            if(parentId==='0') {
                this.initOptions(categorys)
            } else {
                return categorys
            }
        }
    }
    
    validatePrice = (rule, value, callback) => {
        if(value*1 > 0) {
            callback()
        } else {
            callback('Price must be greater than 0')
        }
    }
    
    loadData = async selectedOptions => {
        const targetOption = selectedOptions[0]
        targetOption.loading = true
        const subCategorys = await this.getCategorys(targetOption.value)
        targetOption.loading = false
        if(subCategorys && subCategorys.length > 0) {
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true
              })
            )
            targetOption.children = childOptions
        } else {
            targetOption.isleaf = true
        }
        
        this.setState({
          options: [...this.state.options],
        })
    }
    
    submit = () => {
        this.props.form.validateFields(async (error, values) => {
            if(!error){
                
                const {name, desc, price, categoryIds} = values
                let pCategoryId, categoryId
                if(categoryIds.length===1) {
                    pCategoryId = '0'
                    categoryId = categoryIds[0]
                } else {
                    pCategoryId = categoryIds[0]
                    categoryId = categoryIds[1]
                }
                
                const imgs = this.pw.current.getImgs()
                const detail = this.editor.current.getDetail()
                
                const product = {name, desc, price, imgs, detail, pCategoryId, categoryId}
                
                if(this.isUpdate) {
                    product._id = this.product._id
                }
                
                console.log(product)
                
                const result = await reqAddOrUpdateProduct(product)
                
                if(result.status===0) {
                    message.success(`${this.isUpdate ? 'Update' : 'Add'} product successfully`)
                    this.props.history.goBack()
                } else {
                    message.error(`${this.isUpdate ? 'Update' : 'Add'} product failed`)
                }
            }
        })
    }
    
    componentWillMount() {
        const product = this.props.location.state
        this.isUpdate = !!product
        this.product = product || {}
    }
    
    componentDidMount(parentId) {
        this.getCategorys('0')
    }
    
    render(){
        
        const {isUpdate, product} = this
        const {pCategoryId, categoryId, imgs, detail} = product
        
        const categoryIds = []
        if(isUpdate) {
            if(pCategoryId==='0'){
                categoryIds.push(categoryId)
            } else {
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        }
        
        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 10},
        }
        
        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <Icon type='arrow-left' style={{fontSize: 20}}/>
                </LinkButton>
                <span>{isUpdate ? 'Update Product' : 'Add Product'}</span>
            </span>
        )
        
        const {getFieldDecorator} = this.props.form
        
        
        return (
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Item label="Product Name">
                    {
                        getFieldDecorator('name', {
                            initialValue: product.name,
                            rules: [
                                {required: true, message: 'Please input a product name'}
                            ]
                        })(
                            <Input placeholder='Please input product name' />
                        )
                    }
                    </Item>
                    <Item label="Product Description">
                    {
                        getFieldDecorator('desc', {
                            initialValue: product.desc,
                            rules: [
                                {required: true, message: 'Please input a product description'}
                            ]
                        })(
                            <TextArea placeholder='Please input product description' autoSize={{minRows: 2, maxRows: 6}} />
                        )
                    }
                    </Item>
                    <Item label="Product Price">
                    {
                        getFieldDecorator('price', {
                            initialValue: product.price,
                            rules: [
                                { required: true, message: 'Please input a product price' },
                                { validator: this.validatePrice }
                            ]
                        })(
                            <Input type='number' placeholder='Please input product price' prefix="￥"/>
                        )
                    }
                    </Item>
                    <Item label="Product Category">
                    {
                        getFieldDecorator('categoryIds', {
                            initialValue: categoryIds,
                            rules: [
                                {required: true, message: 'Product category is needed'},
                            ]
                        })(
                            <Cascader
                              placeholder='Please assign a product category'
                              options={this.state.options}
                              loadData={this.loadData}
                            />
                        ) 
                    }
                    </Item>
                    <Item label="Product Image">
                        <PicturesWall ref={this.pw} imgs={imgs}/>
                    </Item>
                    <Item label="Product Detail" labelCol={{span: 4}} wrapperCol={{span: 16}}>
                        <RichTextEditor ref={this.editor} detail={detail}/>
                    </Item>
                    <Item>
                        <Button type='primary' onClick={this.submit}>Submit</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}
export default Form.create()(ProductAddUpdate)