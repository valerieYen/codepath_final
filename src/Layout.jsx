import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Layout = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="Page">
      <div className="">
        <nav className="Navbar">
          <Link to="/" className="Link">
            <h1>HadesHuddle</h1>
          </Link>
          <div className="Spacer">
            <input
              type="text"
              placeholder="Search"
              className="SearchBar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
          <Link to="/create-new" className="Link">
            <h1>Post</h1>
          </Link>
        </nav>
      </div>
      <div className="PageContent">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;