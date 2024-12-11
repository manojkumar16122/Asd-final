import React, { useEffect, useState } from 'react';
import { firestore, database, auth } from '../lib/firebase';
import { collection, doc, getDoc } from 'firebase/firestore';
import { ref, onValue } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { UserData, HeartRateData } from '../types';
import HeartRateMonitor from './HeartRateMonitor';
import UserDetails from './UserDetails';
import Footer from './Footer';
import { LogOut } from 'lucide-react';

export default function Dashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [heartRateData, setHeartRateData] = useState<HeartRateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/');
        return;
      }

      const fetchData = async () => {
        try {
          const userDoc = await getDoc(doc(firestore, 'users', user.email!));
          if (!userDoc.exists()) {
            setError('User data not found');
            return;
          }

          setUserData(userDoc.data() as UserData);

          const heartRateRef = ref(database, 'heart_rate');
          onValue(heartRateRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
              const heartRates: HeartRateData[] = Object.entries(data).map(([timestamp, value]) => ({
                timestamp: parseInt(timestamp),
                value: value as number
              }));
              
              heartRates.sort((a, b) => a.timestamp - b.timestamp);
              setHeartRateData(heartRates.slice(-20));
            }
          });

          setLoading(false);
        } catch (err) {
          setError('Error fetching data');
          console.error(err);
        }
      };

      fetchData();
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error || 'Unable to load dashboard'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <header className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              👋 Welcome to {userData.name}'s Progress Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </header>

        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>📊</span> Progress Overview
            </h2>
            <UserDetails userData={userData} />
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>💗</span> Real-time Monitoring
            </h2>
            <HeartRateMonitor heartRateData={heartRateData} />
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}