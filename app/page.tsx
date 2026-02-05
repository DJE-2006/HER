'use client';

import { useState, useEffect } from 'react';
import './styles.css';

export default function ValentinePage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showPhoneNotif, setShowPhoneNotif] = useState(false);
  const [phoneNotifMessage, setPhoneNotifMessage] = useState('');
  const [notifTime, setNotifTime] = useState('');
  const [roses, setRoses] = useState<Array<{ x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const createFirework = (x: number, y: number, color: string) => {
    const fireworksContainer = document.getElementById('fireworks');
    if (!fireworksContainer) return;

    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'firework';
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      particle.style.background = color;

      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = Math.random() * 100 + 50;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity;

      particle.style.setProperty('--tx', tx + 'px');
      particle.style.setProperty('--ty', ty + 'px');

      fireworksContainer.appendChild(particle);
      setTimeout(() => particle.remove(), 1500);
    }
  };

  const celebrateWithFireworks = () => {
    const colors = ['#FF69B4', '#FFB6C1', '#FF1493', '#FFD700', '#FFA500', '#FF6B9D'];
    let count = 0;
    const interval = setInterval(() => {
      if (count >= 20) {
        clearInterval(interval);
        return;
      }
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const color = colors[Math.floor(Math.random() * colors.length)];
      createFirework(x, y, color);
      count++;
    }, 200);
  };

  const showToastNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const sendNotification = async (response: 'yes' | 'no') => {
    const timestamp = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const message = response === 'yes'
      ? '💖 SHE SAID YES! She clicked the Yes button! 🎉'
      : '💔 She clicked No. Better luck next time.';

    setPhoneNotifMessage(message);
    setNotifTime(timestamp);
    setShowPhoneNotif(true);

    setTimeout(() => setShowPhoneNotif(false), 8000);

    // Vibrate
    if ('vibrate' in navigator) {
      navigator.vibrate(response === 'yes' ? [200, 100, 200] : [300]);
    }

    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Valentine Response', {
        body: message,
      });
    }

    // Send to backend API
    try {
      await fetch('/api/submit-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          response,
          answer: response === 'yes' ? 'She said YES! 💖' : 'She said No 💔',
          timestamp,
          date: new Date().toLocaleDateString()
        })
      });
    } catch (error) {
      console.error('Failed to send response:', error);
    }
  };

  const handleYesClick = () => {
    setShowSuccess(true);

    // Create roses
    const positions = [
      { x: 50, y: 100, delay: 0 },
      { x: window.innerWidth - 150, y: 100, delay: 0.2 },
      { x: 100, y: window.innerHeight - 200, delay: 0.4 },
      { x: window.innerWidth - 200, y: window.innerHeight - 200, delay: 0.6 }
    ];
    setRoses(positions);

    celebrateWithFireworks();
    showToastNotification('🎉 Yayyy! You said YES! 💖');
    sendNotification('yes');

    // Change background
    document.body.style.background = 'linear-gradient(135deg, #FFE4E9 0%, #FFB6C1 50%, #FF69B4 100%)';
  };

  const handleNoClick = () => {
    setShowModal(true);
    document.body.style.filter = 'grayscale(30%)';
    showToastNotification('💗 Your honesty is appreciated');
    sendNotification('no');
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.filter = 'none';
  };

  return (
    <>
      {/* Floating Hearts */}
      <div className="floating-hearts">
        {Array.from({ length: 15 }).map((_, i) => {
          const hearts = ['💕', '💖', '💗', '💝', '💓', '💞'];
          return (
            <div
              key={i}
              className="heart-particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                fontSize: `${Math.random() * 20 + 15}px`
              }}
            >
              {hearts[Math.floor(Math.random() * hearts.length)]}
            </div>
          );
        })}
      </div>

      {/* Fireworks */}
      <div className="fireworks" id="fireworks"></div>

      {/* Falling Petals */}
      <div className="petals-container">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="petal"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 5 + 5}s`,
              animationDelay: `${Math.random() * 5}s`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          />
        ))}
      </div>

      {/* Roses */}
      {roses.map((rose, index) => (
        <div
          key={index}
          className="rose"
          style={{
            left: `${rose.x}px`,
            top: `${rose.y}px`,
            animationDelay: `${rose.delay}s`
          }}
        >
          <div className="rose-petals">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rose-petal" />
            ))}
            <div className="rose-center" />
          </div>
          <div className="rose-stem" />
        </div>
      ))}

      {/* Main Container */}
      <div className="container">
        {!showSuccess ? (
          <div className="content-box">
            <h1>💕 Happy Valentine&apos;s Day 💕</h1>
            <p className="message">
              Every time I see you, my day gets a little brighter.
              Your smile is contagious, and being around you feels like the best part of my day.
              I&apos;d love to spend this Valentine&apos;s Day getting to know you better.
            </p>
            <p className="question">Would You Like To Go Out With Me?</p>

            <div className="button-container">
              <button className="btn btn-yes" onClick={handleYesClick}>
                <span>Yes 💖</span>
              </button>
              <button className="btn btn-no" onClick={handleNoClick}>
                <span>No 💔</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="content-box success-state show">
            <div className="success-emoji">🎉💖🌹</div>
            <h1>You Just Made My Day! 💕</h1>
            <p className="message">
              Thank you for saying yes! I&apos;m so excited and can&apos;t wait to spend Valentine&apos;s Day with you.
              I promise to make it a memorable and wonderful experience!
            </p>
            <p className="question">Looking forward to our date! ❤️✨</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>💗 That&apos;s Okay 💗</h2>
            <p>
              Thank you for being honest with me. I really appreciate you taking the time to consider it.
              I hope we can still be friends and that you have a wonderful Valentine&apos;s Day!
            </p>
            <button className="modal-close" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && (
        <div className="toast show">
          <div className="toast-content">
            <span className="toast-icon">💗</span>
            <span className="toast-message">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Phone Notification */}
      {showPhoneNotif && (
        <div className="phone-notification show">
          <div className="phone-notif-header">
            <span className="phone-icon">📱</span>
            <span className="phone-title">Valentine Response</span>
          </div>
          <div className="phone-notif-body">
            <p>{phoneNotifMessage}</p>
            <span className="phone-notif-time">{notifTime}</span>
          </div>
        </div>
      )}
    </>
  );
}