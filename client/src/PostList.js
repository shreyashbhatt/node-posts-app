import React, { useEffect, useState } from 'react';
import axios from "axios";
import CommentCreate from './CommentCreate';
import CommentList from './CommentList';

export default () => {
    const [posts, setPosts] = useState({});
    const fetchPost = async () => {
        const { data } = await axios('http://localhost:4002/posts');
        setPosts(data);
    };

    useEffect(() => {
        fetchPost();
    }, []);

    const renderedPost = Object.values(posts).map(post => {
        return (<div
                    className="card"
                    style={{ width: '30%', marginBottom: '20px'}}
                    key={post.id}>
                    <div className="card-body">
                        <h3>
                            {post.title}
                        </h3>
                        <CommentList postId={post.id} comments={post.comments}/>
                        <CommentCreate postId={post.id} />
                    </div>
                </div>  
        )
    });
    return(
        <div className="d-flex flex-row flex-wrap justify-content-between">
            {renderedPost}
        </div>
    );
}