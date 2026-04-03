import React, { useState, useEffect } from 'react';
import imgNasgor from './assets/nasgor.png';
import imgAyamPenyet from './assets/ayampenyet.png';
import imgEsteh from './assets/esteh.png';
import imgKentang from './assets/kentanggoreng.png';
<<<<<<< HEAD
=======
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
    nama: "Nasi Goreng Speciall", 
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
>>>>>>> e4f6a61491da2247c6d8bb41ebcd33eec15047e7

function App() {
  const [menuData, setMenuData] = useState([]);
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState('Makanan');
  const [nomorMeja, setNomorMeja] = useState('00');
  const [isLoading, setIsLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  
  // State baru untuk Fitur Notes
  const [noteModal, setNoteModal] = useState({ show: false, itemId: null, text: '' });

  const imageMap = {
    "ayampenyet.png": imgAyamPenyet,
    "nasgor.png": imgNasgor,
    "esteh.png": imgEsteh,
    "kentanggoreng.png": imgKentang
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const meja = params.get('meja');
    if (meja) setNomorMeja(meja);

    fetch("http://localhost:8080/api/menus")
      .then(res => res.json())
      .then(result => {
        if (result.data) {
          setMenuData(result.data.map(item => ({
            ...item,
            gambar: imageMap[item.gambar] || imgNasgor
          })));
        }
        setIsLoading(false);
      });
  }, []);

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item
    ).filter(item => item.qty > 0));
  };

  const addToCart = (item) => {
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      updateQty(item.id, 1);
    } else {
      setCart([...cart, { ...item, qty: 1, note: '' }]);
    }
  };

  // Fungsi menyimpan catatan ke state cart
  const saveNote = () => {
    setCart(prev => prev.map(item => 
      item.id === noteModal.itemId ? { ...item, note: noteModal.text } : item
    ));
    setNoteModal({ show: false, itemId: null, text: '' });
  };

  const handlePesan = async () => {
    const payload = {
      nomorMeja: nomorMeja,
      items: cart.map(item => ({
        menuId: item.id,
        namaMenu: item.nama,
        qty: item.qty,
        harga: item.harga,
        note: item.note // Dikirim ke backend
      }))
    };

    try {
      const response = await fetch("http://localhost:8080/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (response.ok) {
        setOrderResult(result.data);
        setCart([]);
        setShowCheckout(false);
      }
    } catch (error) {
      alert("Gagal terhubung ke server");
    }
  };

  const totalHarga = cart.reduce((acc, curr) => acc + (curr.harga * curr.qty), 0);

  return (
    <div className="bg-gray-50 min-h-screen pb-40 font-sans">
      {/* Header & Tabs tetap sama... */}
      <div className="bg-white p-5 sticky top-0 z-10 border-b border-gray-100 flex justify-between items-center">
        <h1 className="text-xl font-black text-gojek-green">QResto</h1>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Meja {nomorMeja}</p>
      </div>

      <div className="flex space-x-2 p-4 bg-white sticky top-[69px] z-10 border-b overflow-x-auto no-scrollbar">
        {['Makanan', 'Minuman', 'Snack'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-1.5 rounded-full text-sm font-bold ${activeTab === tab ? 'bg-gojek-green text-white' : 'bg-gray-100 text-gray-500'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Menu List */}
      <div className="p-4 space-y-6">
        {menuData.filter(m => m.kategori === activeTab).map(item => {
          const inCart = cart.find(c => c.id === item.id);
          return (
            <div key={item.id} className="flex gap-4 items-start border-b border-gray-100 pb-6">
              <div className="flex-1">
                <h3 className="font-bold text-base text-gray-800">{item.nama}</h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.deskripsi}</p>
                <p className="font-bold text-sm mt-3">Rp {item.harga.toLocaleString()}</p>
              </div>
              <div className="relative">
                <img src={item.gambar} className="w-24 h-24 rounded-xl object-cover shadow-sm" />
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-20">
                  {inCart ? (
                    <div className="bg-white border border-gojek-green rounded-lg flex items-center justify-between p-1 shadow-md">
                      <button onClick={() => updateQty(item.id, -1)} className="text-gojek-green font-bold px-2">-</button>
                      <span className="text-sm font-bold">{inCart.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="text-gojek-green font-bold px-2">+</button>
                    </div>
                  ) : (
                    <button onClick={() => addToCart(item)} className="bg-white border border-gray-200 text-gojek-green font-black py-1.5 px-6 rounded-lg shadow-md w-full text-xs">Add</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Checkout Bar */}
      {cart.length > 0 && !showCheckout && (
        <div className="fixed bottom-6 left-4 right-4 z-30">
          <button onClick={() => setShowCheckout(true)} className="w-full bg-gojek-green text-white p-4 rounded-2xl shadow-xl flex justify-between items-center">
            <div className="font-black">Rp {totalHarga.toLocaleString()}</div>
            <div className="font-black text-sm uppercase">Lihat Keranjang</div>
          </button>
        </div>
      )}

      {/* CHECKOUT DRAWER */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCheckout(false)}></div>
          <div className="bg-white w-full rounded-t-3xl z-10 max-h-[85vh] overflow-y-auto p-6">
            <h2 className="text-xl font-black mb-6">Pesanan Saya</h2>
            <div className="space-y-6">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">{item.nama}</p>
                    {item.note && <p className="text-[10px] text-orange-500 font-bold italic">Note: {item.note}</p>}
                    <button 
                      onClick={() => setNoteModal({ show: true, itemId: item.id, text: item.note })}
                      className="text-gojek-green text-[10px] font-bold mt-2 flex items-center gap-1"
                    >
                      {item.note ? 'Edit Catatan' : '+ Tambah Catatan'}
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border">
                      <button onClick={() => updateQty(item.id, -1)} className="font-bold px-2">-</button>
                      <span className="font-bold text-sm">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="font-bold px-2">+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={handlePesan} className="w-full bg-gojek-green text-white py-4 rounded-2xl font-black mt-8">Pesan Sekarang</button>
          </div>
        </div>
      )}

      {/* MODAL INPUT NOTE (POP UP) */}
      {noteModal.show && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-black/80">
          <div className="bg-white p-6 rounded-3xl w-full max-w-sm">
            <h3 className="font-bold mb-4">Tambah Catatan</h3>
            <textarea 
              className="w-full border rounded-xl p-3 text-sm focus:outline-gojek-green" 
              rows="3" 
              placeholder="Contoh: Gak pake bawang goreng ya..."
              value={noteModal.text}
              onChange={(e) => setNoteModal({...noteModal, text: e.target.value})}
            ></textarea>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setNoteModal({show: false})} className="flex-1 py-3 font-bold text-gray-400">Batal</button>
              <button onClick={saveNote} className="flex-1 bg-gojek-green text-white py-3 rounded-xl font-bold">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL tetap sama... */}
    </div>
  );
}

export default App;