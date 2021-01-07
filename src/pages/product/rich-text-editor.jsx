import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

export default class RichTextEditor extends Component {
    
    static propTypes = {
        detail: PropTypes.string
    }
    
    state = {
        editorState: EditorState.createEmpty()
    }
    
    constructor(props){
        super(props)
        const html = this.props.detail
        if(html){
            const contentBlock = htmlToDraft(html)
            const contentState = ContentState.createFromBlockArray(contentBlock)
            const editorState = EditorState.createWithContent(contentState)
            this.state = {
                editorState
            }
        } else {
            this.state = {
                editorState: EditorState.createEmpty()
            }
        }
    }
    
    onEditorStateChange = (editorState) => {
        this.setState({
            editorState
        })
    }
    
    uploadLimageCallBack = (file) => {
        return new Promise(
            (resolve, reject) => {
                const xhr = new XMLHttpRequest()
                xhr.open('POST', '/manage/img/upload')
                xhr.setRequestHeader('Authorization', 'Client-ID XXXXX')
                const data = new FormData()
                data.append('image', file)
                xhr.send(data)
                xhr.addEventListener('load', () => {
                    const response = JSON.parse(xhr.responseText)
                    const url = response.data.url
                    resolve(url)
                })
                xhr.addEventListener('error', () => {
                    const error =JSON.parse(xhr.responseText)
                    reject(error)
                })
            }
        )
    }
    
    getDetail = () => {
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    }
    
    render(){
        const { editorState } = this.state
        return (
            <Editor
                editorState={editorState}
                editorStyle={{border: '1px solid black', minHeight: 200, paddingLeft: 10}}
                onEditorStateChange={this.onEditorStateChange}
            />
        )
    }
}