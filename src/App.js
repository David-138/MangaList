import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./App.css";
import Main from "./Pages/Principal/main"
import Achievements from "./Pages/Principal/achievements"
import Search from "./Pages/Principal/search"
import MangaList from "./Pages/Principal/mangalist"
import Manga from "./Pages/Principal/manga"
import Register from "./Pages/Cuenta/register";
import Login from "./Pages/Cuenta/login";
import Profile from "./Pages/Cuenta/profile";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/Achievements" element={<Achievements />} />
        <Route path="/Search" element={<Search />} />
        <Route path="/MangaList" element={<MangaList />} />
        <Route path="/Manga/:id" element={<Manga />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
