import React, { useState } from "react";
import axios from 'axios';

export default ({ postId }) => {
    const [comment, setComment] = useState('');

    const onSubmit = async function(event) {
        event.preventDefault();
        await axios.post(`http://localhost:4001/posts/${postId}/comments`, {
            content: comment
        });
        setComment('');
    }
    return (
            <div>
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label>Comment</label>
                        <input className="form-control"type="text" value={comment} onChange={e => setComment(e.target.value)} />
                    </div>
                    <button className="btn btn-primary">comment</button>
                </form>
            </ div>
        );
}