/**
 * auctions.js — Full localStorage-powered auction system (no backend)
 * 
 * Features:
 *  - Renders auction cards from localStorage
 *  - Live countdown timers per card
 *  - Bidding modal with validation ($5 minimum increment)
 *  - Auto-ends auctions when timer hits 0
 *  - Winner declaration + confetti
 *  - Saves won auction to user_auctions (feeds Profile page)
 *  - Seeds demo data if localStorage is empty
 */

// ─── Mock "current user" (in a real app this comes from auth) ────────────────
const CURRENT_USER = localStorage.getItem('current_user') || 'guest_user';

// ─── Seed demo auctions if none exist ────────────────────────────────────────
function seedDemoAuctions() {
  const existing = JSON.parse(localStorage.getItem('auctions') || '[]');
  if (existing.length > 0) return; // already have data

  const now = new Date();
  const hoursFromNow = (h) => new Date(now.getTime() + h * 3600 * 1000).toISOString();

  const demos = [
    {
      id: 1001,
      name: 'iPhone 13 Pro OLED Screen',
      condition: 'Original - Pull',
      description: 'Tested and fully functional. Removed from a locked device. No scratches.',
      image: 'imgs/hompage/repair.png',
      startingBid: 120,
      currentBid: 120,
      bidsCount: 0,
      endsAt: hoursFromNow(2),
      status: 'active',
      bids: [],
      winner: null
    },
    {
      id: 1002,
      name: 'MacBook Pro M1 Logic Board (8GB/256GB)',
      condition: 'Refurbished',
      description: 'Clean board, professionally inspected and cleaned. Power cycle stable.',
      image: 'imgs/hompage/bag.gif',
      startingBid: 250,
      currentBid: 250,
      bidsCount: 0,
      endsAt: hoursFromNow(5),
      status: 'active',
      bids: [],
      winner: null
    },
    {
      id: 1003,
      name: 'Samsung Galaxy S22 Battery Pack',
      condition: 'New',
      description: '4500mAh original OEM replacement battery. 100% health.',
      image: 'imgs/hompage/repair.png',
      startingBid: 30,
      currentBid: 30,
      bidsCount: 0,
      endsAt: hoursFromNow(0.5), // 30 min — quick auction for demo
      status: 'active',
      bids: [],
      winner: null
    }
  ];

  localStorage.setItem('auctions', JSON.stringify(demos));
}

// ─── Helper: get auctions from localStorage ───────────────────────────────────
function getAuctions() {
  return JSON.parse(localStorage.getItem('auctions') || '[]');
}

// ─── Helper: save auctions to localStorage ───────────────────────────────────
function saveAuctions(auctions) {
  localStorage.setItem('auctions', JSON.stringify(auctions));
}

// ─── Toast Notifications ─────────────────────────────────────────────────────
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = {
    success: 'fa-circle-check',
    error:   'fa-circle-xmark',
    info:    'fa-circle-info',
    warning: 'fa-triangle-exclamation'
  };
  toast.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i> ${message}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.4s ease forwards';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// ─── Countdown Formatter ──────────────────────────────────────────────────────
function formatCountdown(endsAt) {
  const diff = new Date(endsAt) - new Date();
  if (diff <= 0) return { text: 'Ended', urgent: false, ended: true };

  const totalSecs = Math.floor(diff / 1000);
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;

  const pad = (n) => String(n).padStart(2, '0');
  const text = h > 0 ? `${h}h ${pad(m)}m ${pad(s)}s` : `${pad(m)}m ${pad(s)}s`;
  return { text, urgent: diff < 3600000, ended: false }; // urgent if < 1 hour
}

// ─── Build last 3 bids HTML ───────────────────────────────────────────────────
function buildBidHistory(bids) {
  if (!bids || bids.length === 0) return '<span>No bids placed yet</span>';
  return bids.slice(-3).reverse().map(b =>
    `<span>🔺 <strong>${b.user}</strong> bid $${parseFloat(b.amount).toFixed(2)}</span>`
  ).join('');
}

