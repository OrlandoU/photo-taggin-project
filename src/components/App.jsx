import '../assets/css/App.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import Menu from './Menu/Menu';
import LeaderBoard from './LeaderBoard/LeaderBoard'
import Header from './Header';
import Info from './Info/Info';
import Map from './Map/Map';
import { useState } from 'react';
import LeaderboardRouted from './LeaderBoard/LeaderboardRouted';



function App() {  
  const [uniqueId, setUniqueId] = useState()
  const [keyId, setKeyId] = useState(0)
  
  return (
      <div className="App">
        <Header />
        <Routes>
          <Route path='/' element={<Menu />} />
          <Route path='/leaderboard' element={<LeaderBoard />} />
          <Route path='/info' element={<Info />} />
          <Route path='/map/:level' element={<Map uniqueId={uniqueId} setUniqueId={setUniqueId} key={keyId} setKeyId={setKeyId} />}/>
          <Route path='/leaderboard/:level' element={<LeaderboardRouted />}/>
        </Routes>
      </div>
    
  );
}

export default App;
