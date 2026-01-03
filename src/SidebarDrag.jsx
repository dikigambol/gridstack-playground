import React from 'react';

const SidebarDrag = () => {
  return (
    <div className="sidebar-drag-container" style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
      {/* Item drag untuk nested grid */}
      <div className="sidebar-item-nested grid-stack-item" title="Drag untuk menambah nested grid">
        Drag Nested
      </div>
      {/* Item drag untuk widget teks */}
      <div className="sidebar-item-text grid-stack-item" title="Drag untuk menambah widget teks">
        Drag Teks
      </div>
    </div>
  );
};

export default SidebarDrag;