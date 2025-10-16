import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import Login from './components/Auth/Login'
import Layout from './components/Layout/Layout';
import StaffPage from './components/Staff/StaffPage';
import TransactionPage from './components/Transaction/TransactionPage';
import ReportPage from './components/ReportPage/ReportPage';
import ItemPage from './components/ItemPage/ItemPage';
import CategoryPage from './components/CategoryPage/CategoryPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Layout />}>
          <Route path="staff" element={<StaffPage />} />
          <Route path="transaction" element={<TransactionPage />} />
          <Route path="reports" element={<ReportPage />} />
          <Route path="categories" element={<CategoryPage />} />
          <Route path="items" element={<ItemPage />} />
        </Route>
      </Routes>
    </BrowserRouter >
  );
}

export default App;
