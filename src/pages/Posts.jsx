import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../client';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [newest,setNewest] = useState(false);
    const [popular,setPopular] = useState(true);

    const getPosts = async () => {
      const sortMethod = newest ? 'created_at' : 'upvotes';
      
      try {
        const { data, error } = await supabase
          .from('posts')
          .select()
          .order(sortMethod, { ascending: false });
        
        if (error) {
          alert("Error retrieving posts: ", error);
        } else {
          setPosts(data);
          console.log(data);
        }
      } catch (error) {
        alert("Error retrieving posts: ", error);
      }
    }
    
      useEffect(() => {
        getPosts();
      }, [newest, popular]);

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
    
      function getBlurb(text) {
        const words = text.split(/\s+/);
        return words.length <= 20 ? text : `${words.slice(0, 20).join(' ')}...`;
      }

      const toggleSort = (type) => {
        if (type === 'newest') {
          setNewest(true);
          setPopular(false);
        } else {
          setNewest(false);
          setPopular(true);
        }
      };

      return (
        <div className="">
          <h1 className=""></h1>
          <div className="FilterButtons">
          <button 
            className="Newest" 
            disabled={newest}
            onClick={() => toggleSort('newest')}
          >
            Newest
          </button>
          <button
            className="Popular" 
            disabled={popular}
            onClick={() => toggleSort('popular')}
          >
            Most Popular
          </button>
            <div className="Spacer"></div>
          </div>
          <div className="PostsContainer">
          {
            posts.map ((post) => (
              <Link to={`/post/${post.id}`} key={post.id} className="">
                <div className="Post">
                  <div className="PostInfo">
                    <p className="PostTimeStamp">Posted {convertTimeStamp(post.created_at)}</p>
                    <div className="Spacer"></div>
                    <p className="PostUpvotes">{post.upvotes} <img src="/upvoteyes.png" className="TinyUV"/></p>
                  </div>
                  <h1 className="PostTitle">{post.title}</h1>
                  <p className="Blurb"> {getBlurb(post.content)}</p>
                </div>
              </Link>
            ))
          }
          </div>
        </div>
      );
}

export default Posts