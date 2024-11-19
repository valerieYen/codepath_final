import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../client';

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState({
        title: '',
        content: '',
        comments: []
    });

    useEffect(() => {
        const getPost = async () => {
            try {
                const { data, error } = await supabase
                    .from('posts')
                    .select()
                    .eq('id', id)
                    .single();
        
                if (error) {
                    alert("Error fetching post: " + error.message);
                } else {
                    setPost(data);
                }
            } catch (error) {
                alert("Error fetching post: " + error.message);
            }
        };
    
        getPost();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const { error } = await supabase
                .from('posts')
                .update({
                    title: post.title,
                    content: post.content,
                    comments: post.comments
                })
                .eq('id', id);

            if (error) {
                alert("Error updating post: " + error.message);
            } else {
                alert("Post updated successfully!");
                navigate(`/post/${id}`);
            }
        } catch (error) {
            alert("Error updating post: " + error.message);
        }
    };

    const deletePost = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                const { error } = await supabase
                    .from('posts')
                    .delete()
                    .eq('id', id);

                if (error) {
                    alert("Error deleting post: " + error.message);
                } else {
                    alert("Post deleted successfully!");
                    navigate('/');
                }
            } catch (error) {
                alert("Error deleting post: " + error.message);
            }
        }
    };

    const deleteComment = (index) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            setPost(prev => ({
                ...prev,
                comments: prev.comments.filter((_, i) => i !== index)
            }));
        }
    };

    return (
        <div className="PostView">
            <form onSubmit={handleSubmit} className="Post EditPostForm">
                <div className="EditInputs">
                    <input
                        type="text"
                        name="title"
                        value={post.title}
                        onChange={handleChange}
                        placeholder="Post Title"
                        className="PostTitle EditInput TitleEdit"
                    />
                    <textarea
                        name="content"
                        value={post.content}
                        onChange={handleChange}
                        placeholder="Post Content"
                        className="Blurb EditInput ContentEdit"
                    />
                    
                    <div className="CommentsSection">
                        <h2 className="CommentLabel">Comments</h2>
                        <div className="CommentBox EditCommentBox">
                            {post.comments?.map((comment, index) => (
                                <div key={index} className="Comment EditComment">
                                    <span className="CommentText">{comment}</span>
                                    <button
                                        type="button"
                                        onClick={() => deleteComment(index)}
                                        className="DeleteCommentBtn"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="EditButtonGroup">
                        <button 
                            type="submit" 
                            className="EditButton UpdateBtn"
                        >
                            Update Post
                        </button>
                        <button 
                            type="button"
                            onClick={deletePost}
                            className="EditButton DeleteBtn"
                        >
                            Delete Post
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditPost;