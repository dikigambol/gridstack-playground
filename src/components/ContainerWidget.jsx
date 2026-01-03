import React from 'react';

const ContainerWidget = ({ id }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
    <div className="widget-header" style={{ padding: '5px', backgroundColor: 'navy', color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '30px', boxSizing: 'border-box', zIndex: 10, cursor: 'grab' }}>
      <h4 style={{ margin: 0, fontSize: '14px' }}>Container Widget</h4>
      <button
        onMouseDown={e => e.stopPropagation()}
        onPointerDown={e => e.stopPropagation()}
        onClick={() => alert('Setting clicked!')}
        style={{ padding: '2px 8px', fontSize: '12px', cursor: 'pointer' }}
      >
        Setting
      </button>
    </div>
    <div className="grid-stack" style={{ flex: 1, minHeight: 0, overflow: 'auto', backgroundColor: 'yellow' }} />
  </div>
);

export default ContainerWidget;