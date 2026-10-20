import React from 'react';

const EmptyTableState = ({ colSpan = 6, message = 'Belum ada laporan', subMessage = '' }) => {
  return (
    <tr>
      <td
        colSpan={colSpan}
        style={{
          padding: '48px 16px',
          textAlign: 'center',
          verticalAlign: 'middle',
          backgroundColor: '#ffffff'
        }}
      >
        <div
          data-testid="empty-table-state"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <img
            src="/empty-report.png"
            alt={message}
            style={{
              width: '150px',
              height: 'auto',
              display: 'block',
              margin: '0 auto',
              objectFit: 'contain'
            }}
          />
          {subMessage && (
            <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: '#9ca3af' }}>
              {subMessage}
            </p>
          )}
        </div>
      </td>
    </tr>
  );
};

export default EmptyTableState;
