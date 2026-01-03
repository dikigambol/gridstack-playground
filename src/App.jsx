import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { GridStack } from 'gridstack';
import DOMPurify from 'dompurify';
import 'gridstack/dist/gridstack.min.css'; // Import CSS GridStack untuk styling grid
import './App.css'; // CSS tambahan jika diperlukan
import SidebarDrag from './SidebarDrag'; // Import komponen sidebar drag
import { getWidgetComponent } from './components'; // Import fungsi untuk mendapatkan komponen widget

function App() {
  // State untuk menyimpan opsi grid tersimpan
  const [savedOptions, setSavedOptions] = useState(null);
  // Ref untuk container grid
  const gridContainerRef = useRef(null);
  // State untuk instance grid
  const [grid, setGrid] = useState(null);
  // Map untuk menyimpan root React per elemen grid
  const rootsMap = useRef(new Map());
  // Map untuk menyimpan instance subgrids
  const subGridsMap = useRef(new Map());

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
    // Hanya drag lewat elemen dengan class .widget-header
    draggable: { handle: '.widget-header' },
    minRow: 10, // Pastikan grid terlihat meski kosong
    children: [] // Grid kosong, isi dengan drag
  };

  // Inisialisasi callback render GridStack untuk rendering konten yang aman
  useEffect(() => {
    GridStack.renderCB = function (el, w) {
      // Jika content adalah objek dengan type (dari load), set w.type
      if (w.content && typeof w.content === 'object' && w.content.type && !w.type) {
        w.type = w.content.type;
      }
      // Pastikan ada id unik
      if (!w.id) {
        w.id = crypto.randomUUID();
      }
      if (w.type) {
        // Render komponen berdasarkan type dari registry
        const Component = getWidgetComponent(w.type);
        if (Component && !rootsMap.current.has(el)) {
          const root = createRoot(el);
          rootsMap.current.set(el, root);
          root.render(<Component id={w.id} />);
          // Init subgrid after React mounts inner .grid-stack element
          requestAnimationFrame(() => {
            if (w.subGridOpts) {
              const sub = el.querySelector('.grid-stack');
              if (sub && !subGridsMap.current.has(sub)) {
                const sg = GridStack.addGrid(sub, w.subGridOpts);
                subGridsMap.current.set(sub, sg);
              }
            }
          });
        }
      } else if (w.content) {
        if (typeof w.content === 'string') {
          el.innerHTML = DOMPurify.sanitize(w.content);
        } else if (React.isValidElement(w.content)) {
          // Render komponen React hanya jika belum ada root
          if (!rootsMap.current.has(el)) {
            const root = createRoot(el);
            rootsMap.current.set(el, root);
            root.render(w.content);
            // Init subgrid after React mounts inner .grid-stack element
            requestAnimationFrame(() => {
              if (w.subGridOpts) {
                const sub = el.querySelector('.grid-stack');
                if (sub && !subGridsMap.current.has(sub)) {
                  const sg = GridStack.addGrid(sub, w.subGridOpts);
                  subGridsMap.current.set(sub, sg);
                }
              }
            });
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
          id: crypto.randomUUID(),
          type: 'Container Widget',
          content: { type: 'Container Widget' },
          subGridOpts: {
            children: [],
            acceptWidgets: true,
          }
        }
      ];
      const sidebarContentText = [
        { w: 2, h: 3, id: crypto.randomUUID(), type: 'Text Widget', content: { type: 'Text Widget' } }
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
      subGridsMap.current.forEach(sg => sg.destroy());
      subGridsMap.current.clear();
    };
  }, []);

  // Fungsi untuk menyimpan layout grid dan console JSON
  const saveLayout = () => {
    if (grid) {
      const saved = grid.save(true, true);
      // Fungsi rekursif untuk mengganti content dengan type dan hapus type
      const processSaved = (items) => {
        items.forEach(item => {
          if (item.type) {
            item.content = { type: item.type };
            delete item.type;
          }
          if (item.subGridOpts && item.subGridOpts.children) {
            processSaved(item.subGridOpts.children);
          }
        });
      };
      processSaved(saved.children || []);
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
      subGridsMap.current.forEach(sg => sg.destroy());
      subGridsMap.current.clear();
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