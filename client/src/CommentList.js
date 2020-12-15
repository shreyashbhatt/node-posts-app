import React from "react";

export default ({ comments }) => {

    const renderedComments = Object.values(comments).map(comment => {

        let content;
        switch(comment.status) {
            case 'approved':
                content = comment.content;
                break;
            case 'rejected':
                content = 'This comment has been rejected';
                break;
            default:
                content = 'This comment is in pending state'
        }
        return (
            <li key={comment.id}>{content}</li>
        );
    });
    return <ul>{renderedComments}</ul>;
}