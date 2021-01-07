import React, {Component} from 'react'
import { Card, Select, Input, Button, Icon, Table, message } from 'antd'
import LinkButton from '../../components/link-button/link-button'
import {reqProducts, reqSearchProducts, reqUpdateStatus} from '../../api'
import {PAGE_SIZE} from '../../utils/constants'

const Option = Select.Option

export default class ProductHome extends Component {
    
    state = {
        total: 0,
        products: [],
        loading: false,
        searchName: '',
        searchType: 'productName',
    }
    
    initColumns = () => {
        this.columns = [
            {
                title: 'Product',
                dataIndex: 'name',
            },
            {
                title: 'Description',
                dataIndex: 'desc',
            },
            {
                title: 'Price',
                dataIndex: 'price',
                render: (price) => '￥' + price
            },
            {
                title: 'Status',
                render: (product) => {
                    const {status, _id} = product
                    const newStatus = status === 1 ? 2 : 1
                    
                    return (
                        <span>
                            <Button 
                                type='primary'
                                onClick={() => this.updateStatus(_id, newStatus)}
                            >
                            {status===1 ? 'Withdrawal' : 'on Sale'}
                            </Button>
                            <span>{status===1 ? 'on Sale' : 'Withdrawal'}</span>
                        </span>
                    )
                }
            },
            {
                title: 'Operation',
                render: (product) => {
                    return (
                        <span>
                            <LinkButton onClick={() => this.props.history.push('/product/detail', {product})}>Detail</LinkButton>
                            <LinkButton onClick={() => this.props.history.push('/product/addupdate', product)}>Change</LinkButton>
                        </span>
                    )
                }
            },
        ]
    }
    
    getProducts = async (pageNum) => {
        this.pageNum = pageNum
        this.setState({ loading: true })
        
        const {searchName, searchType} = this.state
        
        let result
        if(searchName) {
            result = await reqSearchProducts({pageNum, pageSize: PAGE_SIZE, searchName, searchType})
        } else {
            result = await reqProducts(pageNum, PAGE_SIZE)
        }

        this.setState({ loading: false })
        if(result.status === 0) {
            const {total, list} = result.data 
            this.setState({
                total,
                products: list
            })
        }
    }
    
    updateStatus = async (productId, status) => {
        const result = await reqUpdateStatus(productId, status)
        if(result.status === 0){
            message.success('Update Product successfully')
            this.getProducts(this.pageNum)
        }
    }
    
    componentWillMount() {
        this.initColumns()
    }
    
    componentDidMount() {
        this.getProducts(1)
    }
    
    render(){
        
        const {total, products, loading, searchName, searchType} = this.state
        
        const title = (
            <span>
                <Select 
                    value={searchType} 
                    style={{width: 180}} 
                    onChange={value => this.setState({searchType: value})}
                >
                    <Option value='productName'>Search by name</Option>
                    <Option value='productDesc'>Search by description</Option>
                </Select>
                <Input 
                    placeholder='keyword'
                    style={{width: 180, margin: '0 15px'}}
                    value={searchName}
                    onChange={event => this.setState({searchName: event.target.value})}
                />
                <Button type='primary' onClick={() => this.getProducts(1)}>Search</Button>
            </span>
        )
        
        const extra = (
            <Button type='primary' onClick={() => this.props.history.push('/product/addUpdate')}>
                <Icon type='plus'/>
                Add Product
            </Button>
        )
        
        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    loading={loading}
                    rowKey='_id'
                    dataSource={products}
                    columns={this.columns}
                    pagination={{
                        current: this.pageNum,
                        total, 
                        defaultPageSize: PAGE_SIZE, 
                        showQuickJumper: true,
                        onChange: this.getProducts
                    }}
                />
            </Card>
            )
    }
}