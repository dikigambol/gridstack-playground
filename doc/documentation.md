# 📚 Dokumentasi GridStack Playground

> Proyek React + Vite dengan GridStack untuk widget modular drag-and-drop.

## 🎯 Ringkasan Perubahan
- ✅ Pisah komponen ke `components/` untuk modularitas.
- ✅ Ganti penyimpanan konten: HTML string → objek `{ type }`.
- ✅ Container Widget: nesting widget dengan subgrid.
- ✅ ID unik per widget instance.
- ✅ Rendering aman via registry.

## 📁 Struktur Folder
```
d:\gridstack-playground\
├── src/
│   ├── components/     # Widget registry & komponen
│   ├── App.jsx         # Main app logic
│   └── SidebarDrag.jsx # Drag sidebar
├── doc/
│   └── documentation.md # This file
└── ...
```

## 📋 Legend Skrip

| File | Fungsi Utama | Isi Utama | Peran |
|------|--------------|-----------|-------|
| `src/components/index.js` | Registry widget | Import komponen, `widgetRegistry`, getter functions | Modular: tambah widget tanpa ubah `App.jsx` |
| `src/components/ContainerWidget.jsx` | Widget container dengan subgrid | Header + area subgrid (`acceptWidgets: true`) | Nesting: drag widget ke dalam |
| `src/components/TextWidget.jsx` | Widget teks sederhana | Header + teks (tampil ID) | Contoh widget dasar |
| `src/App.jsx` | Main app orchestrator | State grid, `renderCB`, save/load logic | Integrasi GridStack + React, aman tanpa HTML |
| `src/SidebarDrag.jsx` | Sidebar drag UI | Daftar widget drag-able | Enable drag dari sidebar |

## 🔧 Langkah Implementasi
1. **Pisah Komponen**: Pindah `NestedWidget` & `TextWidget` ke `components/`, buat registry.
2. **Container Widget**: Ganti nested dengan container yang punya subgrid internal.
3. **Type-Based Rendering**: Simpan `content: { type }`, render via `getWidgetComponent(w.type)`.
4. **ID Unik**: Generate `crypto.randomUUID()` per widget, persistent save/load.
5. **Save/Load**: `saveLayout` set `content = { type }`, load set `w.type` dari `content`.

## 🔍 Detail Fungsi

### `src/components/index.js`
- **Imports**: React & widget components.
- **`widgetRegistry`**: Map nama → { component, defaultSize, defaultData }.
- **Getters**: `getWidgetComponent(label)`, `getWidgetConfig(label)`, dll.
- **Exports**: Registry & functions.

### `src/App.jsx`
- **State/Refs**: `savedOptions`, `grid`, `rootsMap`, `subGridsMap`, `gridContainerRef`.
- **`useEffect[0]`**: Setup `GridStack.renderCB` → render by type, generate ID, init subgrid.
- **`useEffect[1]`**: Init grid, setup drag with `sidebarContent` (id, type, content).
- **`useEffect[2]`**: Cleanup: unmount roots, destroy subgrids.
- **`saveLayout()`**: Save JSON, traverse set `content = { type }`, delete `type`.
- **`destroyGrid()`**: Reset grid & state.
- **JSX**: UI layout (header, save button, sidebar, grid container).

## 🚀 Cara Menjalankan
1. `npm install`
2. `npm run dev`
3. Drag widget dari sidebar ke grid.
4. Klik "Simpan Layout" → lihat JSON di console.

## 📝 Catatan
- **Keamanan**: No `innerHTML`, React rendering aman.
- **Performa**: Cache roots & subgrids.
- **Modular**: Tambah widget di `index.js`.
- **ID**: Unik, persistent, gunakan untuk state/tracking.