/* ==========================================================================
   NOURISH NEST - PARENT DASHBOARD APPLICATION JAVASCRIPT
   Handles: Portal Router, Sidebar State, Mobile Drawer, Theme & RTL,
   11 Dynamic Views, Modals, Local State Management, Toast Feedback
   ========================================================================== */

// Initial State Container
const dashState = {
  activeView: 'overview',
  selectedMealDay: 'All',
  activeWeek: 'Sep 21 – Sep 27',
  childName: 'Ava Morgan',
  childAge: '12–24 Months',
  subscriptionPlan: 'Growing Table',
  allergens: { milk: false, egg: false, wheat: false, soy: false, peanut: true, treeNuts: true, fish: false, sesame: false },
  dislikedIngredients: ['Mushroom', 'Bell Pepper'],
  notifications: [
    { id: 1, title: 'Delivery Update', body: 'Your Sep 24 meal box has been packed.', read: false, time: '2 hours ago' },
    { id: 2, title: 'Menu Reminder', body: 'Review next week\'s meals before Tuesday.', read: false, time: '1 day ago' },
    { id: 3, title: 'Preference Update', body: 'Your allergy preferences were saved.', read: true, time: '3 days ago' },
    { id: 4, title: 'Payment Processed', body: 'September subscription payment of $78 was processed.', read: true, time: 'Sep 17' }
  ],
  weeklyMeals: {
    Mon: { breakfast: 'Banana Oat Bowl', lunch: 'Soft Vegetable Rice', snack: 'Apple Puree', dinner: 'Sweet Potato Mash' },
    Tue: { breakfast: 'Apple Cinnamon Porridge', lunch: 'Chicken & Sweet Potato', snack: 'Pear Bites', dinner: 'Creamy Pea Rice' },
    Wed: { breakfast: 'Pear Millet Bowl', lunch: 'Pumpkin Lentil Mash', snack: 'Banana Smoothie', dinner: 'Vegetable Pasta' },
    Thu: { breakfast: 'Berry Oatmeal', lunch: 'Vegetable Pasta', snack: 'Carrot Puree', dinner: 'Mild Chicken Bowl' },
    Fri: { breakfast: 'Banana Chia Bowl', lunch: 'Creamy Pea Rice', snack: 'Avocado Mash', dinner: 'Mini Ravioli' },
    Sat: { breakfast: 'Mango Oat Porridge', lunch: 'Quinoa Veggie Risotto', snack: 'Blueberry Mash', dinner: 'Pumpkin Stew' },
    Sun: { breakfast: 'Peach Millet Bowl', lunch: 'Chicken Sweet Potato Mash', snack: 'Apple Rings', dinner: 'Veggie Couscous' }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initPortalTheme();
  initPortalRTL();
  initSidebar();
  initDashboardRouter();
  renderCurrentView();
});

/* --------------------------------------------------------------------------
   01. THEME & RTL SYNC
   -------------------------------------------------------------------------- */
function initPortalTheme() {
  const savedTheme = localStorage.getItem('nn_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updatePortalThemeButtons(savedTheme);

  document.querySelectorAll('.dash-theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('nn_theme', next);
      updatePortalThemeButtons(next);
      showDashToast(`Switched to ${next} theme`);
    });
  });
}

function updatePortalThemeButtons(theme) {
  document.querySelectorAll('.dash-theme-btn').forEach(btn => {
    btn.innerHTML = theme === 'dark' 
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  });
}

function initPortalRTL() {
  const savedRTL = localStorage.getItem('nn_rtl') === 'true';
  document.documentElement.setAttribute('dir', savedRTL ? 'rtl' : 'ltr');
  updatePortalRTLButtons(savedRTL);

  document.querySelectorAll('.dash-rtl-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('dir') === 'rtl';
      const next = !current;
      document.documentElement.setAttribute('dir', next ? 'rtl' : 'ltr');
      localStorage.setItem('nn_rtl', next);
      updatePortalRTLButtons(next);
      showDashToast(next ? 'RTL Mode Enabled' : 'LTR Mode Enabled');
    });
  });
}

