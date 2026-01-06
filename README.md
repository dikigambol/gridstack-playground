# GridStack Playground

> Proyek React + Vite dengan GridStack untuk widget modular drag-and-drop dengan nested grid support.

## 🌐 Live Demo

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GridStack%20Playground-blue)](https://gridstack-playground.vercel.app/)

Coba aplikasi langsung di browser: [https://gridstack-playground.vercel.app/](https://gridstack-playground.vercel.app/)

## 📋 Deskripsi Proyek

GridStack Playground adalah aplikasi demo yang menunjukkan implementasi GridStack.js dalam React untuk membuat dashboard modular dengan kemampuan drag-and-drop widget. Proyek ini fokus pada nested grids (grid di dalam grid) dengan unlimited level depth, cocok untuk aplikasi dashboard dinamis seperti CMS, dashboard analytics, atau editor visual.

## 🛠️ Tech Stack

- **Frontend Framework**: React 18+ dengan Vite
- **Grid System**: GridStack.js - Library untuk grid layout dengan drag & drop
- **Styling**: CSS modules + GridStack built-in CSS
- **Security**: DOMPurify untuk sanitasi HTML
- **Build Tool**: Vite (fast HMR, optimized build)
- **Package Manager**: npm

## 🎯 Fitur Utama

- ✅ **Widget Modular**: Sistem registry untuk widget yang dapat dikustomisasi
- ✅ **Nested Grid Support**: Grid di dalam grid dengan unlimited level
- ✅ **Drag & Drop**: Drag widget dari sidebar ke grid utama atau subgrid
- ✅ **Persistent Layout**: Auto-save/load layout ke localStorage
- ✅ **Type-based Rendering**: Rendering aman menggunakan React components
- ✅ **Unique ID System**: Setiap widget instance memiliki ID unik
- ✅ **Responsive Design**: Grid yang dapat di-resize dan di-drag

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm atau yarn

### Installation

```bash
# Clone repository
git clone https://github.com/dikigambol/gridstack-playground.git
cd gridstack-playground

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
# Build optimized version
npm run build

# Preview production build
npm run preview
```

## 📖 Penggunaan

1. **Auto-load**: Layout tersimpan akan dimuat otomatis saat aplikasi start
2. **Drag Widget**: Seret widget dari sidebar ke area grid
3. **Nested Grids**: Drag widget ke dalam "Container Widget" untuk membuat subgrid
4. **Save Layout**: Klik "Simpan Layout" untuk menyimpan ke localStorage
5. **Manual Load**: Klik "Load Layout" jika perlu load manual (opsional)

## 🏗️ Arsitektur

```
src/
├── components/           # Widget registry & komponen
│   ├── index.js          # Registry widget & getter functions
│   ├── ContainerWidget.jsx  # Widget container dengan subgrid
│   └── TextWidget.jsx       # Widget teks sederhana
├── App.jsx               # Main app logic (grid setup, save/load)
├── App.css               # Styling untuk grid & widget
└── SidebarDrag.jsx       # Sidebar drag UI
```

### Komponen Utama

- **Widget Registry**: Sistem mapping type → component untuk modularitas
- **GridStack Integration**: Wrapper React untuk GridStack.js
- **State Management**: React hooks untuk grid instance & layout
- **Render Callback**: Custom rendering dengan React.createRoot untuk safety

## 🔧 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Adding New Widgets

1. Buat komponen baru di `src/components/`
2. Register di `src/components/index.js`:

```jsx
export const widgetRegistry = {
  // ... existing widgets
  "New Widget": {
    component: NewWidgetComponent,
    defaultSize: { w: 3, h: 2 },
    defaultData: { /* default props */ }
  }
};
```

## 📚 Dokumentasi Lengkap

Lihat [`doc/documentation.md`](doc/documentation.md) untuk dokumentasi teknis detail, termasuk:
- Setup GridStack step-by-step
- Implementasi save/load layout
- Troubleshooting guide
- API reference

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [GridStack.js](https://gridstackjs.com/) - Core grid library
- [React](https://reactjs.org/) - UI framework
- [Vite](https://vitejs.dev/) - Build tool
- [DOMPurify](https://github.com/cure53/DOMPurify) - HTML sanitization
