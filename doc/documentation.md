# 📚 Dokumentasi GridStack Playground

> Proyek React + Vite dengan GridStack untuk widget modular drag-and-drop dengan nested grid support.

## 📁 Struktur Folder

```
d:\gridstack-playground\
├── src/
│   ├── components/           # Widget registry & komponen
│   │   ├── index.js          # Registry widget & getter functions
│   │   ├── ContainerWidget.jsx  # Widget container dengan subgrid
│   │   └── TextWidget.jsx       # Widget teks sederhana
│   ├── App.jsx               # Main app logic (grid setup, save/load)
│   ├── App.css               # Styling untuk grid & widget
│   └── SidebarDrag.jsx       # Sidebar drag UI
├── doc/
│   └── documentation.md      # This file
└── ...
```

## 🎯 Fitur Utama

- ✅ Widget modular dengan registry system
- ✅ Nested grid unlimited level support
- ✅ Drag & drop dari sidebar ke grid
- ✅ Save/Load layout ke localStorage
- ✅ Rendering aman dengan React (no innerHTML)
- ✅ ID unik per widget instance
- ✅ Type-based rendering system

---

## 1. Setup GridStack

### 1.1 Import dan Dependencies

```jsx
import { GridStack } from 'gridstack';
import 'gridstack/dist/gridstack.min.css';
import DOMPurify from 'dompurify';
```

- **GridStack**: Library utama untuk grid layout system
- **gridstack.min.css**: Styling default untuk grid
- **DOMPurify**: Untuk sanitasi HTML (jika diperlukan)

### 1.2 Konfigurasi Grid Options

```jsx
const options = {
  cellHeight: 50,        // Tinggi setiap cell dalam pixel
  margin: 5,             // Margin antar widget
  acceptWidgets: true,   // Menerima widget dari drag & drop
  id: 'main',            // ID unik untuk grid
  resizable: { 
    handles: 'se,e,s,sw,w'  // Handle untuk resize (south-east, east, south, south-west, west)
  },
  draggable: { 
    handle: '.widget-header'  // Hanya bisa drag melalui header widget
  },
  minRow: 10,            // Minimal baris grid (agar grid terlihat meski kosong)
  children: []           // Array widget awal (kosong, diisi via drag)
};
```

### 1.3 Inisialisasi Grid

```jsx
useEffect(() => {
  if (gridContainerRef.current) {
    const newGrid = GridStack.addGrid(gridContainerRef.current, options);
    setGrid(newGrid);
  }
}, []);
```

**Penjelasan:**
- Menggunakan `useRef` untuk menyimpan referensi DOM element
- `GridStack.addGrid()` membuat instance grid baru
- Grid akan ter-attach ke element dengan class `grid-stack`

### 1.4 State Management

```jsx
const [grid, setGrid] = useState(null);                    // Instance grid utama
const gridContainerRef = useRef(null);                     // Ref ke DOM container
const rootsMap = useRef(new Map());                        // Map untuk React roots (untuk cleanup)
const subGridsMap = useRef(new Map());                     // Map untuk subgrid instances
```

**Kenapa menggunakan Map?**
- **rootsMap**: Menyimpan React root per widget element untuk unmount yang proper
- **subGridsMap**: Menyimpan subgrid instances untuk nested grid management

---

## 2. Komponen

### 2.1 Widget Registry System

**File: `src/components/index.js`**

Registry adalah sistem mapping antara nama widget dengan komponen React-nya:

```jsx
export const widgetRegistry = {
  "Container Widget": {
    component: ContainerWidget,
    defaultSize: { w: 4, h: 4 },
    defaultData: { gridLayout: [] }
  },
  "Text Widget": {
    component: TextWidget,
    defaultSize: { w: 2, h: 3 },
    defaultData: { text: "Widget Teks" }
  }
};
```

**Getter Functions:**

```jsx
// Mendapatkan komponen React berdasarkan type
export const getWidgetComponent = (label) => {
  return widgetRegistry[label]?.component || null;
};

// Mendapatkan konfigurasi widget
export const getWidgetConfig = (label) => {
  return widgetRegistry[label] || null;
};
```

