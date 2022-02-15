import { useState } from 'react';

import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';

import ActionDialog from '../../Dialog/ActionDialog';

import "./BlogList.css"
import axios from 'axios';
import Cookies from 'js-cookie';

const BlogList = ({id, title, content, time,friendstatus, refresh, index}) => {

    /*Delete Dialog */
    const [isDelete , setIsDelete] = useState(false);
    
    const openDeleteDialog = () =>{
        setIsDelete(true);
    }
    
    const closeDeleteDialog = () =>{
        setIsDelete(false);        
    }
    
    /*Snackbar */
    const [isDeleted , setIsDeleted] = useState(false);
    const openDeleted = () =>{
        setIsDeleted(true);
    }

    const closeDeleted = () =>{
        setIsDeleted(false)
    }


    /* Delete Blog Function */
    const deleteBlog = () =>{
        axios.delete(`${localStorage.getItem('url')}/blog/delete/${id}`, {
            headers : {
                Authorization : "Bearer " + Cookies.get('token')
            }
        })
        .then((response)=>{
            openDeleted();
            window.location.reload();
        }).catch((err)=>{
            if(err.response.status === 401){
                if(err.response.data.message === "Access Token Expired"){
                    refresh();
                }else if(err.response.data.message === "Unauthorized"){
                    alert(err.response.data.message)
                }
            }else{
                alert(err.message);
            }
        })
    }
    
    /*Edit Blog*/
    const [isEdit, setIsEdit] = useState(false);
    const [editTitle, setEditTitle] = useState();
    const [editContent , setEditContent] = useState();

    const openEdit = () =>{
        setEditTitle(title)
        setEditContent(content)
        setIsEdit(true)
    }

    const closeEdit = () =>{
        setIsEdit(false)
    }

    const changeTitle = (event)=>{
        setEditTitle(event.target.value);
    }

    const changeContent = (event) =>{
        setEditContent(event.target.value);
    }

    const [isEdited , setIsEdited] = useState(false);
    
    const openEdited = () =>{
        setIsEdited(true);
    }

    const closeEdited = () =>{
        setIsEdited(false)
    }

    const enableSubmit = () =>{
        if(editTitle.length <= 0 || editContent.length <= 0 ){
            return true
        }else{
            return false
        }
    }

    const editBlog = (blogId) =>{
        axios.post(`${localStorage.getItem('url')}/blog/edit/${blogId}`, {
            Title : editTitle,
            Content : editContent
        }, {
            headers : {
                Authorization : "Bearer " + Cookies.get('token')
            }
        }).then((response)=>{
            if(response.status === 200){
                if(response.data.message === "Blog Updated"){
                    openEdited()
                    window.location.reload();
                }else{
                    console.log(response.data)
                }
            }
        }).catch((err)=>{
            if(err.response.status === 401){
                if(err.response.data.message === "Access Token Expired"){
                    refresh();
                }
            }else{
                alert(err.message);
            }
        })
    }

    /* time uploaded in second */
    const timeDifference = () =>{
        const timedif = Date.now() - time
        // Convert MilliSecond to Second
        const difInSecond = Math.floor(timedif / 1000);
        return difInSecond
    }


    return ( 
        <div className="BlogList-container">
            <div className="BlogList-header">
                <div className="BlogList-header-wrapper">
                    <div className="BlogList-title">
                        {
                            isEdit ? 
                            <TextField 
                                placeholder="Please Enter Title"
                                id="standard-basic" 
                                variant="outlined" 
                                size='small'
                                inputProps={{maxLength : 20}}
                                fullWidth 
                                required
                                value={editTitle}
                                onChange={changeTitle}
                                helperText={`${editTitle.length}/20`}
                            />
                            :
                            <h4>{title}</h4>
                        }
                    </div>
                    <div className="BlogList-time">
                        {/* {timeDifference()} */}
                        {
                            // More than a day
                            timeDifference() >= 86400 ? 
                                timeDifference() / 86400 === 1 ?
                                `${Math.floor(timeDifference() / 86400)} day ago`
                                : 
                                `${Math.floor(timeDifference() / 86400)} days ago`
                            :
                            // More than a hour
                            timeDifference() >= 3600
                            ?
                                `${Math.floor(timeDifference() / 3600)} hours ago`
                            :
                            // More than a minute
                            timeDifference() >= 60 
                            ?
                                `${Math.floor(timeDifference() / 60)} mins ago`
                            :
                                `${timeDifference()} seconds ago`
                        }
                    </div>
                </div>
                    <div className="BlogList-actions" style={{display : isEdit ? 'none' : ''}}>
                    
                        {
                            Boolean(friendstatus.self) ?
                                isEdit ? 
                                    <></>
                                :
                                    <Stack
                                        spacing={2}
                                        direction="row"
                                    >
                                        <IconButton size="small" aria-label="edit" onClick={openEdit}>
                                            <EditIcon color="primary" fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" aria-label="delete" onClick={openDeleteDialog}>
                                            <DeleteIcon color="error" fontSize="small" />
                                        </IconButton>
                                    </Stack>
                                :
                                    <></>
                        }
                    </div>
            </div>
            <div className="BlogList-content">
                {
                    isEdit ? 
                    <TextField
                        placeholder="Please Enter Content"
                        multiline
                        fullWidth
                        rows={4}
                        maxRows={4}
                        value={editContent}
                        onChange={changeContent}
                        inputProps={{maxLength : 500}}
                        required
                        helperText={`${editContent.length}/500`}
                    />
                    :
                    content
                }
                {/* <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p> */}
            </div>
            <div className="BlogList-footer">
                {
                    Boolean(friendstatus.self)
                    ?
                    isEdit 
                    ? 
                    <Stack
                        spacing={2}
                        direction="row"
                        style={{display : 'flex' , justifyContent : "right", marginRight: "20px"}}
                    >
                          <Button variant="contained" color="error" onClick={closeEdit} >Cancel</Button>
                          <Button variant="contained" onClick={()=>{editBlog(id)}} disabled={enableSubmit()} >Edit Blog</Button>
                    </Stack>
                    :
                    <></>
                    :
                    <Stack
                        spacing={3}
                        direction="row"
                    >
                        <IconButton size="small" aria-label="like">
                            <ThumbUpOffAltIcon  fontSize="small" />
                        </IconButton>
                        <IconButton size="small" aria-label="dislike">
                            <ThumbDownOffAltIcon  fontSize="small" />
                        </IconButton>
                    </Stack>
                }
            </div>

            <ActionDialog open={isDelete} handleClose={closeDeleteDialog} message={`Delete this Blog ?`} action={deleteBlog}/>

            <Snackbar
                open={isDeleted}
                onClose={closeDeleted}
                autoHideDuration={1500}
            >
                <Alert severity='success'>
                    Blog Deleted
                </Alert>
            </Snackbar>

            <Snackbar
                open={isEdited}
                onClose={closeEdited}
                autoHideDuration={1500}
            >
                <Alert severity='success'>
                    Blog Edited
                </Alert>
            </Snackbar>
        </div>
    );
}
 
export default BlogList;