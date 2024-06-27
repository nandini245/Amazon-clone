import './App.css';
import Navbar from './components/header/Navbar';
import Newnav from './components/newnavbaar/Newnav';
import MainComponent from './components/home/MainComponent';
import Footer from './components/footer/Footer';
import Signin from './components/signup_signin/Signin';
import Signup from './components/signup_signin/Signup';
import Cart from "./components/cart/Cart"
import Buynow from './components/buynow/Buynow';
import CircularProgress from '@mui/material/CircularProgress';
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setData(true);
    }, 3000);
  }, []);

  return (
    <>
      {
        data ? (
          <>
            <Navbar />
            <Newnav />
            <Routes>
              <Route path="/" element={<MainComponent />} />
              <Route path="/login" element={<Signin />} />
              <Route path="/register" element={<Signup />} />
              <Route path="/getproductsone/:id" element={<Cart />} />
              <Route path="/buynow" element={<Buynow />} />
            </Routes>
            <Footer />
          </>
        ) : (
          <div className="circle">
            <CircularProgress />
            <h2>Loading....</h2>
          </div>
        )
      }
    </>
  );
}

export default App;
