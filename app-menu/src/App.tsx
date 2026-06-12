import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CustomerView from './pages/CustomerView';
import AdminPanel from './pages/AdminPanel';
import { useAppStore } from './store/appStore';
import { seedIfEmpty, setupFirestoreListeners } from './lib/firestoreService';

export default function App() {
  const isLoading = useAppStore((s) => s.isLoading);

  useEffect(() => {
    void seedIfEmpty();
    const {
      _applyMenu, _applyCategories, _applyDishOfDay,
      _applyDeliveryZones, _applySiteContent, _setLoading,
    } = useAppStore.getState();

    const unsub = setupFirestoreListeners({
      setMenu: _applyMenu,
      setCategories: _applyCategories,
      setDishOfDay: _applyDishOfDay,
      setDeliveryZones: _applyDeliveryZones,
      setSiteContent: _applySiteContent,
      setLoading: _setLoading,
    });

    return unsub;
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-bg-base">
        <span className="text-5xl">🍝</span>
        <p className="animate-pulse text-sm text-text-muted">Cargando menú...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomerView />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}
