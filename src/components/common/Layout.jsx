import { useState } from "react";
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../redux/authSlice';
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useSelector(selectCurrentUser);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 w-full transition-all duration-300 overflow-x-hidden ml-0 lg:ml-80">
        <Header user={user} onMenuClick={() => setSidebarOpen(true)} />

        <main className="pt-24 pb-6">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="animate-fade-in">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
