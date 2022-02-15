import { useEffect , useState} from 'react';
import axios from 'axios';

import BlogList from './BlogList';

import './Blogs.css';

import Pagination from '@mui/material/Pagination';

const Blogs = ({params, friendstatus, refresh}) => {

    const [blogs , setBlogs] = useState([])

    useEffect(()=>{
        // Display Blogs
        axios.get(`${localStorage.getItem('url')}/blog/${params}`)
        .then((response)=>{
            setBlogs(response.data.response);
            // setBlogs(prevState => [...prevState , response.data])
        }).catch((err)=>{
            console.log(err.response);
        })
    },[params])


    // How many Items in one page
    const BlogLimit = 3;
    //Current Page
    const [Blogpage, setBlogPage] = useState(1);


    const changePage = (event, value)=>{
    setBlogPage(value);
    }

    // Visible Paginate
    const VisiblePaginate = ()=>{
        if (blogs.length > BlogLimit){
            // flex
            return true
        }else{
            // none
            return false
        }
    }

    /*Edit Blog*/
   

    return ( 
        <div className="blogs-container">
            {
                blogs
                .slice((Blogpage - 1) * BlogLimit , Blogpage * BlogLimit)
                .map((key, index)=>{
                    return (
                        <BlogList 
                            id={key._id} 
                            title={key.Title} 
                            content={key.Content} 
                            time={key.CreatedAt} 
                            friendstatus={friendstatus} 
                            refresh={refresh} 

                        />
                    )
                })
            }
            <div className="blogs-pagination" style={{display : VisiblePaginate() ? 'flex' : 'none' , paddingBottom : "10px"}}>
                <Pagination 
                    variant="outlined" 
                    page={Blogpage}
                    // Set the Maximum Number of Page 
                    // Ceil - to round the number into the high nearest integer
                    count={Math.ceil(blogs.length / BlogLimit)}
                    onChange={changePage}
                    defaultPage={1}
                    size='medium'
                    showFirstButton
                    showLastButton
                />
            </div>
        </div>
     );
}
 
export default Blogs;