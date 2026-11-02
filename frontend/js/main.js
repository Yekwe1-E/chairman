// Main Application Helper & Global UI Functions
document.addEventListener('DOMContentLoaded', () => {
  // Mobile sidebar toggle & backdrop overlay
  const toggleBtn = document.getElementById('sidebarToggle');
  const sidebar = document.querySelector('.sidebar');
  let backdrop = document.querySelector('.sidebar-backdrop');

  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'sidebar-backdrop';
    document.body.appendChild(backdrop);
  }

  function toggleSidebar() {
    if (sidebar) {
      sidebar.classList.toggle('show-sidebar');
      backdrop.classList.toggle('show');
    }
  }

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSidebar();
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', () => {
      if (sidebar && sidebar.classList.contains('show-sidebar')) {
        sidebar.classList.remove('show-sidebar');
        backdrop.classList.remove('show');
      }
    });
  }

  // Highlight active sidebar menu link automatically based on current page
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  sidebarLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Close modals on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModals = document.querySelectorAll('.modal.show');
      openModals.forEach(modal => modal.classList.remove('show'));
    }
  });

  // Populate active user info in sidebar & header
  if (typeof Auth !== 'undefined') {
    const currentUser = Auth.getUser();
    if (currentUser) {
      const userNames = document.querySelectorAll('.current-user-name');
      const userRoles = document.querySelectorAll('.current-user-role');
      const userAvatars = document.querySelectorAll('.user-avatar');

      userNames.forEach(el => el.textContent = currentUser.full_name || 'User');
      userRoles.forEach(el => el.textContent = currentUser.role || 'Member');
      userAvatars.forEach(el => {
        const initials = currentUser.full_name ? currentUser.full_name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
        el.textContent = initials;
      });

      // Hide admin-only elements for non-admins
      if (currentUser.role !== 'admin') {
        document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
      }
    }
  }

  // Inject Mobile Bottom Navigation Dock (Refined modern app pattern)
  const isAuthPage = currentPath !== 'login.html' && currentPath !== 'register.html' && currentPath !== 'index.html';
  if (isAuthPage && !document.querySelector('.mobile-bottom-nav')) {
    const bottomNav = document.createElement('nav');
    bottomNav.className = 'mobile-bottom-nav';
    
    const navItems = [
      { href: 'dashboard.html', icon: 'fa-house', label: 'Home' },
      { href: 'flocks.html', icon: 'fa-kiwi-bird', label: 'Flocks' },
      { href: 'activities.html', icon: 'fa-calendar-check', label: 'Activities' },
      { href: 'sales.html', icon: 'fa-cart-shopping', label: 'Sales' },
      { href: 'profile.html', icon: 'fa-user', label: 'Profile' }
    ];

    let navHtml = '';
    navItems.forEach(item => {
      const isActive = currentPath === item.href ? 'active' : '';
      navHtml += `
        <a href="${item.href}" class="mobile-nav-item ${isActive}">
          <i class="fa-solid ${item.icon}"></i>
          <span>${item.label}</span>
        </a>
      `;
    });

    // Add Menu toggle button
    navHtml += `
      <a href="javascript:void(0)" id="mobileMenuBtn" class="mobile-nav-item">
        <i class="fa-solid fa-grid-2"></i>
        <i class="fa-solid fa-bars-staggered"></i>
        <span>Menu</span>
      </a>
    `;

    bottomNav.innerHTML = navHtml;
    document.body.appendChild(bottomNav);

    // Wire up bottom Menu button to open sidebar drawer
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (sidebar && backdrop) {
          sidebar.classList.add('show-sidebar');
          backdrop.classList.add('show');
        }
      });
    }
  }
});

// Toast notification display with smooth animation
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icon = type === 'success' ? 'fa-circle-check' : (type === 'error' ? 'fa-circle-xmark' : 'fa-triangle-exclamation');
  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
  
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('toast-fadeout');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Format Currency to Nigerian Naira ₦
function formatNaira(amount) {
  const num = Number(amount) || 0;
  return '₦' + num.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Modal open & close handlers
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('show');
    // Focus first input field automatically
    const firstInput = modal.querySelector('input, select, textarea');
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('show');
}

// Table search filter
function filterTable(inputId, tableId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const filter = input.value.toLowerCase();
  const table = document.getElementById(tableId);
  if (!table) return;
  const trs = table.getElementsByTagName('tr');

  for (let i = 1; i < trs.length; i++) {
    const tdText = trs[i].textContent.toLowerCase();
    trs[i].style.display = tdText.includes(filter) ? '' : 'none';
  }
}

// Export Table Data to CSV
function exportTableToCSV(filename, tableId) {
  const table = document.getElementById(tableId);
  if (!table) return;
  const rows = table.querySelectorAll('tr');
  let csv = [];

  rows.forEach(row => {
    const cols = row.querySelectorAll('td, th');
    let rowData = [];
    cols.forEach(col => {
      // Exclude Action buttons column if present
      if (!col.classList.contains('no-export')) {
        rowData.push('"' + col.innerText.replace(/"/g, '""').trim() + '"');
      }
    });
    if (rowData.length > 0) csv.push(rowData.join(','));
  });

  const csvFile = new Blob([csv.join('\n')], { type: 'text/csv' });
  const downloadLink = document.createElement('a');
  downloadLink.download = filename;
  downloadLink.href = window.URL.createObjectURL(csvFile);
  downloadLink.style.display = 'none';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

