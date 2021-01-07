import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {Modal} from 'antd'

import LinkButton from '../link-button/link-button'
import menuList from '../../config/menuConfig'
import {formatDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

import './header.less'

class Header extends Component {
    
    state = {
        currentTime: formatDate(Date.now()),
    }
    
    getTime = () => {
        this.intervalId = setInterval(() => {
            const currentTime = formatDate(Date.now())
            this.setState({currentTime})
        }, 1000)
    }
    
    getTitle = () => {
        const path = this.props.location.pathname
        let title 
        
        menuList.forEach(item => {
            if(item.key === path) {
                title = item.title
            } else if (item.children) {
                const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
                if(cItem) {
                    title = cItem.title
                }
            }
        })
        return title
    }
    
    logout = () => {
        Modal.confirm({
            content: "Are you sure to logout?",
            onOk: () => {
                storageUtils.removeUser()
                memoryUtils.user = {}
                this.props.history.replace('/login')
            }
        })
    }
    
    componentDidMount() {
        this.getTime()
    }
    
    componentWillUnmount() {
        clearInterval(this.intervalId)
    }
    
    render(){
        const {currentTime} = this.state
        const username = memoryUtils.user.username
        const title = this.getTitle()
        
        return (
            <div className="header">
                <div className="header-top">
                    <span>Welcome, {username}</span>
                    <LinkButton onClick={this.logout}>Logout</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                    <span>{currentTime}</span>
                    </div>
                </div>
            </div>
            )
    }
}
export default withRouter(Header)