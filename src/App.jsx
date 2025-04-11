import React, { useState, useEffect } from 'react';

function App() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');

  // Appel API pour charger les posts
  const fetchPosts = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/posts`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des posts :', error);
    }
  };

  // Envoi d’un nouveau post
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Erreur serveur');
      }

      setContent('');
      fetchPosts();
    } catch (error) {
      console.error('Erreur lors de l’envoi du post :', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      <h1>GROWTH 🌱</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Exprime ton idée ici..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">Publier</button>
      </form>

      {posts.map((post) => (
        <div key={post.id}>
          <p>{post.content}</p>
          <p>
            {post.users?.full_name
              ? `Publié par ${post.users.full_name}`
              : 'Publié par anonyme'}{' '}
            le {new Date(post.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}

export default App;
