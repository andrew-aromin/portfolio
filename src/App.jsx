import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { cleanAndValidate } from '../helpers';
import axios from 'axios';
import './App.css'

function App() {
  const { UNSANITZED_COMPANY_NAME } = useParams();
  const [image, setImg] = useState(null);
  
  useEffect(() => {
    if (!UNSANITZED_COMPANY_NAME) return;

    // ensure it's a valid and sanitzied url
    const cleanedName = cleanAndValidate(UNSANITZED_COMPANY_NAME);

    if(!cleanedName) return;

    // check the cache to prevent repeated API calls
    const cachedLogo = localStorage.getItem(cleanedName);

    if (cachedLogo) {
      // If logo is in localStorage, use it
      setImg(cachedLogo);
      return;
    }

    (async () => {
      try {
        const { data } = await axios.get("/api/getLogo", {
          params: {
            q: cleanedName
          }
        });

        if(data?.logo) {
          localStorage.setItem(cleanedName, data.logo);
          setImg(data.logo);
        }

      }catch(e) {
        console.error(e);
      }
    })();

  }, []);

  return (
    <>
      <h1>Welcome, to my Full Stack React App!</h1>
      <div className="card">
      {image ? (
        <img src={image} alt="Logo" onError={() => setImg(null)} />
      ) : (
        <span style={{ fontSize: '5rem' }}>👋</span>
      )}
        <p>My name is Andrew Aromin and I'm a Senior Full Stack Software Engineer</p>
        <p>
           I built this app using ReactJS, NodeJS, and Docker
        </p>
        <p>Checkout my <a href="https://www.linkedin.com/in/andrew-aromin" target="_blank" rel="noopener noreferrer">
          Linkedin</a>
        </p>
      </div>
    </>
  )
}

export default App
