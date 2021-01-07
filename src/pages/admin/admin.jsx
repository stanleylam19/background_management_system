import React, {Component} from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import { Layout } from 'antd'

import memoryUtils from '../../utils/memoryUtils'
import Header from '../../components/header/header'
import LeftNav from '../../components/left-nav/left-nav'

import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'

const { Footer, Sider, Content } = Layout

export default class Admin extends Component {
    
    render() {
        const user = memoryUtils.user
        if(!user || !user._id) {
            return <Redirect to='/login/'/>
        }
        return(
            <Layout style={{minHeight: '100%'}}>
                <Sider>
                    <LeftNav/>
                </Sider>
                <Layout>
                    <Header>Header</Header>
                    <Content style={{margin: '20px', backgroundColor: '#fff'}}>
                        <Switch>
                            <Route path='/home' component={Home}/>
                            <Route path='/category' component={Category}/>
                            <Route path='/product' component={Product}/>
                            <Route path='/role' component={Role}/>
                            <Route path='/user' component={User}/>
                            <Redirect to='/home'/>
                        </Switch>
                    </Content>
                    <Footer style={{textAlign: 'center', color: '#888888'}}>It is recommended to use Google Chrome for better user experience </Footer>
                </Layout>
            </Layout>
        )
    }
}