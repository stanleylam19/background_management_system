import React, {Component} from 'react'
import { Card, Icon, List } from 'antd'
import LinkButton from '../../components/link-button/link-button'
import {BASE_IMG_URL} from '../../utils/constants'
import {reqCategory} from '../../api'

const Item = List.Item

export default class ProductDetail extends Component {
    
    state = {
        cName1: '',
        cName2: '',
    }
    
    async componentDidMount(){
        const {pCategoryId, categoryId} = this.props.location.state.product
        if(pCategoryId === '0'){
            const result = await reqCategory(categoryId)
            const cName1 = result.data.name
            this.setState({cName1})
        } else {
            const result = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
            const cName1 = result[0].data.name
            const cName2 = result[1].data.name
            
            this.setState({
                cName1,
                cName2
            })
        }
    }
    
    render(){
        
        const {name, desc, price, detail, imgs} = this.props.location.state.product
        const {cName1, cName2} = this.state
        
        const title = (
            <span>
                <LinkButton>
                    <Icon 
                        type='arrow-left' 
                        style={{color: 'green', marginRight: 15, fontSize: 20}}
                        onClick={() => this.props.history.goBack()}
                    />
                </LinkButton>
                <span>Product Detail</span>
            </span>
        )
        return (
            <Card title={title} className='productDetail'>
                <List>
                    <Item className="item">
                        <span className="left">Product Name:</span>
                        <span>{name}</span>
                    </Item>
                    <Item>
                        <span className="left">Product Description:</span>
                        <span>{desc}</span>
                    </Item>
                    <Item>
                        <span className="left">Product Price:</span>
                        <span>￥{price}</span>
                    </Item>
                    <Item>
                        <span className="left">Product Category:</span>
                        <span>{cName1} {cName2 ? '-->' + cName2 : ''}</span>
                    </Item>
                    <Item>
                        <span className="left">Product Image:</span>
                        <span>
                        {
                            imgs.map(img => (
                                <img
                                    key = {img}
                                    className = "productImg"
                                    src = {BASE_IMG_URL + img}
                                    alt = "img"
                                />
                            ))
                        }
                        </span>
                    </Item>
                    <Item>
                        <span className="left">Product Detail:</span>
                        <span dangerouslySetInnerHTML={{__html: detail}}></span>
                    </Item>
                </List>
            </Card>
        )
    }
}