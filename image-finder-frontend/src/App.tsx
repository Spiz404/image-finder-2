import { useState } from 'react'
import './App.css'
import Sb from './SearchBar';
import ButtonContainer from './ButtonContainer';
import Gallery from './Gallery';
import ParentContainer from './ParentContainer';

/*

      <Sb/>
      <ButtonContainer/>
      <Gallery/>
*/
function App() {

  return (
    <div className='main-container'>
      <h1 className='title-page'>
        Gallery prompt
      </h1>
      <ParentContainer/>
    </div>
  );
}

export default App
