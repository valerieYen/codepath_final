import { Link, Route, Routes, BrowserRouter } from 'react-router-dom';
import Layout from './Layout';
import Posts from './pages/Posts';
import CreatePost from './pages/CreatePost';
import ViewPost from './pages/ViewPost';
import EditPost from './pages/EditPost';
import './App.css'
import SearchResults from './pages/SearchResults';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Posts />} /> 
          <Route path="/create-new" element={<CreatePost />} /> 
          <Route path="/post/:id" element={<ViewPost />} />
          <Route path="/edit/:id" element={<EditPost />} />
          <Route path="/search" element={<SearchResults />} />
          <Route
            path="*"
            element={
              <div className="">
                <p className="">Theres nothing here!</p>
                <Link to="/" className="">
                  Back to Home
                </Link>
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
