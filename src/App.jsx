import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { GridStack } from 'gridstack';
import DOMPurify from 'dompurify';
import 'gridstack/dist/gridstack.min.css'; // Import CSS GridStack untuk styling grid
import './App.css'; // CSS tambahan jika diperlukan
import SidebarDrag from './SidebarDrag'; // Import komponen sidebar drag

// Komponen dinamis untuk konten widget
const HeaderWidget = () => (
  <div style={{ padding: '5px', backgroundColor: '#e0e0e0', borderBottom: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'absolute', top: 0, left: 0, right: 0, height: '30px', boxSizing: 'border-box', zIndex: 10 }}>
    <h4 style={{ margin: 0, fontSize: '14px' }}>Nested Header</h4>
    <button onClick={() => alert('Setting clicked!')} style={{ padding: '2px 8px', fontSize: '12px', cursor: 'pointer' }}>Setting</button>
  </div>
);
const TextWidget = () => (
  <div style={{ padding: '10px', backgroundColor: '#f0f8ff', border: '1px solid #add8e6', borderRadius: '4px', textAlign: 'center', height: '100%', width: '100%', boxSizing: 'border-box' }}>
    <p onClick={() => console.log('anjay')} style={{ "cursor": "pointer" }}>Widget Teks</p>
  </div>
);

function App() {
  // State untuk menyimpan opsi grid tersimpan
  const [savedOptions, setSavedOptions] = useState(null);
  // Ref untuk container grid
  const gridContainerRef = useRef(null);
  // State untuk instance grid
  const [grid, setGrid] = useState(null);
  // Map untuk menyimpan root React per elemen grid
  const rootsMap = useRef(new Map());

  // Definisi data subgrid untuk sidebar drag
  const sub1 = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 }
  ];
  let count = 0;
  // Tetapkan konten ke setiap item di subgrid
  sub1.forEach(d => d.content = String(count++));

  // Definisi opsi grid utama
  const options = {
    cellHeight: 50,
    margin: 5,
    acceptWidgets: true,
    id: 'main',
    resizable: { handles: 'se,e,s,sw,w' },
    minRow: 10, // Pastikan grid terlihat meski kosong
    children: [] // Grid kosong, isi dengan drag
  };

  // Inisialisasi callback render GridStack untuk rendering konten yang aman
  useEffect(() => {
    GridStack.renderCB = function (el, w) {
      if (w.content) {
        if (typeof w.content === 'string') {
          el.innerHTML = DOMPurify.sanitize(w.content);
        } else if (React.isValidElement(w.content)) {
          // Render komponen React hanya jika belum ada root
          if (!rootsMap.current.has(el)) {
            const root = createRoot(el);
            rootsMap.current.set(el, root);
            root.render(w.content);
          }
        }
      }
    };
  }, []);

  // Inisialisasi grid saat komponen mount
  useEffect(() => {
    if (gridContainerRef.current) {
      const newGrid = GridStack.addGrid(gridContainerRef.current, options);
      setGrid(newGrid);

      // Setup drag drop behavior untuk nested dan widget
      const sidebarContentNested = [
        {
          w: 5, h: 5,
          // content: <HeaderWidget />,
          subGridOpts: {
            children: [],
            acceptWidgets: true,
          }
        }
      ];
      const sidebarContentText = [
        { w: 2, h: 2, content: <TextWidget /> }
      ];
      GridStack.setupDragIn('.sidebar-item-nested', undefined, sidebarContentNested);
      GridStack.setupDragIn('.sidebar-item-text', undefined, sidebarContentText);
    }
  }, []);

  // Cleanup roots saat unmount
  useEffect(() => {
    return () => {
      rootsMap.current.forEach(root => root.unmount());
      rootsMap.current.clear();
    };
  }, []);

  // Fungsi untuk menyimpan layout grid dan console JSON
  const saveLayout = () => {
    if (grid) {
      const saved = grid.save(true, true);
      setSavedOptions(saved);
      console.log('Layout JSON:', JSON.stringify(saved, null, 2)); // Console JSON layout
    }
  };

  // Fungsi untuk menghancurkan grid
  const destroyGrid = () => {
    if (grid) {
      grid.destroy();
      setGrid(null);
      setSavedOptions(null);
      // Cleanup roots
      rootsMap.current.forEach(root => root.unmount());
      rootsMap.current.clear();
    }
  };

  return (
    <div className="container-fluid">
      <h1>Nested grids demo di React Vite</h1>
      <div className="actions" style={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
        <button className="btn btn-primary" onClick={saveLayout}>Simpan Layout</button> {/* Simpan layout dan console JSON */}
      </div>

      {/* Komponen sidebar drag */}
      <SidebarDrag />

      <br /><br />
      {/* Container grid */}
      <div ref={gridContainerRef} className="grid-stack main-grid"></div>
    </div>
  );
}

export default App;