// ─── Render All Auctions ──────────────────────────────────────────────────────
function renderAuctions() {
  const auctions = getAuctions();
  const grid = document.getElementById('auctions-grid');

  if (auctions.length === 0) {
    grid.innerHTML = `
      <div class="empty-auctions">
        <i class="fa-solid fa-gavel"></i>
        <p>No auctions are live right now. Check back soon!</p>
      </div>`;
    return;
  }

  grid.innerHTML = auctions.map(a => {
    const { text: countdownText, urgent, ended } = formatCountdown(a.endsAt);
    const isEnded = ended || a.status === 'ended';
    const isWinner = isEnded && a.winner === CURRENT_USER;

    return `
    <div class="auction-card ${isEnded ? 'ended-card' : ''}" id="card-${a.id}" data-id="${a.id}">
      <div class="auction-img">
        <img src="${a.image}" alt="${a.name}" />
        <span class="time-badge ${urgent && !isEnded ? 'urgent' : ''} ${isEnded ? 'ended' : ''}" id="timer-${a.id}">
          <i class="fa-regular fa-clock"></i>
          <span class="countdown">${isEnded ? '🔒 Ended' : countdownText}</span>
        </span>
      </div>
      <div class="auction-info">
        <span class="part-condition">${a.condition}</span>
        <h3 class="part-name">${a.name}</h3>
        <p class="part-desc">${a.description}</p>

        <div class="bid-status">
          <div class="price-box">
            <span class="label">Current Bid</span>
            <span class="current-price" id="price-${a.id}">$${parseFloat(a.currentBid).toFixed(2)}</span>
          </div>
          <div class="bids-count">
            <span class="label">Total Bids</span>
            <span class="count-num" id="count-${a.id}">${a.bidsCount} bid${a.bidsCount !== 1 ? 's' : ''}</span>
          </div>
        </div>

        <div class="bid-history" id="history-${a.id}">
          ${buildBidHistory(a.bids)}
        </div>

        ${isEnded
          ? isWinner
            ? `<div class="winner-badge"><i class="fa-solid fa-trophy"></i> You Won!</div>
               <button class="m-btn btn claim-btn" style="width:100%; margin-top:12px;" onclick="claimWin(${a.id})">
                 <i class="fa-solid fa-gift"></i> Claim Your Prize
               </button>`
            : `<p style="color:#ef4444; font-weight:700; margin-top:12px; font-size:0.95rem;">
                ${a.winner ? `🏆 Won by ${a.winner}` : 'Auction closed with no bids.'}
               </p>
               <button class="m-btn btn" style="width:100%; margin-top:8px; opacity:0.5; cursor:not-allowed;" disabled>
                 Auction Closed
               </button>`
          : `<button class="m-btn btn open-bid-modal" style="width:100%; margin-top:15px;"
               onclick="openBidModal(${a.id})">
               <i class="fa-solid fa-gavel"></i> Place Bid
             </button>`
        }
      </div>
    </div>`;
  }).join('');
}

// ─── Open Bid Modal ───────────────────────────────────────────────────────────
let activeAuctionId = null;

function openBidModal(auctionId) {
  const auctions = getAuctions();
  const auction = auctions.find(a => a.id === auctionId);
  if (!auction || auction.status === 'ended') return;

  // Check if timer already ended
  if (new Date(auction.endsAt) <= new Date()) {
    showToast('This auction has already ended.', 'warning');
    return;
  }

  activeAuctionId = auctionId;
  const minBid = parseFloat(auction.currentBid) + 5;

  document.getElementById('modal-part-name').textContent = auction.name;
  document.getElementById('modal-current-bid').textContent = `$${parseFloat(auction.currentBid).toFixed(2)}`;
  document.getElementById('min-bid-val').textContent = `$${minBid.toFixed(2)}`;

  const input = document.getElementById('bid-amount');
  input.value = minBid.toFixed(2);
  input.min = minBid;

  document.getElementById('bidModal').classList.add('open');
}

function closeBidModal() {
  document.getElementById('bidModal').classList.remove('open');
  activeAuctionId = null;
}

