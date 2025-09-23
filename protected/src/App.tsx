import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import Login from './components/Login'
import Layout from './components/Layout';
import StaffPage from './components/StaffPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Layout />}>
          <Route path="staff" element={<StaffPage />} />
        </Route>
      </Routes>
    </BrowserRouter >
  );
}

export default App;
