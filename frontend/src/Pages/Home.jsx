import React, { useState, useEffect } from 'react';
import API from '../Services/Api';

const Home = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async (query = "") => {
    try {
      setLoading(true);
      const res = await API.get(`/destinations${query ? `/search?name=${query}` : ''}`);
      setDestinations(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDestinations(search);
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">Explore The World</h1>
        <p className="hero-subtitle">Discover breathtaking destinations curated just for you.</p>
        <form className="search-bar" onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Where do you want to go?" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      <div className="destinations-section">
        <h2 className="section-title">Trending Destinations</h2>
        {loading ? (
          <div className="loader"></div>
        ) : (
          <div className="grid">
            {destinations.map(dest => (
              <div key={dest.id} className="card glass-effect">
                <div className="card-image-wrapper">
                  <img src={dest.imageUrl || "https://images.unsplash.com/photo-1436491865332-7a61a109cc05"} alt={dest.name} />
                  <div className="card-badge">{dest.category}</div>
                </div>
                <div className="card-content">
                  <div className="card-header">
                    <h3>{dest.name}</h3>
                    <span className="rating">★ {dest.rating || '4.5'}</span>
                  </div>
                  <p className="country">📍 {dest.country}</p>
                  <p className="description">{dest.description}</p>
                  <div className="card-footer">
                    <span className="price">${dest.price || '999'} <span>/ person</span></span>
                    <button className="book-btn">Explore</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;