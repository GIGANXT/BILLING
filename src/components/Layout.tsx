import React from 'react';
import { Menu, Home, Package, FileText, Users, BarChart2, LogOut, Warehouse } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import ForecastingIcon from './ForecastingIcon';
import WarehouseIcon from './WarehouseIcon';
import AutomationIcon from './AutomationIcon';
import BackupIcon from './BackupIcon';


interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const location = useLocation();
  const sidebarRef = React.useRef<HTMLDivElement>(null);

  // Close sidebar when clicking outside on mobile
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Automatically close sidebar on route changes for mobile
  React.useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  // Initialize sidebar to be open on large screens, closed on mobile
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    
    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

const regularMenu = [
  { icon: Home, label: 'Dashboard', path: '/' },
  { icon: Package, label: 'Inventory', path: '/inventory' },
  { icon: FileText, label: 'Billing', path: '/billing' },
  { icon: Users, label: 'Customers', path: '/customers' },
  { icon: BarChart2, label: 'Reports', path: '/reports' }
];

const premiumMenu = [
  { icon: WarehouseIcon, label: 'Warehouse', path: '/warehouse' },
  { icon: ForecastingIcon, label: 'Planning and Forecasting', path: '/forecasting' },
  { icon: AutomationIcon, label: 'Workflow Automation', path: '/workflow_automation' },
  { icon: BackupIcon, label: 'Cloud Backup', path: '/cloud_backup' }
];


  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-800 bg-opacity-50 z-20 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside 
        ref={sidebarRef}
        className={`fixed top-0 left-0 z-30 h-screen transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } bg-white border-r border-gray-100 w-64 shadow-sm`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            MediStore
          </h1>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
            aria-label="Close sidebar"
          >
            <Menu className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-64px)]">
{regularMenu.map((item) => {
  const isActive = location.pathname === item.path;
  return (
    <Link
      key={item.label}
      to={item.path}
      className={`flex items-center p-2.5 rounded-lg transition-all duration-200 ${
        isActive 
          ? 'bg-blue-50/80 text-blue-600' 
          : 'text-gray-600 hover:bg-gray-50/80'
      }`}
    >
      <item.icon className={`w-5 h-5 ${
        isActive ? 'text-blue-600' : 'text-gray-400'
      }`} />
      <span className="ml-3 text-sm font-medium">{item.label}</span>
      {isActive && (
        <div className="ml-auto w-1 h-1 rounded-full bg-blue-600"></div>
      )}
    </Link>
  );
})}

{/* Divider and Premium Section */}
<div className="pt-4 mt-4 border-t border-gray-200">
  <h2 className="text-xs font-semibold text-gray-400 px-2 mb-2 uppercase tracking-wide">Premium</h2>
  {premiumMenu.map((item) => {
    const isActive = location.pathname === item.path;
    return (
      <Link
        key={item.label}
        to={item.path}
        className={`flex items-center p-2.5 rounded-lg transition-all duration-200 ${
          isActive 
            ? 'bg-blue-50/80 text-blue-600' 
            : 'text-gray-600 hover:bg-gray-50/80'
        }`}
      >
        <item.icon className={`w-5 h-5 ${
          isActive ? 'text-blue-600' : 'text-gray-400'
        }`} />
        <span className="ml-3 text-sm font-medium">{item.label}</span>
        {isActive && (
          <div className="ml-auto w-1 h-1 rounded-full bg-blue-600"></div>
        )}
      </Link>
    );
  })}
</div>

          <div className="pt-3 mt-3 border-t border-gray-100">
            <button className="flex items-center w-full p-2.5 text-gray-600 rounded-lg hover:bg-red-50/80 transition-colors group">
              <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
              <span className="ml-3 text-sm font-medium">Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="w-full lg:pl-64 flex-1">
        <div className="p-4 sm:p-6">
          <div className="mb-4 lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className={`p-2 text-gray-500 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors ${sidebarOpen ? 'hidden' : 'block'}`}
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
          <div className="overflow-x-hidden">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;