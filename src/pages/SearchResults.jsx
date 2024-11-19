import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../client';

const SearchResults = () => {
  const [posts, setPosts] = useState([]);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const searchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select()
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .order('upvotes', { ascending: false });

      if (error) {
        alert("Error searching posts: ", error);
      } else {
        setPosts(data);
      }
    } catch (error) {
      alert("Error searching posts: ", error);
    }
  };

  useEffect(() => {
    if (query) {
      searchPosts();
    }
  }, [query]);

  function convertTimeStamp(timestamp) {
    const postDate = new Date(timestamp);
    const currDate = new Date();
    const diffMs = currDate - postDate;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = (currDate.getMonth() + 12 * currDate.getFullYear()) - 
                       (postDate.getMonth() + 12 * postDate.getFullYear());
    const diffYears = Math.floor(diffMonths / 12);
  
    if (diffMs < 0) return "in the future";
    if (diffYears > 0) return diffYears === 1 ? "1 year ago" : `${diffYears} years ago`;
    if (diffMonths > 0) return diffMonths === 1 ? "1 month ago" : `${diffMonths} months ago`;
    if (diffDays > 0) return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
    if (diffHours > 0) return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
    if (diffMins > 0) return diffMins === 1 ? "1 minute ago" : `${diffMins} minutes ago`;
    if (diffSecs > 0) return diffSecs === 1 ? "1 second ago" : `${diffSecs} seconds ago`;
    return "just now";
  }

  function getBlurb(text) {
    const words = text.split(/\s+/);
    return words.length <= 20 ? text : `${words.slice(0, 20).join(' ')}...`;
  }

  return (
    <div className="SearchContainer">
      <h1 className="SearchHeader">
        Search Results for "{query}"
      </h1>
      <p className="">
        Found {posts.length} {posts.length === 1 ? 'result' : 'results'}
      </p>
      <div className="PostsContainer">
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts found matching your search.</p>
        ) : (
          posts.map((post) => (
            <Link to={`/post/${post.id}`} key={post.id} className="">
              <div className="Post">
                <div className="PostInfo">
                  <p className="PostTimeStamp">Posted {convertTimeStamp(post.created_at)}</p>
                  <div className="Spacer"></div>
                  <p className="PostUpvotes">{post.upvotes} upvotes</p>
                </div>
                <h1 className="PostTitle">{post.title}</h1>
                <p className="Blurb">{getBlurb(post.content)}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchResults;