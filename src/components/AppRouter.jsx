import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Home';
import PageNotFound from './PageNotFound';
import Login from './Login';
import UploadImage from './UploadImage';
import Posts from './Posts';
import Search from './Search';
import Searchresult from './Searchresult';
import Donate from './Donate';
import Feedback from './Feedback';
import Genwallpaper from './Genwallpaper';
import User from './User'
import Contactme from './Contactme';
import Logout from './Logout';
import Signup from './Signup';
import Navbarme from './Navbarme';
import ResetPass from './ResetPass';
import MyAccount from './MyAccount';
import PostDetail from './PostDetail';
import UserSearch from './UserSearch';
import UserSearchResult from './UserSearchResult';
import ReportDisplay from './Report_Display';
import PricingPlans from './Payment_Test';
import ApiDocs from './ApiDocs';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <div className='dark'>
        <Navbarme />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/upload" element={<UploadImage />} />
        <Route path="/posts/:id" element={<Posts />} />
        <Route path="/search" element={<Search />} />
        <Route path="/searchresult/:q" element={<Searchresult />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/genwallpaper" element={<Genwallpaper />} />
        <Route path="/user/:id" element={<User />} />
        <Route path="/contactme" element={<Contactme />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPass />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/myaccount" element={<MyAccount />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/usersearch/*" element={<UserSearch />} />
        <Route path="/usersearchresult/:q" element={<UserSearchResult />} />
        <Route path="/reports" element={<ReportDisplay />} />
        <Route path="/payment" element={<PricingPlans />} />
        <Route path="/Api" element={<ApiDocs />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