**Keuntungan Registry System:**
- Modular: Tambah widget baru cukup di `index.js`
- Type-safe: Type widget terpusat di satu tempat
- Easy lookup: Akses komponen via string type

### 2.2 Container Widget

**File: `src/components/ContainerWidget.jsx`**

Widget container dengan nested grid support:

```jsx
const ContainerWidget = ({ id }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    {/* Header dengan drag handle */}
    <div className="widget-header" style={{ ... }}>
      <h4>Container Widget</h4>
      <button>Setting</button>
    </div>
    
    {/* Area untuk nested grid - PENTING: harus ada class "grid-stack" */}
    <div className="grid-stack" style={{ flex: 1, ... }} />
  </div>
);
```

**Fitur Penting:**
- **`.widget-header`**: Handle untuk drag (sesuai konfigurasi `draggable.handle`)
- **`.grid-stack`**: Class wajib untuk nested grid container
- **`id` prop**: ID unik widget (dari GridStack)

### 2.3 Text Widget

**File: `src/components/TextWidget.jsx`**

Widget sederhana untuk menampilkan konten:

```jsx
const TextWidget = ({ id }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <div className="widget-header" style={{ ... }}>
      <h4>Text Widget</h4>
      <button>Setting</button>
    </div>
    <div style={{ padding: '10px', ... }}>
      <p>Widget Teks - ID: {id}</p>
    </div>
  </div>
);
```

**Struktur Umum Widget:**
1. Container utama dengan `height: 100%`
2. Header dengan class `.widget-header` (untuk drag handle)
3. Content area sesuai kebutuhan widget

---

## 3. Render Content dari Komponen

### 3.1 GridStack.renderCB

GridStack menggunakan callback `renderCB` untuk merender konten setiap widget:

```jsx
GridStack.renderCB = function (el, w) {
  // el: DOM element untuk widget
  // w: Widget data object (id, type, content, subGridOpts, dll)
};
```

### 3.2 Flow Rendering

```jsx
GridStack.renderCB = function (el, w) {
  // 1. Set type dari content (untuk data dari localStorage)
  if (w.content && typeof w.content === 'object' && w.content.type && !w.type) {
    w.type = w.content.type;
  }
  
  // 2. Generate ID jika belum ada
  if (!w.id) {
    w.id = crypto.randomUUID();
  }
  
  // 3. Render berdasarkan type
  if (w.type) {
    const Component = getWidgetComponent(w.type);
    if (Component && !rootsMap.current.has(el)) {
      const root = createRoot(el);
      rootsMap.current.set(el, root);
      root.render(<Component id={w.id} />);
      
      // 4. Init subgrid jika ada subGridOpts
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
};
```

### 3.3 Mengapa Menggunakan createRoot?

- **React 18+**: `createRoot` adalah API baru untuk rendering
- **Multiple roots**: Setiap widget punya root sendiri (bukan single root untuk semua)
- **Cleanup**: Root disimpan di `rootsMap` untuk unmount yang proper

### 3.4 Nested Grid Initialization

Ketika widget memiliki `subGridOpts`, subgrid diinisialisasi setelah React element ter-mount:

```jsx
requestAnimationFrame(() => {
  const sub = el.querySelector('.grid-stack');
  if (sub && !subGridsMap.current.has(sub)) {
    const sg = GridStack.addGrid(sub, w.subGridOpts);
    subGridsMap.current.set(sub, sg);
  }
});
```

**Kenapa `requestAnimationFrame`?**
- Memastikan React element sudah ter-render ke DOM
- Menunggu DOM update sebelum query `.grid-stack`

---

## 4. Save Layout

### 4.1 Fungsi saveLayout

```jsx
const saveLayout = () => {
  if (grid) {
    // 1. Save grid state (termasuk nested grids)
    const saved = grid.save(true, true);
    
    // 2. Process untuk format localStorage
    processSaved(saved.children || []);
    
    // 3. Simpan ke localStorage
    localStorage.setItem('gridLayout', JSON.stringify(saved));
  }
};
```