// ─── Confirm Bid ──────────────────────────────────────────────────────────────
document.getElementById('confirm-bid-btn').addEventListener('click', () => {
  if (!activeAuctionId) return;

  const auctions = getAuctions();
  const idx = auctions.findIndex(a => a.id === activeAuctionId);
  if (idx === -1) return;

  const auction = auctions[idx];
  const input = document.getElementById('bid-amount');
  const userBid = parseFloat(input.value);
  const minBid = parseFloat(auction.currentBid) + 5;

  // Validation
  if (isNaN(userBid) || userBid < minBid) {
    showToast(`Bid must be at least $${minBid.toFixed(2)}`, 'error');
    return;
  }

  // Check auction still active
  if (new Date(auction.endsAt) <= new Date()) {
    showToast('This auction ended while you were bidding!', 'warning');
    closeBidModal();
    return;
  }

  // Record the bid
  const bidEntry = {
    user: CURRENT_USER,
    amount: userBid,
    time: new Date().toISOString()
  };
  auctions[idx].bids.push(bidEntry);
  auctions[idx].currentBid = userBid;
  auctions[idx].bidsCount += 1;
  saveAuctions(auctions);

  // Update card UI without full re-render
  document.getElementById(`price-${activeAuctionId}`).textContent = `$${userBid.toFixed(2)}`;
  document.getElementById(`count-${activeAuctionId}`).textContent =
    `${auctions[idx].bidsCount} bid${auctions[idx].bidsCount !== 1 ? 's' : ''}`;
  document.getElementById(`history-${activeAuctionId}`).innerHTML =
    buildBidHistory(auctions[idx].bids);

  showToast(`✅ Your bid of $${userBid.toFixed(2)} was placed! You are the highest bidder.`, 'success');
  closeBidModal();
});

// ─── Close Modal Events ───────────────────────────────────────────────────────
document.getElementById('close-modal-btn').addEventListener('click', closeBidModal);
document.getElementById('bidModal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('bidModal')) closeBidModal();
});

// ─── Live Countdown Ticks ─────────────────────────────────────────────────────
function tickCountdowns() {
  const auctions = getAuctions();
  let needsReRender = false;

  auctions.forEach(auction => {
    if (auction.status === 'ended') return;

    const badge = document.getElementById(`timer-${auction.id}`);
    if (!badge) return;

    const { text, urgent, ended } = formatCountdown(auction.endsAt);

    if (ended) {
      // Mark as ended and declare winner
      const allAuctions = getAuctions();
      const idx = allAuctions.findIndex(a => a.id === auction.id);
      if (idx !== -1 && allAuctions[idx].status !== 'ended') {
        allAuctions[idx].status = 'ended';

        // Declare winner: highest bidder
        const bids = allAuctions[idx].bids;
        if (bids.length > 0) {
          const sorted = [...bids].sort((a, b) => b.amount - a.amount);
          allAuctions[idx].winner = sorted[0].user;

          // Save to user's won auctions history
          const userAuctions = JSON.parse(localStorage.getItem('user_auctions') || '[]');
          userAuctions.push({
            id: allAuctions[idx].id,
            name: allAuctions[idx].name,
            bid: sorted[0].amount,
            date: new Date().toLocaleDateString('en-GB')
          });
          localStorage.setItem('user_auctions', JSON.stringify(userAuctions));

          // If current user won, fire confetti
          if (sorted[0].user === CURRENT_USER) {
            fireConfetti();
            showToast(`🏆 Congratulations! You won the auction for "${allAuctions[idx].name}"!`, 'success');
          } else {
            showToast(`Auction for "${allAuctions[idx].name}" ended. Winner: ${sorted[0].user}`, 'info');
          }
        } else {
          allAuctions[idx].winner = null;
        }

        saveAuctions(allAuctions);
        needsReRender = true;
      }
    } else {
      // Update countdown text
      const span = badge.querySelector('.countdown');
      if (span) span.textContent = text;
      // Toggle urgent class
      badge.classList.toggle('urgent', urgent);
    }
  });

  if (needsReRender) renderAuctions();
}

// ─── Claim Win ────────────────────────────────────────────────────────────────
function claimWin(auctionId) {
  const auctions = getAuctions();
  const auction = auctions.find(a => a.id === auctionId);
  if (!auction) return;

  // Store claim details so payment.html can pre-fill
  localStorage.setItem('pending_claim', JSON.stringify({
    type: 'auction_win',
    auctionId: auctionId,
    itemName: auction.name,
    amount: auction.currentBid
  }));

  window.location.href = 'payment.html';
}

// ─── Confetti Animation ───────────────────────────────────────────────────────
function fireConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - canvas.height,
    w: Math.random() * 10 + 6,
    h: Math.random() * 6 + 4,
    color: ['#4f46e5','#10b981','#f59e0b','#ef4444','#ec4899','#06b6d4'][Math.floor(Math.random()*6)],
    speed: Math.random() * 4 + 2,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.2
  }));

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.y += p.speed;
      p.angle += p.spin;
      if (p.y > canvas.height) { p.y = -20; p.x = Math.random() * canvas.width; }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      ctx.restore();
    });
    frame++;
    if (frame < 200) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
}

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  seedDemoAuctions();
  renderAuctions();
  setInterval(tickCountdowns, 1000); // tick every second
});