function updatePortalRTLButtons(isRTL) {
  document.querySelectorAll('.dash-rtl-btn').forEach(btn => {
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><line x1="3" y1="5" x2="21" y2="5"/><polyline points="7 23 3 19 7 15"/><line x1="21" y1="19" x2="3" y2="19"/></svg>`;
  });
}

/* --------------------------------------------------------------------------
   02. SIDEBAR & MOBILE DRAWER
   -------------------------------------------------------------------------- */
function initSidebar() {
  const sidebar = document.querySelector('.dash-sidebar');
  const toggleBtn = document.querySelector('.dash-menu-toggle');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  // Close sidebar on item click (mobile)
  document.querySelectorAll('.sidebar-menu-item button').forEach(btn => {
    btn.addEventListener('click', () => {
      if (window.innerWidth <= 1024 && sidebar) {
        sidebar.classList.remove('open');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   03. DASHBOARD ROUTER & SECTION SWITCHING
   -------------------------------------------------------------------------- */
function initDashboardRouter() {
  const menuButtons = document.querySelectorAll('.sidebar-menu-item button');
  menuButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.getAttribute('data-view');
      if (view === 'signout') {
        handleSignOut();
        return;
      }
      menuButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      dashState.activeView = view;
      renderCurrentView();
    });
  });
}

function renderCurrentView() {
  const container = document.getElementById('dash-main-content');
  const titleEl = document.getElementById('dash-page-title');
  if (!container) return;

  const viewTitles = {
    overview: 'Parent Portal Overview',
    meals: 'Weekly Meal Management',
    schedule: 'Delivery Schedule',
    nutrition: 'Nutritional Breakdown',
    allergies: 'Allergies & Preferences',
    subscription: 'Subscription Details',
    payments: 'Payments & Billing',
    history: 'Order History',
    notifications: 'Notifications',
    profile: 'Family Profile Settings',
    help: 'Help & Support'
  };

  if (titleEl) titleEl.textContent = viewTitles[dashState.activeView] || 'Parent Portal';

  switch (dashState.activeView) {
    case 'overview': renderOverview(container); break;
    case 'meals': renderWeeklyMeals(container); break;
    case 'schedule': renderDeliverySchedule(container); break;
    case 'nutrition': renderNutrition(container); break;
    case 'allergies': renderAllergies(container); break;
    case 'subscription': renderSubscription(container); break;
    case 'payments': renderPayments(container); break;
    case 'history': renderOrderHistory(container); break;
    case 'notifications': renderNotifications(container); break;
    case 'profile': renderProfile(container); break;
    case 'help': renderHelp(container); break;
    default: renderOverview(container); break;
  }
}

/* --------------------------------------------------------------------------
   VIEW 01 — OVERVIEW
   -------------------------------------------------------------------------- */
function renderOverview(c) {
  c.innerHTML = `
    <!-- KPI Cards -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <span class="kpi-label">NEXT DELIVERY</span>
        <span class="kpi-val">Thu, Sep 24</span>
        <span class="kpi-sub">6 meals scheduled</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">MEALS THIS WEEK</span>
        <span class="kpi-val">12 Meals</span>
        <span class="kpi-sub">2 customized</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">ACTIVE SUBSCRIPTION</span>
        <span class="kpi-val">${dashState.subscriptionPlan}</span>
        <span class="kpi-sub">Active • Renews Oct 01</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">ALLERGY FILTERS</span>
        <span class="kpi-val">2 Active</span>
        <span class="kpi-sub">Peanut, Tree Nuts</span>
      </div>
    </div>

    <!-- Alert Banner -->
    <div class="dash-card" style="background: var(--dash-secondary); border-color: var(--dash-border); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
      <div style="display: flex; align-items: center; gap: 16px;">
        <span style="font-size: 1.5rem;">🔔</span>
        <div>
          <strong style="color: var(--dash-text);">Preference Review Notice</strong>
          <div style="font-size: 0.9rem; color: var(--dash-muted);">Ava's meal preferences were last reviewed 18 days ago. Ensure textures align with her growth!</div>
        </div>
      </div>
      <button class="btn btn-primary" onclick="switchView('allergies')">Review Preferences →</button>
    </div>

    <!-- Delivery Progress Card -->
    <div class="dash-card">
      <div class="card-title">
        <span>Next Delivery Status — Thursday, September 24</span>
        <span class="status-badge packed">Packed</span>
      </div>
      <div class="delivery-timeline">
        <div class="timeline-step completed">
          <div class="timeline-dot">✓</div>
          <span style="font-size: 0.85rem; font-weight: 600;">Prepared</span>
        </div>
        <div class="timeline-step completed">
          <div class="timeline-dot">✓</div>
          <span style="font-size: 0.85rem; font-weight: 600;">Packed</span>
        </div>
        <div class="timeline-step current">
          <div class="timeline-dot">🚚</div>
          <span style="font-size: 0.85rem; font-weight: 600;">Out for Delivery</span>
        </div>
        <div class="timeline-step">
          <div class="timeline-dot">🏡</div>
          <span style="font-size: 0.85rem; font-weight: 600;">Delivered</span>
        </div>
      </div>
    </div>

    <!-- Quick Actions & Weekly Preview -->
    <div class="overview-bottom-grid">
      <div class="dash-card">
        <div class="card-title">
          <span>This Week's Meal Plan Preview</span>
          <button class="btn btn-outline" style="padding: 6px 16px; font-size: 0.85rem;" onclick="switchView('meals')">View Full Week →</button>
        </div>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div style="display: flex; justify-content: space-between; padding: 12px; background: var(--dash-bg); border-radius: 8px;">
            <strong>Monday</strong>
            <span>Breakfast: ${dashState.weeklyMeals.Mon.breakfast} | Lunch: ${dashState.weeklyMeals.Mon.lunch}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 12px; background: var(--dash-bg); border-radius: 8px;">
            <strong>Tuesday</strong>
            <span>Breakfast: ${dashState.weeklyMeals.Tue.breakfast} | Lunch: ${dashState.weeklyMeals.Tue.lunch}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 12px; background: var(--dash-bg); border-radius: 8px;">
            <strong>Wednesday</strong>
            <span>Breakfast: ${dashState.weeklyMeals.Wed.breakfast} | Lunch: ${dashState.weeklyMeals.Wed.lunch}</span>
          </div>
        </div>
      </div>

      <div class="dash-card">
        <div class="card-title">Quick Actions</div>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <button class="btn btn-outline" style="width: 100%; justify-content: flex-start;" onclick="switchView('meals')">✏️ Edit Upcoming Meals</button>
          <button class="btn btn-outline" style="width: 100%; justify-content: flex-start;" onclick="openSkipModal()">⏭️ Skip Next Delivery</button>
          <button class="btn btn-outline" style="width: 100%; justify-content: flex-start;" onclick="switchView('allergies')">🛡️ Allergy Settings</button>
          <button class="btn btn-outline" style="width: 100%; justify-content: flex-start;" onclick="switchView('nutrition')">📊 Nutrition Summary</button>
          <button class="btn btn-outline" style="width: 100%; justify-content: flex-start;" onclick="switchView('subscription')">💳 Subscription Plan</button>
        </div>
      </div>
    </div>
  `;
}

/* --------------------------------------------------------------------------
   VIEW 02 — WEEKLY MEALS
   -------------------------------------------------------------------------- */
function renderWeeklyMeals(c) {
  const daysList = ['All', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const activeDay = dashState.selectedMealDay || 'All';
  
  const displayDays = activeDay === 'All' 
    ? Object.keys(dashState.weeklyMeals) 
    : (dashState.weeklyMeals[activeDay] ? [activeDay] : Object.keys(dashState.weeklyMeals));

  c.innerHTML = `
    <div class="dash-card">
      <div class="card-title" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
        <div>
          <h3 style="font-size: 1.25rem; margin-bottom: 4px;">Upcoming Meal Schedule</h3>
          <p class="text-muted" style="font-size: 0.88rem;">
            Week: ${dashState.activeWeek} ${activeDay !== 'All' ? `• Filtered by <strong>${activeDay}</strong>` : ''}
          </p>
        </div>
        <button class="btn btn-primary" onclick="showDashToast('Meal schedule selections saved!')">Save Meal Schedule</button>
      </div>

      <!-- Filter Pills Bar -->
      <div style="display: flex; gap: 8px; margin: 20px 0; overflow-x: auto; padding-bottom: 4px; flex-wrap: wrap;">
        ${daysList.map(d => `
          <button class="btn ${activeDay === d ? 'btn-primary' : 'btn-outline'}" 
                  style="padding: 7px 18px; font-weight: 600; border-radius: 20px; font-size: 0.85rem;" 
                  onclick="filterMealDay('${d}')">
            ${d === 'All' ? 'All Days' : d}
          </button>
        `).join('')}
      </div>

      <div class="dash-table-wrapper">
        <table class="dash-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Meal Type</th>
              <th>Selected Meal</th>
              <th>Age Stage</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${displayDays.map(day => `
              <tr>
                <td><strong>${day}</strong></td>
                <td>Breakfast</td>
                <td>${dashState.weeklyMeals[day].breakfast}</td>
                <td><span class="status-badge scheduled">12–24M</span></td>
                <td><button class="btn btn-outline btn-sm" onclick="openChangeMealModal('${day}', 'Breakfast')">Change</button></td>
              </tr>
              <tr>
                <td><strong>${day}</strong></td>
                <td>Lunch</td>
                <td>${dashState.weeklyMeals[day].lunch}</td>
                <td><span class="status-badge scheduled">12–24M</span></td>
                <td><button class="btn btn-outline btn-sm" onclick="openChangeMealModal('${day}', 'Lunch')">Change</button></td>
              </tr>
              <tr>
                <td><strong>${day}</strong></td>
                <td>Snack</td>
                <td>${dashState.weeklyMeals[day].snack || 'Fruit Mash'}</td>
                <td><span class="status-badge scheduled">12–24M</span></td>
                <td><button class="btn btn-outline btn-sm" onclick="openChangeMealModal('${day}', 'Snack')">Change</button></td>
              </tr>
              <tr>
                <td><strong>${day}</strong></td>
                <td>Dinner</td>
                <td>${dashState.weeklyMeals[day].dinner || 'Veggie Mash'}</td>
                <td><span class="status-badge scheduled">12–24M</span></td>
                <td><button class="btn btn-outline btn-sm" onclick="openChangeMealModal('${day}', 'Dinner')">Change</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/* --------------------------------------------------------------------------
   VIEW 03 — DELIVERY SCHEDULE
   -------------------------------------------------------------------------- */
function renderDeliverySchedule(c) {
  c.innerHTML = `
    <div class="dash-card">
      <div class="card-title">Upcoming Delivery Timeline</div>
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div class="delivery-row" style="border-left: 4px solid var(--dash-primary);">
          <div>
            <strong>THU — SEP 24, 2026</strong>
            <div style="font-size: 0.9rem; color: var(--dash-muted);">6 meals included • 123 Garden Lane</div>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <span class="status-badge packed">Packed</span>
            <button class="btn btn-outline" style="padding: 6px 14px; font-size: 0.85rem;" onclick="openSkipModal()">Skip Delivery</button>
          </div>
        </div>

        <div class="delivery-row" style="border-left: 4px solid var(--dash-muted);">
          <div>
            <strong>THU — OCT 01, 2026</strong>
            <div style="font-size: 0.9rem; color: var(--dash-muted);">6 meals scheduled</div>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <span class="status-badge scheduled">Scheduled</span>
            <button class="btn btn-outline" style="padding: 6px 14px; font-size: 0.85rem;" onclick="openSkipModal()">Skip Delivery</button>
          </div>
        </div>

        <div class="delivery-row" style="border-left: 4px solid var(--dash-muted);">
          <div>
            <strong>THU — OCT 08, 2026</strong>
            <div style="font-size: 0.9rem; color: var(--dash-muted);">6 meals scheduled</div>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <span class="status-badge scheduled">Scheduled</span>
            <button class="btn btn-outline" style="padding: 6px 14px; font-size: 0.85rem;" onclick="openSkipModal()">Skip Delivery</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* --------------------------------------------------------------------------
   VIEW 04 — NUTRITION
   -------------------------------------------------------------------------- */
function renderNutrition(c) {
  c.innerHTML = `
    <div class="dash-card">
      <div class="card-title">
        <span>Weekly Nutritional Overview</span>
        <span style="font-size: 0.8rem; font-weight: normal; color: var(--dash-muted);">Illustrative Sample Data</span>
      </div>
      <p class="text-muted" style="margin-bottom: 24px; font-size: 0.95rem;">
        Estimated weekly nutrient distribution for Ava based on selected meal portion targets.
      </p>

      <div class="nutrient-bar-group">
        <div class="nutrient-row">
          <div class="nutrient-header"><span>Protein</span><span>18g / 14g target (128%)</span></div>
          <div class="progress-track"><div class="progress-fill" style="width: 85%;"></div></div>
        </div>

        <div class="nutrient-row">
          <div class="nutrient-header"><span>Carbohydrates</span><span>85g / 90g target (94%)</span></div>
          <div class="progress-track"><div class="progress-fill" style="width: 75%; background: var(--dash-accent-blue);"></div></div>
        </div>

        <div class="nutrient-row">
          <div class="nutrient-header"><span>Dietary Fiber</span><span>14g / 12g target (116%)</span></div>
          <div class="progress-track"><div class="progress-fill" style="width: 90%; background: var(--dash-accent-green);"></div></div>
        </div>

        <div class="nutrient-row">
          <div class="nutrient-header"><span>Iron & Calcium</span><span>Essential Minerals Met</span></div>
          <div class="progress-track"><div class="progress-fill" style="width: 95%; background: var(--dash-accent-orange);"></div></div>
        </div>
      </div>

      <div style="margin-top: 32px; padding: 16px; background: var(--dash-bg); border-radius: 8px; font-size: 0.85rem; color: var(--dash-muted);">
        <strong>Medical Disclaimer:</strong> Nutritional values shown are demonstration estimates and should not replace advice from a qualified pediatrician or medical professional.
      </div>
    </div>
  `;
}

/* --------------------------------------------------------------------------
   VIEW 05 — ALLERGIES & PREFERENCES
   -------------------------------------------------------------------------- */
function renderAllergies(c) {
  c.innerHTML = `
    <div class="dash-card">
      <div class="card-title">
        <span>Child Profile: ${dashState.childName} (${dashState.childAge})</span>
        <button class="btn btn-primary" onclick="saveAllergiesState()">Save Preferences</button>
      </div>

      <h4 style="margin-top: 20px;">Allergen Exclusions</h4>
      <p class="text-muted" style="font-size: 0.9rem; margin-bottom: 16px;">Toggle allergens to automatically filter meals containing these ingredients.</p>

      <div class="preference-grid">
        ${Object.keys(dashState.allergens).map(allergen => `
          <div class="toggle-card">
            <span style="text-transform: capitalize; font-weight: 600;">${allergen}</span>
            <label class="switch">
              <input type="checkbox" ${dashState.allergens[allergen] ? 'checked' : ''} onchange="dashState.allergens['${allergen}'] = this.checked">
              <span class="slider"></span>
            </label>
          </div>
        `).join('')}
      </div>

      <h4 style="margin-top: 32px;">Disliked Ingredients</h4>
      <div class="chip-container" id="disliked-chips">
        ${dashState.dislikedIngredients.map(item => `
          <span class="chip">
            ${item}
            <span class="chip-remove" onclick="removeDislikedIngredient('${item}')">×</span>
          </span>
        `).join('')}
      </div>
      <div style="margin-top: 16px; display: flex; gap: 12px; max-width: 400px;">
        <input type="text" id="add-dislike-input" placeholder="e.g. Mushroom" style="flex: 1; padding: 10px; border-radius: 8px; border: 1px solid var(--dash-border);">
        <button class="btn btn-secondary" onclick="addDislikedIngredient()">+ Add</button>
      </div>
    </div>
  `;
}

window.saveAllergiesState = function() {
  showDashToast('Allergy and preference settings updated successfully!');
};

window.addDislikedIngredient = function() {
  const input = document.getElementById('add-dislike-input');
  if (input && input.value.trim()) {
    dashState.dislikedIngredients.push(input.value.trim());
    input.value = '';
    renderCurrentView();
  }
};

window.removeDislikedIngredient = function(item) {
  dashState.dislikedIngredients = dashState.dislikedIngredients.filter(i => i !== item);
  renderCurrentView();
};

/* --------------------------------------------------------------------------
   VIEW 06 — SUBSCRIPTION
   -------------------------------------------------------------------------- */
function renderSubscription(c) {
  c.innerHTML = `
    <div class="dash-card">
      <div class="card-title">
        <span>Current Subscription Plan</span>
        <span class="status-badge active">Active</span>
      </div>

      <div class="sub-plan-grid">
        <div>
          <h2>${dashState.subscriptionPlan}</h2>
          <p class="text-muted" style="margin-top: 8px;">12 meals per week • Flexible delivery schedule</p>
          <ul style="margin-top: 16px; padding-left: 20px; line-height: 1.8;">
            <li>12 organic baby/toddler meals weekly</li>
            <li>Custom allergen filtering included</li>
            <li>Pause, skip, or modify anytime</li>
          </ul>
        </div>
        <div style="background: var(--dash-bg); padding: 24px; border-radius: 12px; display: flex; flex-direction: column; gap: 12px;">
          <div><strong>Billing Rate:</strong> $78.00 / week</div>
          <div><strong>Next Billing Date:</strong> October 01, 2026</div>
          <div><strong>Delivery Day:</strong> Every Thursday</div>
        </div>
      </div>

      <div style="display: flex; gap: 16px; flex-wrap: wrap;">
        <button class="btn btn-primary" onclick="openChangePlanModal()">Change Plan</button>
        <button class="btn btn-outline" onclick="showDashToast('Subscription paused for next week.')">Pause Subscription</button>
        <button class="btn btn-outline" style="border-color: #E07A5F; color: #E07A5F;" onclick="openCancelModal()">Cancel Subscription</button>
      </div>
    </div>
  `;
}

/* --------------------------------------------------------------------------
   VIEW 07 — PAYMENTS
   -------------------------------------------------------------------------- */
function renderPayments(c) {
  c.innerHTML = `
    <div class="dash-card">
      <div class="card-title">
        <span>Payment Method</span>
        <button class="btn btn-outline" onclick="showDashToast('Payment method update drawer opened.')">Update Payment</button>
      </div>

      <div class="payment-method-card">
        <span style="font-size: 2rem; flex-shrink: 0;">💳</span>
        <div style="min-width: 0;">
          <strong>Visa ending in 4821</strong>
          <div style="font-size: 0.85rem; color: var(--dash-muted); white-space: normal;">Expires 09/28 • Default Payment Method</div>
        </div>
      </div>

      <div class="card-title" style="margin-top: 24px;">Billing History</div>
      <div class="dash-table-wrapper">
        <table class="dash-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Sep 17, 2026</td>
              <td>Growing Table Weekly Subscription</td>
              <td>$78.00</td>
              <td><span class="status-badge delivered">Paid</span></td>
            </tr>
            <tr>
              <td>Sep 10, 2026</td>
              <td>Growing Table Weekly Subscription</td>
              <td>$78.00</td>
              <td><span class="status-badge delivered">Paid</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/* --------------------------------------------------------------------------
   VIEW 08 — ORDER HISTORY
   -------------------------------------------------------------------------- */
function renderOrderHistory(c) {
  c.innerHTML = `
    <div class="dash-card">
      <div class="card-title">Past Deliveries</div>
      <div class="dash-table-wrapper">
        <table class="dash-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Meals</th>
              <th>Plan</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#NN-1024</td>
              <td>Sep 17, 2026</td>
              <td>12 Meals</td>
              <td>Growing Table</td>
              <td><span class="status-badge delivered">Delivered</span></td>
            </tr>
            <tr>
              <td>#NN-1018</td>
              <td>Sep 10, 2026</td>
              <td>12 Meals</td>
              <td>Growing Table</td>
              <td><span class="status-badge delivered">Delivered</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/* --------------------------------------------------------------------------
   VIEW 09 — NOTIFICATIONS
   -------------------------------------------------------------------------- */
function renderNotifications(c) {
  c.innerHTML = `
    <div class="dash-card">
      <div class="card-title">
        <span>Account Notifications</span>
        <button class="btn btn-outline" style="padding: 6px 14px; font-size: 0.85rem;" onclick="markAllNotificationsRead()">Mark All as Read</button>
      </div>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${dashState.notifications.map(n => `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; background: ${n.read ? 'var(--dash-bg)' : 'var(--dash-secondary)'}; border-radius: 10px;">
            <div>
              <strong>${n.title}</strong>
              <div style="font-size: 0.9rem; color: var(--dash-muted); margin-top: 2px;">${n.body}</div>
              <div style="font-size: 0.75rem; color: var(--dash-muted); margin-top: 4px;">${n.time}</div>
            </div>
            <button class="btn btn-outline" style="padding: 4px 10px; font-size: 0.75rem;" onclick="deleteNotification(${n.id})">Delete</button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

window.markAllNotificationsRead = function() {
  dashState.notifications.forEach(n => n.read = true);
  renderCurrentView();
  showDashToast('All notifications marked as read.');
};

window.deleteNotification = function(id) {
  dashState.notifications = dashState.notifications.filter(n => n.id !== id);
  renderCurrentView();
};

/* --------------------------------------------------------------------------
   VIEW 10 — PROFILE
   -------------------------------------------------------------------------- */
function renderProfile(c) {
  c.innerHTML = `
    <div class="dash-card">
      <div class="card-title">
        <span>Parent & Family Profile</span>
        <button class="btn btn-primary" onclick="showDashToast('Profile changes saved!')">Save Profile</button>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px;">
        <div>
          <h4>Parent Information</h4>
          <div style="margin-top: 16px; display: flex; flex-direction: column; gap: 12px;">
            <div><label style="font-size: 0.85rem; font-weight: 600;">Full Name</label><input type="text" value="Sarah Morgan" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--dash-border);"></div>
            <div><label style="font-size: 0.85rem; font-weight: 600;">Email Address</label><input type="email" value="parent@example.com" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--dash-border);"></div>
          </div>
        </div>

        <div>
          <h4>Child Information</h4>
          <div style="margin-top: 16px; display: flex; flex-direction: column; gap: 12px;">
            <div><label style="font-size: 0.85rem; font-weight: 600;">Child Name</label><input type="text" value="${dashState.childName}" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--dash-border);"></div>
            <div><label style="font-size: 0.85rem; font-weight: 600;">Age Stage</label><input type="text" value="${dashState.childAge}" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--dash-border);"></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* --------------------------------------------------------------------------
   VIEW 11 — HELP & SUPPORT
   -------------------------------------------------------------------------- */
function renderHelp(c) {
  c.innerHTML = `
    <div class="dash-card">
      <div class="card-title">Frequently Asked Questions</div>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div class="faq-item active">
          <button class="faq-question" onclick="this.parentElement.classList.toggle('active')">
            <span>How do I change a scheduled meal?</span>
            <span>▼</span>
          </button>
          <div class="faq-answer">Navigate to "Weekly Meals", find the day you want to adjust, click "Change", and select from the available alternative recipes.</div>
        </div>

        <div class="faq-item">
          <button class="faq-question" onclick="this.parentElement.classList.toggle('active')">
            <span>How do I skip an upcoming delivery?</span>
            <span>▼</span>
          </button>
          <div class="faq-answer">Go to "Delivery Schedule" or "Overview" and click "Skip Delivery" before Tuesday midnight.</div>
        </div>
      </div>
    </div>
  `;
}

/* Helper Functions */
window.filterMealDay = function(day) {
  if (dashState.selectedMealDay === day && day !== 'All') {
    dashState.selectedMealDay = 'All';
  } else {
    dashState.selectedMealDay = day;
  }
  const container = document.getElementById('dash-main-content');
  if (container) {
    renderWeeklyMeals(container);
  }
  if (dashState.selectedMealDay === 'All') {
    showDashToast('Showing full week schedule');
  } else {
    showDashToast(`Filtered schedule for ${dashState.selectedMealDay}`);
  }
};

window.switchView = function(viewName) {
  const btn = document.querySelector(`.sidebar-menu-item button[data-view="${viewName}"]`);
  if (btn) btn.click();
};

window.handleSignOut = function() {
  showDashToast('Signing out...');
  setTimeout(() => window.location.href = 'index.html', 1000);
};

window.openSkipModal = function() {
  showDashToast('Delivery skipped for next Thursday!');
};

window.openChangeMealModal = function(day, type) {
  showDashToast(`Select an alternative meal for ${day} ${type}`);
};

window.openChangePlanModal = function() {
  showDashToast('Select a plan upgrade or tier.');
};

window.openCancelModal = function() {
  showDashToast('Subscription cancellation review modal opened.');
};

function showDashToast(msg) {
  let c = document.querySelector('.toast-container');
  if (!c) {
    c = document.createElement('div');
    c.className = 'toast-container';
    document.body.appendChild(c);
  }
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<span>👶</span> ${msg}`;
  c.appendChild(t);
  setTimeout(() => {
    t.style.opacity = '0';
    setTimeout(() => t.remove(), 300);
  }, 3000);
}
