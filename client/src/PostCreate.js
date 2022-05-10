import React, { useState } from 'react';
import axios from 'axios';

const PostCreate = () => {
  const [title, setTitle] = useState('');

  const handleForm = async (event) => {
    event.preventDefault();

    await axios.post('http://posts.com/posts/create', { title });

    setTitle('');
  }

  return (
    <div>
      <form onSubmit={handleForm}>
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <br />
          <button className="btn btn-primary">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default PostCreate;
