import '../assets/css/App.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import Menu from './Menu/Menu';
import LeaderBoard from './LeaderBoard/LeaderBoard'
import Header from './Header';
import Info from './Info/Info';
import Map from './Map/Map';
import { useState } from 'react';



function App() {  
  const [uniqueId, setUniqueId] = useState()
  
  return (
      <div className="App">
        <Header />
        <Routes>
          <Route path='/' element={<Menu />} />
          <Route path='/leaderboard' element={<LeaderBoard />} />
          <Route path='/info' element={<Info />} />
        <Route path='/map/:level' element={<Map uniqueId={uniqueId} setUniqueId={setUniqueId} key={useLocation()} />}/>
        </Routes>
      </div>
    
  );
}

export default App;
