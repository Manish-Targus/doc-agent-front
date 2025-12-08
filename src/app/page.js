"use client";
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import LoginView from '../components/LoginView';
import ChoiceView from '../components/ChoiceView';
import UploadView from '../components/UploadView';
import DashboardView from '../components/DashboardView';
import CleanBackground from '../components/CleanBackground';
import { api } from '../utils/api';

export default function Home() {
  const [currentView, setCurrentView] = useState('login');
  const [collections, setCollections] = useState([]);
  const [activeCollectionId, setActiveCollectionId] = useState(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await api.getCollections();
        console.log("Fetched collections data:", data);

        let list = [];
        if (Array.isArray(data)) {
          list = data;
        } else if (data && Array.isArray(data.collections)) {
          list = data.collections;
        } else {
          console.warn("Unexpected collections format:", data);
          setCollections([]);
          return;
        }

        const formattedCollections = list.map((item, index) => {
          if (typeof item === 'string') {
            return {
              id: `col-${index}`,
              name: item,
              size: 'Unknown',
              date: 'Unknown',
              type: 'FILE'
            };
          }
          // Ensure object has an ID
          return {
            ...item,
            id: item.id || `col-${index}`
          };
        });
        setCollections(formattedCollections);
      } catch (error) {
        console.error("Failed to fetch collections:", error);
      }
    };

    fetchCollections();
  }, []);

  const handleLogin = () => setCurrentView('choice');
  const handleChoice = (choice) => setCurrentView(choice);

  const handleUploadComplete = (newDoc) => {
    setCollections(prev => [newDoc, ...prev]);
    setActiveCollectionId(newDoc.id);
  };

  const goToDashboard = () => setCurrentView('dashboard');
  const handleLogout = () => setCurrentView('login');

  return (
    <>
      <Head>
        <title>DocuBot AI</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="relative min-h-screen font-sans text-slate-800 selection:bg-amber-100 selection:text-slate-900">
        <CleanBackground />
        <div className="relative z-10 h-screen flex flex-col">
          {currentView === 'login' && <LoginView onLogin={handleLogin} />}
          {currentView === 'choice' && <ChoiceView onChoice={handleChoice} />}
          {currentView === 'upload' && (
            <UploadView
              onComplete={handleUploadComplete}
              onNavigateToChat={goToDashboard}
              onBack={() => setCurrentView('choice')}
            />
          )}
          {currentView === 'dashboard' && (
            <DashboardView
              collections={collections}
              setCollections={setCollections}
              activeCollectionId={activeCollectionId}
              setActiveCollectionId={setActiveCollectionId}
              onLogout={handleLogout}
              onNavigateToUpload={() => setCurrentView('upload')}
            />
          )}
        </div>
      </div>
    </>
  );
}