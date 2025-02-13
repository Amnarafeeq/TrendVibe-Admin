"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Globe, Lock, User, Save } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import AdminHeader from '../components/AdminHeader';
import toast from 'react-hot-toast';

type NotificationSettings = {
  orderNotifications: boolean;
  customerMessages: boolean;
  productUpdates: boolean;
  marketingEmails: boolean;
};

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  const [profileSettings, setProfileSettings] = useState({
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '+1234567890'
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    orderNotifications: true,
    customerMessages: true,
    productUpdates: false,
    marketingEmails: true
  });

  const [siteSettings, setSiteSettings] = useState({
    siteName: 'Your Store',
    currency: 'USD',
    language: 'en',
    timezone: 'UTC'
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      // Here you would typically save to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <AdminHeader />
        
        <main className="p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>

            {/* Settings Navigation */}
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  activeTab === 'profile' 
                    ? 'bg-[#23856D] text-white' 
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                <User size={20} />
                <span>Profile</span>
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  activeTab === 'notifications' 
                    ? 'bg-[#23856D] text-white' 
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                <Bell size={20} />
                <span>Notifications</span>
              </button>
              <button
                onClick={() => setActiveTab('site')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  activeTab === 'site' 
                    ? 'bg-[#23856D] text-white' 
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                <Globe size={20} />
                <span>Site Settings</span>
              </button>
            </div>

            {/* Settings Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              {activeTab === 'profile' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      value={profileSettings.name}
                      onChange={(e) => setProfileSettings({ ...profileSettings, name: e.target.value })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-[#23856D]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      value={profileSettings.email}
                      onChange={(e) => setProfileSettings({ ...profileSettings, email: e.target.value })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-[#23856D]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input
                      type="tel"
                      value={profileSettings.phone}
                      onChange={(e) => setProfileSettings({ ...profileSettings, phone: e.target.value })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-[#23856D]"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
                  <div className="space-y-3">
                    {Object.entries(notificationSettings).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {key.split(/(?=[A-Z])/).join(' ')}
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={() => {
                              const settingKey = key as keyof NotificationSettings;
                              setNotificationSettings(prev => ({
                                ...prev,
                                [settingKey]: !prev[settingKey]
                              }));
                            }}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#23856D]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#23856D]"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'site' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Site Settings</h2>
                  <div>
                    <label className="block text-sm font-medium mb-1">Site Name</label>
                    <input
                      type="text"
                      value={siteSettings.siteName}
                      onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-[#23856D]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Currency</label>
                    <select
                      value={siteSettings.currency}
                      onChange={(e) => setSiteSettings({ ...siteSettings, currency: e.target.value })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-[#23856D]"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Language</label>
                    <select
                      value={siteSettings.language}
                      onChange={(e) => setSiteSettings({ ...siteSettings, language: e.target.value })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-[#23856D]"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-[#23856D] text-white rounded-lg hover:bg-[#23856D]/90 disabled:opacity-50"
                >
                  <Save size={20} />
                  <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
