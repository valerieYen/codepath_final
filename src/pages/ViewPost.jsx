import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../client';

const ViewPost = () => {
    const { id } = useParams();
    const [post, setPost] = useState([]);
    const [key, setKey] = useState("");
    const [canEdit, setCanEdit] = useState(false);
    const [upvote_src, setSrc] = useState('/upvoteno.png');
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
  
    const getPost = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select()
          .eq('id', id)
          .single();

        if (error) {
          alert("Error fetching post: ", error);
        } else {
          setPost(data);
        }
      } catch (error) {
        alert("Error fetching post: ", error);
      }
    };

    useEffect(() => {
      getPost();
      console.log(id);
    }, [id,]);

    useEffect(() => {
      if (key === post.edit_key) {
        setCanEdit(true);
      } else {
        setCanEdit(false);
      }
    }, [key, post.edit_key]);

    function convertTimeStamp(timestamp) {
      const postDate = new Date(timestamp);
      const currDate = new Date(); // Create a Date object instead of using Date.now()
      const diffMs = currDate - postDate;
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);
      const diffMonths = (currDate.getMonth() + 12 * currDate.getFullYear()) - 
                         (postDate.getMonth() + 12 * postDate.getFullYear());
      const diffYears = Math.floor(diffMonths / 12);
    
      // Handle future dates
      if (diffMs < 0) {
        return "in the future";
      }
    
      // Years
      if (diffYears > 0) {
        return diffYears === 1 ? "1 year ago" : `${diffYears} years ago`;
      }
    
      // Months
      if (diffMonths > 0) {
        return diffMonths === 1 ? "1 month ago" : `${diffMonths} months ago`;
      }
    
      // Days
      if (diffDays > 0) {
        return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
      }
    
      // Hours
      if (diffHours > 0) {
        return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
      }
    
      // Minutes
      if (diffMins > 0) {
        return diffMins === 1 ? "1 minute ago" : `${diffMins} minutes ago`;
      }
    
      // Seconds
      if (diffSecs > 0) {
        return diffSecs === 1 ? "1 second ago" : `${diffSecs} seconds ago`;
      }
    
      return "just now";
    }

    async function upVote() {
      try {
        const { data, error } = await supabase
          .from('posts')
          .update({upvotes : post.upvotes + 1})
          .eq('id', id);
    
        if (error) {
          alert("Error upvoting post: ", error);
        } else {
          setSrc('/upvoteyes.png');
          
          setTimeout(() => {
            setSrc('/upvoteno.png');
          }, 500);
          
          getPost();
        }
      } catch (error) {
        alert("Error upvoting post: ", error);
      }
    }

    const submitComment = async (e) => {
      e.preventDefault();
      
      if (!newComment.trim()) return;
    
      try {
        const currentComments = post.comments || [];
        const updatedComments = [...currentComments, newComment];
    
        const { error } = await supabase
          .from('posts')
          .update({ comments: updatedComments })
          .eq('id', id);
    
        if (error) {
          alert("Error adding comment: ", error);
        } else {
          setNewComment(""); // Clear input
          getPost(); // Refresh post data
        }
      } catch (error) {
        alert("Error adding comment: ", error);
      }
    };
  
    return (
      <div className="PostView">
        <div className="Post">
          <div className="PostInfo">
            <p className="PostTimeStamp">Posted {convertTimeStamp(post.created_at)}</p>
            <div className="Spacer"></div>
            <p className="PostUpvotes">{post.upvotes} <img src="/upvoteyes.png" className="TinyUV"/></p>
          </div>
          <h1 className="PostTitle">{post.title}</h1>
          {post.image_url && (
            <div className="PostImage">
              <img className="PostImage"
                src={post.image_url} 
                alt={post.title}
                onError={(e) => {
                  e.target.onerror=null;
                  e.target.src='/Empty.png';
                  e.target.className="EmptyPNG";
                }}
              />
            </div>
          )}
          <p className="Blurb"> {post.content}</p>
        </div>
        <div className="Interactions">
          <p className="CommentLabel">Comments:</p>
          <div className="Spacer"></div>
          <img src={upvote_src} onClick={() => {upVote()}} className="NotTinyUV"/>
        </div>
        <div className="CommentBox">  
          {post.comments && (
            <ul className="Comments">
            {post.comments.map((comment) => (
              <li key={comment} className="Comment">{comment}</li>
            ))}
            </ul>
          )}
          <form onSubmit={submitComment} className="AddComment">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="EditInput"
            />
            <button type="submit" className="EditButton">
              Add Comment
            </button>
          </form>
        </div>
        <div className="EditBar">
          <input type="text" name="key" placeholder="Please enter edit key:"
                onChange={(e) => {setKey(e.target.value)}} className="EditInput"/>
          {canEdit ? 
            ( 
              <Link to={`/edit/${post.id}`}>
                <p className="EditButton">Edit Post</p>
              </Link>
            ) : (
              <p className="EditError">Incorrect edit key entered</p>
            )
          }
        </div>
      </div>
    );
  }
  
  export default ViewPost;