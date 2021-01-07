import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Upload, Icon, Modal, message } from 'antd'
import { reqDeleteImg } from '../../api'
import { BASE_IMG_URL } from "../../utils/constants"

export default class PicturesWall extends Component {
    
    static propTypes = {
        imgs: PropTypes.array
    }
    
    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [
        /*
            {
                uid: '-1',
                name: 'xxx.png',
                status: 'done',
                url: ''
            }
            */
        ]
    }
    
    constructor (props){
        super(props)
        let fileList = []
        
        const {imgs} = this.props
        if(imgs && imgs.length>0){
            fileList = imgs.map((img, index) => ({
                uid: -index,
                name: img,
                status: 'done',
                url: BASE_IMG_URL + img
              })
            )
        }
        
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList
        }
    }
    
    getImgs = () => {
        return this.state.fileList.map(file => file.name)
    }
    
    handleCancel = () => this.setState({ previewVisible: false })
    
    handlePreview = file => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true
        })
    }
    
    handleChange = async ({ file, fileList }) => {
        if(file.status === 'done'){
            const result = file.response
            if(result.status === 0){
                message.success('Image uploaded successfully')
                const {name, url} = result.data
                file = fileList[fileList.length-1]
                file.name = name
                file.url = url
            } else {
                message.error('Image uploaded Failed')
            }
        } else if(file.status === 'removed') {
            const result = await reqDeleteImg(file.name)
            if(result.status === 0) {
                message.success('Delete image successfully')
            } else {
                message.error('Delete image failed')
            }
        }
        
        this.setState({ fileList })
    }
    
    render(){
        const { previewVisible, previewImage, fileList } = this.state
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div>Upload</div>
            </div>
        )
        return (
            <div>
                <Upload
                    action="/manage/img/upload"
                    accept='image/*'
                    name='image'
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                {fileList.length >= 3 ? null : uploadButton}
                </Upload>
            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
            </div>
            )
    }
}