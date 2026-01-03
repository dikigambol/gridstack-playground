import React from 'react';

const TextWidget = ({ id }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
    <div className="widget-header" style={{ padding: '5px', backgroundColor: '#e0e0e0', borderBottom: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '30px', boxSizing: 'border-box', zIndex: 10, cursor: 'grab' }}>
      <h4 style={{ margin: 0, fontSize: '14px' }}>Text Widget</h4>
      <button
        onMouseDown={e => e.stopPropagation()}
        onPointerDown={e => e.stopPropagation()}
        onClick={() => alert('Setting clicked!')}
        style={{ padding: '2px 8px', fontSize: '12px', cursor: 'pointer' }}
      >
        Setting
      </button>
    </div>
    <div style={{ padding: '10px', backgroundColor: '#f0f8ff', border: '1px solid #add8e6', borderRadius: '4px', textAlign: 'center', flex: 1, boxSizing: 'border-box' }}>
      <p
        onClick={() => console.log('anjay')}
        onMouseDown={e => e.stopPropagation()}
        onPointerDown={e => e.stopPropagation()}
        style={{ cursor: 'pointer' }}
      >
        Widget Teks - ID: {id}
      </p>
    </div>
  </div>
);

export default TextWidget;