**Parameter `grid.save(true, true)`:**
- Parameter 1 (`content: true`): Include content dalam save
- Parameter 2 (`full: true`): Include semua properties (termasuk nested children)

### 4.2 Process Saved Data

Fungsi rekursif untuk mengubah format data:

```jsx
const processSaved = (items) => {
  items.forEach(item => {
    // Convert type → content: { type }
    if (item.type) {
      item.content = { type: item.type };
      delete item.type;
    }
    
    // Rekursif untuk nested children
    if (item.subGridOpts && item.subGridOpts.children) {
      processSaved(item.subGridOpts.children);
    }
  });
};
```

**Kenapa convert type ke content?**
- localStorage hanya bisa menyimpan JSON (tidak bisa function/React element)
- Type disimpan sebagai `content: { type: "Container Widget" }`
- Saat load, type akan di-set kembali dari `content.type`

### 4.3 Format Data yang Disimpan

```json
{
  "margin": 5,
  "acceptWidgets": true,
  "id": "main",
  "children": [
    {
      "w": 5,
      "h": 10,
      "id": "f55c27e7-26d4-459f-afc0-8571e1341c79",
      "content": {
        "type": "Container Widget"
      },
      "subGridOpts": {
        "acceptWidgets": true,
        "margin": 5,
        "cellHeight": 50,
        "children": [
          {
            "w": 2,
            "h": 3,
            "id": "6dce1c90-1d75-40fc-9cd6-a823abd74cac",
            "content": {
              "type": "Text Widget"
            }
          }
        ]
      }
    }
  ]
}
```

---

## 5. Load Layout

### 5.1 Fungsi loadLayout

```jsx
const loadLayout = () => {
  const savedJson = localStorage.getItem('gridLayout');
  if (savedJson && grid) {
    const saved = JSON.parse(savedJson);
    
    // 1. Clear existing state
    rootsMap.current.clear();
    subGridsMap.current.clear();
    
    // 2. Process data: set type dari content.type
    processLoad(saved.children || []);
    
    // 3. Clear grid
    grid.removeAll();
    
    // 4. Load widgets secara manual (rekursif)
    addItemsToGrid(saved.children || [], grid, 1);
  }
};
```

### 5.2 Process Load Data

Mengembalikan type dari content sebelum load:

```jsx
const processLoad = (items) => {
  items.forEach(item => {
    // Set type dari content.type
    if (item.content && typeof item.content === 'object' && item.content.type) {
      item.type = item.content.type;
    }
    
    // Rekursif untuk nested children
    if (item.subGridOpts && item.subGridOpts.children) {
      processLoad(item.subGridOpts.children);
    }
  });
};
```

### 5.3 Helper: waitForGridStack

Fungsi untuk menunggu React element ter-mount:

```jsx
const waitForGridStack = (el, callback, retries = 50) => {
  if (retries <= 0) {
    callback(null);
    return;
  }
  
  const sub = el.querySelector('.grid-stack');
  if (sub) {
    callback(sub);
  } else {
    // Double requestAnimationFrame untuk timing yang lebih baik
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        waitForGridStack(el, callback, retries - 1);
      });
    });
  }
};
```

**Kenapa perlu waitForGridStack?**
- React element butuh waktu untuk mount ke DOM
- `.grid-stack` element belum ada segera setelah `addWidget`
- Double `requestAnimationFrame` memastikan DOM sudah update

### 5.4 Fungsi addItemsToGrid (Rekursif)

Fungsi rekursif untuk load nested grids:

```jsx
const addItemsToGrid = (items, targetGrid, currentLevel = 1) => {
  items.forEach(item => {
    // 1. Extract children dari subGridOpts
    const children = item.subGridOpts?.children || [];
    
    // 2. Clone subGridOpts tanpa children (untuk addWidget)
    const subGridOpts = item.subGridOpts ? { ...item.subGridOpts } : undefined;
    if (subGridOpts && subGridOpts.children) delete subGridOpts.children;
    
    // 3. Add widget ke grid
    const widgetForAdd = { ...item, subGridOpts };
    const added = targetGrid.addWidget(widgetForAdd);
    
    // 4. Jika ada children, init subgrid dan load children
    if (children && children.length) {
      const el = typeof added?.el !== 'undefined' ? added.el : added;
      const delay = currentLevel * 50; // Delay meningkat per level
      
      setTimeout(() => {
        waitForGridStack(el, (sub) => {
          if (sub) {
            const sg = GridStack.addGrid(sub, subGridOpts || {});
            subGridsMap.current.set(sub, sg);
            
            // Rekursif: load children ke subgrid
            addItemsToGrid(children, sg, currentLevel + 1);
          }
        });
      }, delay);
    }
  });
};
```

