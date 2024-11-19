import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../client';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [key, setKey] = useState('');
  const navigate = useNavigate();

  const createPost = async (event) => {
    event.preventDefault();
    try {
      const { error } = await supabase
        .from('posts').insert({title: title, content: content, image_url: image, edit_key: key});

      if (error) {
        alert("Error creating post: ", error);
      } else {
        alert("Posted!");

        try {
          const { data, error } = await supabase
            .from('posts')
            .select()
            .order('created_at', { ascending: false });

          console.log(data);

          if (error) {
            alert("Could not navigate to new post:", error)
          } else {
            console.log(data[0].id);
            navigate(`/post/${data[0].id}`);
          }
        } catch (error) {
          alert("Could not navigate to new post:", error)
        }
      }
    } catch (err) {
      alert("Error creating post: ", err);
    }
  }

  return (
    <div className="container mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">Create a New Post</h1>
    <form onSubmit={createPost} className="space-y-4">
      <div className="input-group">
        <h2 className="text-lg font-semibold">Title:</h2>
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Enter post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      
      <div className="input-group">
        <h2 className="text-lg font-semibold">Content:</h2>
        <textarea
          className="w-full p-2 border rounded min-h-[150px]"
          placeholder="Enter post content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>

      <div className="input-group">
        <h2 className="text-lg font-semibold">Image URL:</h2>
        <input
          type="url"
          className="w-full p-2 border rounded"
          placeholder="Enter image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
      </div>

      <div className="input-group">
        <h2 className="text-lg font-semibold">Edit Key:</h2>
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Enter edit key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          required
        />
      </div>

      <button
        onClick={createPost}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Create Post
      </button>
    </form>
  </div>
  );
};

export default CreatePost