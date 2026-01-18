
export function WindowControls() {
  const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.platform);
  const isWindows = typeof navigator !== 'undefined' && /Win/.test(navigator.platform);

  if (isMac) {
    // macOS style (traffic lights)
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        height: '32px',
        padding: '0 12px',
        WebkitAppRegion: 'drag',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1000,
      }}>
        <button
          aria-label="Close"
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: '#ff5f56',
            border: 'none',
            marginRight: 4,
            WebkitAppRegion: 'no-drag',
            cursor: 'pointer',
          }}
          onClick={() => window.electronAPI?.close?.()}
        />
        <button
          aria-label="Minimize"
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: '#ffbd2e',
            border: 'none',
            marginRight: 4,
            WebkitAppRegion: 'no-drag',
            cursor: 'pointer',
          }}
          onClick={() => window.electronAPI?.minimize?.()}
        />
        <button
          aria-label="Maximize"
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: '#27c93f',
            border: 'none',
            WebkitAppRegion: 'no-drag',
            cursor: 'pointer',
          }}
          onClick={() => window.electronAPI?.maximize?.()}
        />
      </div>
    );
  }

  if (isWindows) {
    // Windows style (rectangle buttons)
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0',
        height: '32px',
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 1000,
        WebkitAppRegion: 'drag',
      }}>
        <button
          aria-label="Minimize"
          style={{
            width: 46,
            height: 32,
            background: 'transparent',
            border: 'none',
            WebkitAppRegion: 'no-drag',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => window.electronAPI?.minimize?.()}
        >
          <svg width="10" height="2"><rect width="10" height="2" fill="#222" /></svg>
        </button>
        <button
          aria-label="Maximize"
          style={{
            width: 46,
            height: 32,
            background: 'transparent',
            border: 'none',
            WebkitAppRegion: 'no-drag',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => window.electronAPI?.maximize?.()}
        >
          <svg width="10" height="10"><rect x="1" y="1" width="8" height="8" fill="none" stroke="#222" strokeWidth="1.5" /></svg>
        </button>
        <button
          aria-label="Close"
          style={{
            width: 46,
            height: 32,
            background: 'transparent',
            border: 'none',
            WebkitAppRegion: 'no-drag',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => window.electronAPI?.close?.()}
          onMouseOver={e => (e.currentTarget.style.background = '#e81123')}
          onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
        >
          <svg width="10" height="10"><line x1="1" y1="1" x2="9" y2="9" stroke="#222" strokeWidth="1.5" /><line x1="9" y1="1" x2="1" y2="9" stroke="#222" strokeWidth="1.5" /></svg>
        </button>
      </div>
    );
  }

  // Default fallback (macOS style)
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      height: '32px',
      padding: '0 12px',
      WebkitAppRegion: 'drag',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 1000,
    }}>
      <button
        aria-label="Close"
        style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: '#ff5f56',
          border: 'none',
          marginRight: 4,
          WebkitAppRegion: 'no-drag',
          cursor: 'pointer',
        }}
        onClick={() => window.electronAPI?.close?.()}
      />
      <button
        aria-label="Minimize"
        style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: '#ffbd2e',
          border: 'none',
          marginRight: 4,
          WebkitAppRegion: 'no-drag',
          cursor: 'pointer',
        }}
        onClick={() => window.electronAPI?.minimize?.()}
      />
      <button
        aria-label="Maximize"
        style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: '#27c93f',
          border: 'none',
          WebkitAppRegion: 'no-drag',
          cursor: 'pointer',
        }}
        onClick={() => window.electronAPI?.maximize?.()}
      />
    </div>
  );
}
