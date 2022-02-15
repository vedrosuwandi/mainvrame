import React, {useState} from 'react'
import axios from 'axios';

import {Form} from 'react-bootstrap'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


import Navbar from '../Components/Header/Navbar';

import '../Style/PostsBlog.css'
import Cookies from 'js-cookie';

const PostsBlog = ({user, logout, refresh}) => {

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const titleChange = (event)=>{
        setTitle(event.target.value);
    }

    const contentChange = (event) =>{
        setContent(event.target.value);
    }

    
    const [isSnackbarOpen, setIsOpenSnackbar] = useState(false);
    
    const openSnackbar = () =>{
        setIsOpenSnackbar(true);
    }
    
    const closeSnackbar = () =>{
        setIsOpenSnackbar(false)
    }
    
    if(!user.Contact){
        return null;
    }

 
    /*Disable and Enable Upload Post */
    const enableSubmit = () =>{
        if(title.length <= 0 || content.length <= 0){
            return true
        }else{
            return false
        }
    }

    const PostBlog = () =>{
        axios.post(`${localStorage.getItem('url')}/blog/posts`, {
            Title : title,
            Content : content
        }, {
            headers : {
                Authorization : "Bearer " + Cookies.get('token')
            }
        }).then((response)=>{
            if(response.status === 200){
                openSnackbar();
                window.location.href = `/users/${user.Username}`
            }
        }).catch((err)=>{
            if(err.response.status === 401){
                if(err.response.data.message === "Access Token Expired"){
                    refresh();
                }
            }else{
                console.log(err.response);
            }
        })
    }

    

    return (
        <div className='postsBlog-container'>
            <div className="postsBlog-navbar">
                <Navbar user={user} logout={logout} showSearchbar={true} />
            </div>
            <div className="postsBlog-container-wrapper">
                <div className="postsBlog-title">
                    <h3>
                        Create Blog
                    </h3>
                </div>
                <Divider />
                <div className="postsBlog-form">
                    <Form onSubmit={PostBlog}>
                        <div className="postsBlog-form-title">
                            <p style={{padding:"10px"}}>Title</p>
                            <TextField 
                                placeholder="Please Enter Title"
                                id="standard-basic" 
                                variant="outlined" 
                                size='small'
                                inputProps={{maxLength : 20}}
                                fullWidth 
                                required
                                value={title}
                                onChange={titleChange}
                                helperText={`${title.length}/20`}
                            />
                        </div>
                        <div className="postsBlog-form-content">
                            <p style={{padding:"10px"}}>Content</p>
                            <TextField
                                placeholder="Please Enter Content"
                                multiline
                                fullWidth
                                rows={7}
                                maxRows={4}
                                value={content}
                                onChange={contentChange}
                                inputProps={{maxLength : 500}}
                                required
                                helperText={`${content.length}/500`}
                            />
                        </div>
                        <div className="postsBlog-form-submit">
                            <Button variant="contained" type="submit" disabled={enableSubmit()} >Upload Post</Button>
                        </div>
                    </Form>
                </div>
            </div>
            <Snackbar
                autoHideDuration={1500}
                open={isSnackbarOpen}
                onClose={closeSnackbar}
            >
                <Alert severity="success">Blog is Posted</Alert>
            </Snackbar>
        </div>
    )
}

export default PostsBlog
