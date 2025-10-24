import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import 'mapbox-gl/dist/mapbox-gl.css';
import {Outlet} from 'react-router';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

export function ParentLayout() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/');
  };
  return (
    <>
      <div>Hello, Parents</div>
      <button onClick={handleClick}>Click here to come back to Home</button>
    </>
  );
}