**Alur Load:**
1. Load widget level 1 → Add ke main grid
2. Wait untuk React mount → Init subgrid
3. Load widget level 2 → Add ke subgrid
4. Repeat untuk level berikutnya (unlimited)

**Kenapa delay meningkat per level?**
- Level lebih dalam butuh waktu lebih lama untuk mount
- `currentLevel * 50ms` memberikan waktu cukup untuk React render

**Kenapa manual load (bukan grid.load)?**
- GridStack's `grid.load()` tidak handle nested structure dengan baik di React
- Manual load memastikan `renderCB` dipanggil untuk setiap widget
- Lebih control atas timing dan error handling

---

## 6. Drag & Drop Setup

### 6.1 Setup Drag dari Sidebar

```jsx
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

GridStack.setupDragIn('.sidebar-item-nested', undefined, sidebarContentNested);
```

**Parameter `setupDragIn`:**
1. Selector untuk draggable element (`.sidebar-item-nested`)
2. Options (undefined = default)
3. Widget data yang akan di-drag

---

## 7. Cleanup

### 7.1 Cleanup pada Unmount

```jsx
useEffect(() => {
  return () => {
    // Unmount semua React roots
    rootsMap.current.forEach(root => root.unmount());
    rootsMap.current.clear();
    
    // Destroy semua subgrids
    subGridsMap.current.forEach(sg => sg.destroy());
    subGridsMap.current.clear();
  };
}, []);
```

**Penting untuk:**
- Mencegah memory leaks
- Unmount React components dengan benar
- Destroy GridStack instances

---

## 🚀 Cara Menjalankan

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Penggunaan:**
   - Drag widget dari sidebar ke grid
   - Drag widget ke dalam Container Widget (nested grid)
   - Klik "Simpan Layout" → save ke localStorage
   - Klik "Load Layout" → restore dari localStorage

---

## 📝 Catatan Penting

### Keamanan
- ✅ **No `innerHTML`**: Semua rendering menggunakan React (kecuali string content dengan DOMPurify)
- ✅ **Type-based rendering**: Widget di-render berdasarkan type dari registry

### Performa
- ✅ **Root caching**: React roots disimpan di Map untuk reuse
- ✅ **Subgrid caching**: Subgrid instances disimpan untuk nested grid
- ✅ **Delay per level**: Mencegah race condition pada nested level dalam

### Modularitas
- ✅ **Registry system**: Tambah widget baru cukup di `components/index.js`
- ✅ **No hardcoding**: Semua widget type dari registry

### ID System
- ✅ **Unik**: Menggunakan `crypto.randomUUID()`
- ✅ **Persistent**: ID disimpan di localStorage
- ✅ **Tracking**: ID digunakan untuk state management

### Nested Grid
- ✅ **Unlimited level**: Tidak ada batasan level nesting
- ✅ **Proper timing**: Menggunakan `waitForGridStack` dan delay
- ✅ **Recursive load**: Load semua level secara rekursif

---

## 🔍 Troubleshooting

### Widget tidak muncul setelah load
- Check console untuk error
- Pastikan `renderCB` dipanggil (lihat log "renderCB called for:")
- Pastikan widget type ada di registry

### Nested grid level 3+ tidak muncul
- Pastikan `waitForGridStack` berhasil menemukan `.grid-stack` element
- Check delay waktu (mungkin perlu dinaikkan)
- Pastikan Container Widget memiliki class `.grid-stack`

### Memory leak
- Pastikan cleanup di unmount dipanggil
- Check `rootsMap` dan `subGridsMap` di clear dengan benar
