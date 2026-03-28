import React, { useState, useEffect } from 'react';

// === IMPORT GAMBAR SESUAI FOLDER ASSETS ANDA ===
import imgNasgor from './assets/nasgor.png';
import imgAyamPenyet from './assets/ayampenyet.png';
import imgEsteh from './assets/esteh.png';
import imgKentang from './assets/kentanggoreng.png';
// ==============================================

const menuData = [
  { 
    id: 1, 
    nama: "Ayam Goreng Penyet", 
    harga: 25000, 
    kategori: "Makanan", 
    gambar: imgAyamPenyet, 
    deskripsi: "Ayam goreng gurih dengan sambal korek pedas." 
  },
  { 
    id: 2, 
    nama: "Nasi Goreng Special", 
    harga: 22000, 
    kategori: "Makanan", 
    gambar: imgNasgor, 
    deskripsi: "Nasi goreng dengan telur mata sapi dan sosis." 
  },
  { 
    id: 3, 
    nama: "Es Teh Manis", 
    harga: 5000, 
    kategori: "Minuman", 
    gambar: imgEsteh, 
    deskripsi: "Segar dan manis alami." 
  },
  { 
    id: 5, 
    nama: "Kentang Goreng", 
    harga: 15000, 
    kategori: "Snack", 
    gambar: imgKentang, 
    deskripsi: "Kentang renyah dengan taburan garam." 
  }
];

function App() {
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState('Makanan');
  const [nomorMeja, setNomorMeja] = useState('00');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const meja = params.get('meja');
    if (meja) setNomorMeja(meja);
  }, []);

  const addToCart = (item) => {
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      setCart(cart.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setCart([...cart, { ...item, qty: 1, note: '' }]);
    }
  };

  const totalHarga = cart.reduce((acc, curr) => acc + (curr.harga * curr.qty), 0);

  return (
    <div className="bg-gray-50 min-h-screen pb-32">
      {/* Header ala Gojek */}
      <div className="bg-white p-4 shadow-sm sticky top-0 z-10 border-b-2 border-gray-100">
        <h1 className="text-2xl font-black text-gojek-green tracking-tight">QResto</h1>
        <div className="flex items-center mt-1">
          <div className="bg-gojek-green w-2 h-2 rounded-full mr-2"></div>
          <p className="text-sm font-bold tracking-tight">Meja Nomor: <span className="text-gojek-green">{nomorMeja}</span></p>
        </div>
      </div>

      {/* Tab Kategori */}
      <div className="flex space-x-2 p-4 bg-white overflow-x-auto border-b">
        {['Makanan', 'Minuman', 'Snack'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full font-bold transition-all whitespace-nowrap ${activeTab === tab ? 'bg-gojek-green text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Daftar Menu List */}
      <div className="p-4 space-y-4">
        {menuData.filter(m => m.kategori === activeTab).map(item => (
          <div key={item.id} className="flex bg-white p-4 rounded-3xl shadow-sm items-center border border-gray-100 transform active:scale-95 transition-transform">
            <img 
              src={item.gambar} 
              alt={item.nama} 
              className="w-20 h-20 rounded-2xl object-cover shadow-sm border border-gray-50" 
            />
            
            <div className="ml-4 flex-1">
              <h3 className="font-bold text-lg leading-tight text-gray-900">{item.nama}</h3>
              <p className="text-xs text-gray-400 leading-tight mb-2 pr-4">{item.deskripsi}</p>
              <p className="font-extrabold text-gojek-green text-lg">Rp {item.harga.toLocaleString()}</p>
            </div>
            
            <button 
              onClick={() => addToCart(item)}
              className="bg-white border-2 border-gojek-green text-gojek-green px-4 py-1.5 rounded-xl font-bold hover:bg-gojek-green hover:text-white transition-all shadow-sm active:shadow-none"
            >
              Tambah
            </button>
          </div>
        ))}
      </div>

      {/* Floating Bottom Cart */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-4 right-4 bg-gojek-green text-white p-5 rounded-3xl shadow-2xl flex justify-between items-center z-20 animate-bounce-in">
          <div>
            <p className="text-xs font-semibold opacity-90">{cart.length} Item terpilih</p>
            <p className="text-2xl font-black">Rp {totalHarga.toLocaleString()}</p>
          </div>
          <button className="bg-white text-gojek-green px-8 py-3 rounded-xl font-black shadow-lg text-lg hover:bg-gray-100 active:scale-95 transition-all">
            PESAN
          </button>
        </div>
      )}
    </div>
  );
}

export default App;