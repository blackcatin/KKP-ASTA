import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import Login from './components/Auth/Login'
import Layout from './components/Layout/Layout';
import StaffPage from './components/Staff/StaffPage';
import TransactionPage from './components/Transaction/TransactionPage';
import ReportPage from './components/ReportPage/ReportPage';
import ItemPage from './components/ItemPage/ItemPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Layout />}>
          <Route path="staff" element={<StaffPage />} />
          <Route path="transaction" element={<TransactionPage />} />
          <Route path="reports" element={<ReportPage />} />
          <Route path="items" element={<ItemPage />} />
        </Route>
      </Routes>
    </BrowserRouter >
  );
}

export default App;
