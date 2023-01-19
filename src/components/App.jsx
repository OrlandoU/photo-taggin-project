import '../assets/css/App.css';
import { Route, Routes } from 'react-router-dom';
import Menu from './Menu/Menu';
import LeaderBoard from './LeaderBoard/LeaderBoard'
import Header from './Header';
import Info from './Info/Info';
import Map from './Map/Map';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path='/' element={<Menu />} />
        <Route path='/leaderboard' element={<LeaderBoard />} />
        <Route path='/info' element={<Info />} />
        <Route path='/map' element={<Map />} />
      </Routes>
    </div>
  );
}

export default App;
