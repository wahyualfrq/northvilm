import { Routes, Route, Outlet } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Search from './pages/Search'
import Detail from './pages/Detail'
import Watchlist from './pages/Watchlist'
import History from './pages/History'
import Profile from './pages/Profile'
import Login from './pages/Login'

function Shell() {
  return (
    <>
      <main className="mx-auto min-h-dvh w-full max-w-[480px] px-4 pt-6 pb-28">
        <Outlet />
      </main>
      <BottomNav />
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route path="/" element={<Home />} />
        <Route path="/cari" element={<Search />} />
        <Route path="/detail/:type/:id" element={<Detail />} />
        <Route path="/simpan" element={<Watchlist />} />
        <Route path="/riwayat" element={<History />} />
        <Route path="/profil" element={<Profile />} />
        <Route path="/masuk" element={<Login />} />
      </Route>
    </Routes>
  )
}
