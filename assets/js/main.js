/* ==========================================================================
   NOURISH NEST - PUBLIC WEBSITE MAIN JAVASCRIPT
   Handles: Navigation, Mobile Drawer, Theme Toggle, RTL Toggle,
   Age-Stage Filter, Meal Modals, Login Demo Redirect, Toast Notifications
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initRTL();
  initNavigation();
  initBackToTop();
  initAgeStageSwitcher();
  initMealCatalog();
  initModalSystem();
  initLoginDemo();
  initRegisterDemo();
  initSensoryGrowthMatrix();
  initOurKitchenQualityMatrix();
  initMenuNutrientProfiler();
  initFaqAccordion();
  initAllergenProtocolMatrix();
});

/* --------------------------------------------------------------------------
   01. THEME MANAGEMENT (PERSISTED IN LOCALSTORAGE)
   -------------------------------------------------------------------------- */
function initTheme() {
  const savedTheme = localStorage.getItem('nn_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeButtons(savedTheme);

  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('nn_theme', newTheme);
      updateThemeButtons(newTheme);
      showToast(`Switched to ${newTheme} mode`);
    });
  });
}

function updateThemeButtons(theme) {
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.setAttribute('title', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    btn.innerHTML = theme === 'dark' 
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  });
}

/* --------------------------------------------------------------------------
   02. RTL MANAGEMENT (PERSISTED IN LOCALSTORAGE)
   -------------------------------------------------------------------------- */
function initRTL() {
  const savedRTL = localStorage.getItem('nn_rtl') === 'true';
  if (savedRTL) {
    document.documentElement.setAttribute('dir', 'rtl');
  } else {
    document.documentElement.setAttribute('dir', 'ltr');
  }
  updateRTLButtons(savedRTL);

  document.querySelectorAll('.rtl-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
      const newRTL = !isRTL;
      document.documentElement.setAttribute('dir', newRTL ? 'rtl' : 'ltr');
      localStorage.setItem('nn_rtl', newRTL);
      updateRTLButtons(newRTL);
      showToast(newRTL ? 'RTL Mode Enabled' : 'LTR Mode Enabled');
    });
  });
}

function updateRTLButtons(isRTL) {
  document.querySelectorAll('.rtl-toggle-btn').forEach(btn => {
    btn.setAttribute('title', isRTL ? 'Switch to LTR' : 'Switch to RTL');
    btn.setAttribute('aria-label', isRTL ? 'Switch to LTR' : 'Switch to RTL');
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><line x1="3" y1="5" x2="21" y2="5"/><polyline points="7 23 3 19 7 15"/><line x1="21" y1="19" x2="3" y2="19"/></svg>`;
  });
}

/* --------------------------------------------------------------------------
   03. NAVIGATION & MOBILE DRAWER
   -------------------------------------------------------------------------- */
function initNavigation() {
  const hamburger = document.querySelector('.hamburger');
  const drawer = document.querySelector('.mobile-drawer');

  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      drawer.classList.toggle('active');
      hamburger.classList.toggle('active');
    });

    // Close drawer when clicking a link
    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('active');
        hamburger.classList.remove('active');
      });
    });
  }
}

/* --------------------------------------------------------------------------
   04. HOME AGE STAGE SWITCHER
   -------------------------------------------------------------------------- */
const ageStageData = {
  '6-8': {
    title: '6–8 Months: Smooth Purees',
    desc: 'Gentle, single-ingredient and simple smooth combinations designed for baby’s very first solid tastes.',
    meals: [
      { name: 'Organic Sweet Potato Puree', ingredients: 'Sweet Potato, Water', texture: 'Smooth Puree' },
      { name: 'Pumpkin & Lentil Mash', ingredients: 'Pumpkin, Red Lentil, Olive Oil', texture: 'Soft Puree' }
    ]
  },
  '9-12': {
    title: '9–12 Months: Textured Mashes',
    desc: 'Soft lumps and varied ingredients to help develop chewing skills and explore rich wholesome flavors.',
    meals: [
      { name: 'Soft Vegetable Rice', ingredients: 'Brown Rice, Peas, Carrots, Zucchini', texture: 'Mashed & Soft' },
      { name: 'Banana Oat Porridge', ingredients: 'Rolled Oats, Banana, Cinnamon', texture: 'Textured Mash' }
    ]
  },
  '12-24': {
    title: '12–24 Months: Toddler Bites',
    desc: 'Nutritious soft finger foods and balanced meals tailored for busy little toddlers.',
    meals: [
      { name: 'Chicken & Sweet Potato Bites', ingredients: 'Free-range Chicken, Sweet Potato', texture: 'Soft Finger Bites' },
      { name: 'Creamy Pea & Quinoa Risotto', ingredients: 'Quinoa, Peas, Creamy Coconut', texture: 'Chunky Soft' }
    ]
  },
  '2-4': {
    title: '2–4 Years: Family Toddler Meals',
    desc: 'Flavorful, fun toddler meals designed to mirror family recipes with mild organic ingredients.',
    meals: [
      { name: 'Mini Vegetable Ravioli', ingredients: 'Whole Wheat Pasta, Spinach, Ricotta', texture: 'Bite-sized Soft' },
      { name: 'Mild Chicken Curry Bowl', ingredients: 'Chicken, Rice, Carrot, Soft Squash', texture: 'Toddler Portion' }
    ]
  }
};

function initAgeStageSwitcher() {
  const tabBtns = document.querySelectorAll('.age-tabs .tab-btn');
  const displayTitle = document.getElementById('stage-title');
  const displayDesc = document.getElementById('stage-desc');
  const displayList = document.getElementById('stage-meals-list');

  if (!tabBtns.length || !displayTitle) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const stageKey = btn.getAttribute('data-stage');
      const data = ageStageData[stageKey];

      if (data) {
        displayTitle.textContent = data.title;
        displayDesc.textContent = data.desc;
        
        if (displayList) {
          displayList.innerHTML = data.meals.map(m => `
            <div class="journey-step" style="text-align: left; padding: 16px;">
              <strong>${m.name}</strong>
              <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">${m.ingredients}</div>
              <span class="meal-badge" style="margin-top: 8px;">${m.texture}</span>
            </div>
          `).join('');
        }
      }
    });
  });
}

/* --------------------------------------------------------------------------
   05. MEAL CATALOG FILTERING & MODAL PREVIEW
   -------------------------------------------------------------------------- */
function initMealCatalog() {
  const filterBtns = document.querySelectorAll('.meal-cat-filter .tab-btn');
  const mealCards = document.querySelectorAll('.meal-grid .meal-card');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.getAttribute('data-cat');
      const mealGrid = document.querySelector('.meal-grid');
      if (mealGrid) {
        if (cat === 'all') {
          mealGrid.classList.remove('is-filtered');
        } else {
          mealGrid.classList.add('is-filtered');
        }
      }
      mealCards.forEach(card => {
        if (cat === 'all' || card.getAttribute('data-category') === cat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   06. MODAL SYSTEM (REUSABLE)
   -------------------------------------------------------------------------- */
function initModalSystem() {
  const modalOverlay = document.getElementById('public-modal');
  if (!modalOverlay) return;

  const closeBtn = modalOverlay.querySelector('.modal-close');
  
  const closeModal = () => {
    modalOverlay.classList.remove('active');
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // Attach click listener to meal cards for detail view
  document.querySelectorAll('.meal-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.meal-card-order-btn')) return;
      const name = card.getAttribute('data-name') || 'Wholesome Meal';
      const stage = card.getAttribute('data-stage') || 'All Stages';
      const ingredients = card.getAttribute('data-ingredients') || 'Organic produce';
      const texture = card.getAttribute('data-texture') || 'Soft Puree';
      const imgSrc = card.querySelector('img')?.src || 'assets/images/hero-baby-meal.jpg';

      const modalBody = modalOverlay.querySelector('.modal-body');
      if (modalBody) {
        modalBody.innerHTML = `
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${imgSrc}" alt="${name}" style="width: 100%; max-height: 240px; object-fit: cover; border-radius: 12px; margin-bottom: 16px;">
            <span class="meal-badge" style="margin-bottom: 8px; display: inline-block;">${stage}</span>
            <h3 style="margin-bottom: 8px;">${name}</h3>
            <p class="text-muted" style="font-size: 0.95rem;">${ingredients}</p>
          </div>
          <div style="background: var(--bg-alt); padding: 16px; border-radius: 12px; margin-bottom: 20px; font-size: 0.9rem;">
            <div><strong>Texture:</strong> ${texture}</div>
            <div style="margin-top: 6px;"><strong>Allergen Safety:</strong> No major allergens present.</div>
            <div style="margin-top: 6px; font-size: 0.8rem; color: var(--text-muted);">Note: Parents should review ingredient lists prior to serving.</div>
          </div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button class="btn btn-primary" style="flex: 1; padding: 12px;" onclick="openOrderModal(event, '${name}', '${stage}')">Order Now →</button>
            <button class="btn btn-outline" style="flex: 1; padding: 12px;" onclick="addPreferenceDemo('${name}')">Add to Preferences</button>
          </div>
        `;
      }

      modalOverlay.classList.add('active');
    });
  });
}

window.openOrderModal = function(event, mealName, stage) {
  if (event) {
    event.stopPropagation();
  }
  const modalOverlay = document.getElementById('public-modal');
  if (!modalOverlay) return;

  const modalBody = modalOverlay.querySelector('.modal-body');
  if (modalBody) {
    modalBody.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <span class="meal-badge" style="margin-bottom: 8px; display: inline-block;">Fresh Kitchen Order</span>
        <h3 style="font-size: 1.4rem; margin-bottom: 6px;">Order ${mealName}</h3>
        <p class="text-muted" style="font-size: 0.9rem;">Freshly prepared organic batch · ${stage || 'Milestone Stage'}</p>
      </div>

      <form onsubmit="handleMealOrderSubmit(event, '${mealName}')" style="display: flex; flex-direction: column; gap: 14px;">
        <div>
          <label style="display: block; font-size: 0.82rem; font-weight: 600; margin-bottom: 6px;">Portion & Quantity</label>
          <select style="width: 100%; padding: 10px 14px; border: 1px solid var(--border-color); border-radius: 8px; font-size: 0.9rem; background: var(--bg-surface); color: var(--text-main);">
            <option value="4pack">4 × 4oz Glass Jars ($23.80)</option>
            <option value="8pack" selected>8 × 4oz Glass Jars ($44.50 — Most Popular)</option>
            <option value="12pack">12 × 4oz Weekly Batch Pack ($62.90)</option>
            <option value="sampler">Sampler Variety Add-On ($15.00)</option>
          </select>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div>
            <label style="display: block; font-size: 0.82rem; font-weight: 600; margin-bottom: 6px;">Texture Customization</label>
            <select style="width: 100%; padding: 10px 14px; border: 1px solid var(--border-color); border-radius: 8px; font-size: 0.9rem; background: var(--bg-surface); color: var(--text-main);">
              <option value="standard">Standard Milestone Recipe</option>
              <option value="extra-smooth">Extra Smooth Puree</option>
              <option value="chunky">Soft Textured Mash</option>
            </select>
          </div>
          <div>
            <label style="display: block; font-size: 0.82rem; font-weight: 600; margin-bottom: 6px;">Delivery Day</label>
            <select style="width: 100%; padding: 10px 14px; border: 1px solid var(--border-color); border-radius: 8px; font-size: 0.9rem; background: var(--bg-surface); color: var(--text-main);">
              <option value="tuesday">Tuesday Morning Delivery</option>
              <option value="friday">Friday Morning Delivery</option>
            </select>
          </div>
        </div>

        <div style="background: var(--bg-alt); padding: 12px 14px; border-radius: 8px; font-size: 0.82rem; color: var(--text-muted); display: flex; align-items: center; gap: 8px;">
          <span>❄️</span>
          <span>Delivered fresh in compostable insulated cold-box with eco ice packs.</span>
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%; padding: 13px; margin-top: 4px; font-size: 0.95rem;">
          Confirm &amp; Place Order →
        </button>
      </form>
    `;
  }

  modalOverlay.classList.add('active');
};

window.handleMealOrderSubmit = function(event, mealName) {
  event.preventDefault();
  showToast(`"${mealName}" order confirmed! Prepared fresh for your delivery.`);
  const modalOverlay = document.getElementById('public-modal');
  if (modalOverlay) modalOverlay.classList.remove('active');
};

window.addPreferenceDemo = function(mealName) {
  showToast(`Added "${mealName}" to your preferences!`);
  const modalOverlay = document.getElementById('public-modal');
  if (modalOverlay) modalOverlay.classList.remove('active');
};

/* --------------------------------------------------------------------------
   06B. CHOOSE PLAN INTERACTIVE MODAL (CUSTOMIZE & SUBSCRIBE)
   -------------------------------------------------------------------------- */
window.openPlanModal = function(planName, price, mealsPerWeek, badge, description) {
  const modalOverlay = document.getElementById('public-modal');
  if (!modalOverlay) return;

  const modalBody = modalOverlay.querySelector('.modal-body');
  if (modalBody) {
    modalBody.innerHTML = `
      <div style="text-align: center; margin-bottom: 22px;">
        <span class="meal-badge" style="background: var(--color-primary); color: #FFFFFF; margin-bottom: 10px; display: inline-block;">${badge || 'SUBSCRIPTION PLAN'}</span>
        <h3 style="font-size: 1.6rem; font-weight: 700; color: var(--text-main); margin-bottom: 4px;">${planName} Plan</h3>
        <div style="font-size: 2.2rem; font-weight: 800; color: var(--color-primary); margin: 6px 0;">
          $${price} <span style="font-size: 0.95rem; font-weight: 500; color: var(--text-muted);">/ week</span>
        </div>
        <p class="text-muted" style="font-size: 0.9rem; max-width: 480px; margin: 0 auto; line-height: 1.5;">
          ${description} · <strong>${mealsPerWeek}</strong>
        </p>
      </div>

      <form onsubmit="handlePlanConfirmSubmit(event, '${planName}', '${price}')" style="display: flex; flex-direction: column; gap: 16px;">
        
        <!-- Milestone Stage Selection -->
        <div>
          <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px; color: var(--text-main);">
            Child's Milestone Stage *
          </label>
          <select id="planStageSelect" required style="width: 100%; padding: 11px 14px; border: 1.5px solid var(--border-color); border-radius: var(--radius-sm); font-size: 0.92rem; background: var(--bg-alt); color: var(--text-main); outline: none;">
            <option value="Stage 1: First Tastes (4–6 Mo)" ${planName === 'Little Start' ? 'selected' : ''}>Stage 1: First Tastes (4–6 Mo — Silky Smooth Purees)</option>
            <option value="Stage 2: Flavor Explorer (6–8 Mo)" ${planName === 'Growing Table' ? 'selected' : ''}>Stage 2: Flavor Explorer (6–8 Mo — Gentle Mash & Blends)</option>
            <option value="Stage 3: Texture Adventure (9–12 Mo)">Stage 3: Texture Adventure (9–12 Mo — Soft Chews & Grains)</option>
            <option value="Toddler Table (12+ Mo)" ${planName === 'Family Flow' ? 'selected' : ''}>Toddler Table (12+ Mo — Nutritious Chunkier Bites)</option>
            <option value="Multi-Stage Family Mix">Multi-Stage Family Mix (Multi-child Customized)</option>
          </select>
        </div>

        <!-- Allergen Exclusions -->
        <div>
          <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 8px; color: var(--text-main);">
            Dietary & Allergen Exclusions
          </label>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 8px;">
            <label style="display: flex; align-items: center; gap: 6px; font-size: 0.82rem; background: var(--bg-alt); padding: 8px 10px; border-radius: 6px; border: 1px solid var(--border-color); cursor: pointer; color: var(--text-main);">
              <input type="checkbox" name="allergen" value="nut-free" checked style="accent-color: var(--color-primary);"> 🥜 100% Nut-Free
            </label>
            <label style="display: flex; align-items: center; gap: 6px; font-size: 0.82rem; background: var(--bg-alt); padding: 8px 10px; border-radius: 6px; border: 1px solid var(--border-color); cursor: pointer; color: var(--text-main);">
              <input type="checkbox" name="allergen" value="dairy-free" style="accent-color: var(--color-primary);"> 🥛 Dairy-Free
            </label>
            <label style="display: flex; align-items: center; gap: 6px; font-size: 0.82rem; background: var(--bg-alt); padding: 8px 10px; border-radius: 6px; border: 1px solid var(--border-color); cursor: pointer; color: var(--text-main);">
              <input type="checkbox" name="allergen" value="gluten-free" style="accent-color: var(--color-primary);"> 🌾 Gluten-Free
            </label>
            <label style="display: flex; align-items: center; gap: 6px; font-size: 0.82rem; background: var(--bg-alt); padding: 8px 10px; border-radius: 6px; border: 1px solid var(--border-color); cursor: pointer; color: var(--text-main);">
              <input type="checkbox" name="allergen" value="egg-free" style="accent-color: var(--color-primary);"> 🥚 Egg-Free
            </label>
          </div>
        </div>

        <!-- Delivery Day & Billing Cadence -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px; color: var(--text-main);">
              Weekly Delivery Day
            </label>
            <select id="planDeliveryDay" style="width: 100%; padding: 11px 12px; border: 1.5px solid var(--border-color); border-radius: var(--radius-sm); font-size: 0.9rem; background: var(--bg-alt); color: var(--text-main); outline: none;">
              <option value="Tuesday">Tuesday Morning</option>
              <option value="Friday">Friday Morning</option>
            </select>
          </div>
          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px; color: var(--text-main);">
              Billing Cadence
            </label>
            <select id="planCadence" style="width: 100%; padding: 11px 12px; border: 1.5px solid var(--border-color); border-radius: var(--radius-sm); font-size: 0.9rem; background: var(--bg-alt); color: var(--text-main); outline: none;">
              <option value="Weekly">Weekly ($${price} / week)</option>
              <option value="Monthly">Monthly (-10% Savings)</option>
            </select>
          </div>
        </div>

        <!-- Reassurance & Zero Commitment Strip -->
        <div style="background: linear-gradient(135deg, rgba(var(--color-primary-rgb), 0.08) 0%, rgba(226, 149, 120, 0.06) 100%); border: 1px solid rgba(var(--color-primary-rgb), 0.25); padding: 12px 16px; border-radius: 8px; font-size: 0.82rem; color: var(--text-main); display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 1.25rem;">✨</span>
          <div>
            <strong>Zero Commitment Guarantee:</strong> Modify meals, skip weeks, or pause anytime before Wednesday midnight in your Parent Portal.
          </div>
        </div>

        <!-- Submit Button -->
        <button type="submit" class="btn btn-primary" style="width: 100%; padding: 14px; font-size: 0.98rem; font-weight: 700; border-radius: var(--radius-full); text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 14px rgba(var(--color-primary-rgb), 0.35);">
          Confirm Plan &amp; Continue to Portal →
        </button>

        <div style="text-align: center; font-size: 0.85rem; color: var(--text-muted);">
          Already have an account? <a href="login.html" class="auth-link-bold" style="color: var(--color-primary); font-weight: 600;">Sign In</a>
        </div>
      </form>
    `;
  }

  modalOverlay.classList.add('active');
};

window.handlePlanConfirmSubmit = function(event, planName, price) {
  event.preventDefault();
  const stage = document.getElementById('planStageSelect')?.value || 'Stage 1';
  const day = document.getElementById('planDeliveryDay')?.value || 'Tuesday';
  const cadence = document.getElementById('planCadence')?.value || 'Weekly';

  const planSelection = {
    plan: planName,
    price: price,
    stage: stage,
    deliveryDay: day,
    cadence: cadence,
    selectedAt: new Date().toISOString()
  };

  try {
    localStorage.setItem('nourish_selected_plan', JSON.stringify(planSelection));
  } catch(e) {
    console.warn(e);
  }

  showToast(`"${planName}" plan selected! Loading your Parent Portal...`);
  const modalOverlay = document.getElementById('public-modal');
  if (modalOverlay) modalOverlay.classList.remove('active');

  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 1100);
};

/* --------------------------------------------------------------------------
   06C. ALLERGEN DETAIL & MANAGEMENT MODAL
   -------------------------------------------------------------------------- */
const allergenDataDetails = {
  'milk': {
    name: 'Milk & Dairy',
    img: 'assets/images/1.jpg',
    status: 'Clearly Tagged',
    policy: 'Present only in select Stage 3/4 toddler meals (such as toddler cheese ravioli and creamy risottos). Completely absent in all Stage 1 and Stage 2 infant purées.',
    kitchen: 'Dedicated steam cookers and utensils are used for dairy-containing batches, followed by triple-rinse sanitization.',
    safeStages: 'Stage 1 & 2: 100% Dairy-Free • Stage 3/4: Clearly Flagged',
    filterTip: 'Toggle "Dairy-Free" in your Parent Portal to automatically substitute any dairy recipes with plant-based alternatives.'
  },
  'egg': {
    name: 'Egg Allergens',
    img: 'assets/images/2.jpg',
    status: 'Toddler Textures Only',
    policy: 'Used exclusively in specialized toddler pasta textures and bakes. Completely excluded from baby purées and infant blends.',
    kitchen: 'Prepared on isolated sanitized production lines. Allergen-certified test swabs verify zero egg protein residue before infant batches.',
    safeStages: 'Stage 1, 2 & 3: 100% Egg-Free • Stage 4: Tagged Toddler Bakes',
    filterTip: 'Easily excluded with 1-click in your account settings; our chefs will substitute with lentil and seed-based proteins.'
  },
  'wheat': {
    name: 'Wheat & Gluten',
    img: 'assets/images/3.jpg',
    status: 'Gluten-Free Swaps Available',
    policy: 'Present in select organic toddler pastas and oat bowls. Certified gluten-free grain alternatives (quinoa, millet, brown rice) available for every recipe.',
    kitchen: 'Dedicated gluten-free batch days prevent airborne dust cross-contact.',
    safeStages: 'Gluten-Free Purees & Bowls Available for Every Stage',
    filterTip: 'Select "Gluten-Free" in dietary preferences to lock in only 100% certified gluten-free weekly deliveries.'
  },
  'soy': {
    name: 'Soy & Edamame',
    img: 'assets/images/4.jpg',
    status: 'Excluded in Stage 1 & 2',
    policy: 'Strictly excluded from all Stage 1 & Stage 2 infant purées. Sparingly featured in Stage 4 toddler bowls and easily filtered out.',
    kitchen: 'Soy ingredients are stored in sealed color-coded containers in our allergen quarantine zone.',
    safeStages: 'Stage 1 & 2: 100% Soy-Free • Stage 4: Optional Ingredient',
    filterTip: 'One click in your allergy matrix completely excludes all soy-derived ingredients from your weekly menu suggestions.'
  },
  'peanuts': {
    name: 'Peanuts',
    img: 'assets/images/5.jpg',
    status: '100% Peanut-Free Facility',
    policy: 'Our prep kitchen is a certified 100% peanut-free facility. We maintain absolute zero peanut processing across our entire ingredient supply.',
    kitchen: 'Strict supplier verification guarantees no peanut contamination throughout our regenerative farm supply chain.',
    safeStages: 'All Stages: 100% Peanut-Free Facility Guarantee',
    filterTip: 'Zero risk of accidental exposure. Every jar in every delivery is 100% free of peanuts and peanut oils.'
  },
  'tree-nuts': {
    name: 'Tree Nuts',
    img: 'assets/images/6.jpg',
    status: 'Dedicated Tree Nut-Free Kitchen',
    policy: 'Zero almonds, walnuts, cashews, pecans, or tree nuts are processed in our kitchen facility. Complete safety for families with severe nut allergies.',
    kitchen: 'Regular third-party ELISA lab screening validates zero tree nut trace proteins in our facility.',
    safeStages: 'All Stages: 100% Tree Nut-Free Facility Guarantee',
    filterTip: 'All Nourish Nest meals are 100% nut-free by kitchen standard. No toggling necessary.'
  },
  'fish': {
    name: 'Fish & Salmon',
    img: 'assets/images/7.jpg',
    status: 'Wild Salmon Flagged',
    policy: 'Selected toddler nutrient bowls contain sustainably caught wild Alaskan salmon. Prepped on isolated sanitized lines and boldly labeled.',
    kitchen: 'Dedicated cold-prep station with isolated color-coded cutting boards, steam inserts, and immediate post-batch sanitation.',
    safeStages: 'Stage 1 & 2: 100% Fish-Free • Stage 3/4: Wild Salmon Only',
    filterTip: 'Toggle "Fish-Free" to replace seafood bowls with wholesome pasture-raised poultry or organic legume recipes.'
  },
  'sesame': {
    name: 'Sesame',
    img: 'assets/images/8.jpg',
    status: 'Optional Stage 4 Only',
    policy: 'Used as optional tahini dressings in select Stage 4 toddler bowls. Never blended into infant stages and 1-click filterable in your profile.',
    kitchen: 'Sesame ingredients are quarantined and packaged separately with airtight seals.',
    safeStages: 'Stage 1, 2 & 3: 100% Sesame-Free • Stage 4: Clearly Marked',
    filterTip: 'Easily excluded in your Parent Portal allergy tab to enjoy sesame-free toddler favorites.'
  }
};

window.openAllergenDetailModal = function(key) {
  const data = allergenDataDetails[key];
  if (!data) return;

  const modalOverlay = document.getElementById('public-modal');
  if (!modalOverlay) return;

  const modalBody = modalOverlay.querySelector('.modal-body');
  if (modalBody) {
    modalBody.innerHTML = `
      <div style="text-align: left;">
        <div style="position: relative; width: 100%; height: 200px; border-radius: 12px; overflow: hidden; margin-bottom: 20px;">
          <img src="${data.img}" alt="${data.name}" style="width: 100%; height: 100%; object-fit: cover;">
          <div style="position: absolute; top: 12px; right: 12px; background: rgba(30,24,20,0.8); color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; backdrop-filter: blur(8px);">
            ${data.status}
          </div>
        </div>

        <h3 style="font-family: var(--font-heading); font-size: 1.5rem; margin-bottom: 8px; color: var(--text-main);">
          ${data.name} Management Protocol
        </h3>
        <p class="text-muted" style="font-size: 0.92rem; line-height: 1.6; margin-bottom: 18px;">
          ${data.policy}
        </p>

        <div style="background: var(--bg-alt); border: 1px solid var(--border-color); border-radius: 10px; padding: 16px; margin-bottom: 16px;">
          <div style="font-size: 0.85rem; font-weight: 700; color: var(--color-primary); margin-bottom: 6px;">
            🛡️ Kitchen Sanitation &amp; Isolation Protocol:
          </div>
          <div style="font-size: 0.85rem; color: var(--text-main); line-height: 1.5;">
            ${data.kitchen}
          </div>
        </div>

        <div style="background: rgba(var(--color-primary-rgb), 0.08); border: 1px solid rgba(var(--color-primary-rgb), 0.25); border-radius: 10px; padding: 14px 16px; margin-bottom: 22px;">
          <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-main); margin-bottom: 4px;">
            📋 Stage Availability:
          </div>
          <div style="font-size: 0.84rem; color: var(--text-muted);">
            ${data.safeStages}
          </div>
        </div>

        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <a href="dashboard.html" class="btn btn-primary" style="flex: 1; padding: 12px 18px; text-align: center; font-size: 0.9rem;">
            Manage Preferences in Portal →
          </a>
          <button type="button" class="btn btn-outline" onclick="document.getElementById('public-modal').classList.remove('active')" style="padding: 12px 20px; font-size: 0.9rem;">
            Close
          </button>
        </div>
      </div>
    `;
  }

  modalOverlay.classList.add('active');
};

/* --------------------------------------------------------------------------
   07. LOGIN DEMO HANDLER
   -------------------------------------------------------------------------- */
function initLoginDemo() {
  const loginForm = document.getElementById('login-form');
  if (!loginForm) return;

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email')?.value;
    const password = document.getElementById('password')?.value;

    if (email && password) {
      showToast('Demo login successful! Redirecting to Parent Portal...');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1200);
    }
  });
}

/* --------------------------------------------------------------------------
   08. REGISTER DEMO HANDLER
   -------------------------------------------------------------------------- */
function initRegisterDemo() {
  const regForm = document.getElementById('register-form');
  if (!regForm) return;

  regForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fname = document.getElementById('reg-fname')?.value;
    const email = document.getElementById('reg-email')?.value;
    const pass = document.getElementById('reg-password')?.value;
    const confirmPass = document.getElementById('reg-confirm-password')?.value;

    if (pass !== confirmPass) {
      showToast('⚠️ Passwords do not match! Please check again.');
      return;
    }

    if (email && pass) {
      showToast(`Welcome ${fname || 'Parent'}! Account created successfully. Redirecting...`);
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1200);
    }
  });
}

/* --------------------------------------------------------------------------
   TOAST NOTIFICATION HELPER
   -------------------------------------------------------------------------- */
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>🌱</span> ${message}`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* --------------------------------------------------------------------------
   08. INTERACTIVE SENSORY & FLAVOR GROWTH MATRIX (HOME 2)
   -------------------------------------------------------------------------- */
function initSensoryGrowthMatrix() {
  const stageBtns = document.querySelectorAll('.stage-node-btn');
  if (!stageBtns.length) return;

  const stageData = {
    '1': {
      label: 'STAGE 1 MILESTONE (4–6M)',
      title: 'First Spoons & Smooth Palate Intro',
      badgeIcon: '🌱',
      badgeText: 'Single-Ingredient Organics',
      textureVal: '100% Ultra Smooth Purée',
      textureWidth: '100%',
      nutrientVal: '94% Essential Iron & Vitamin A',
      nutrientWidth: '94%',
      chewVal: 'Gentle Swallowing Reflex',
      chewWidth: '20%',
      ingredients: [
        { label: '🥕 Sweet Steam Carrot', desc: 'Rich in Beta-Carotene for healthy eye & immune development' },
        { label: '🥑 Organic Butter Avocado', desc: 'Packed with healthy monounsaturated fats for brain growth' },
        { label: '🍏 Golden Apple Reduction', desc: 'Soluble pectin fiber for gentle first digestion' },
        { label: '🥣 Steamed Oat Flour', desc: 'Hypoallergenic grain base for sustained calm energy' }
      ],
      insight: '"During 4–6 months, the focus is gentle introduction to natural single flavors without sodium or added sugars. Soft steam purées assist the smooth transition from liquid milk feeds."'
    },
    '2': {
      label: 'STAGE 2 MILESTONE (7–9M)',
      title: 'Velvet Mashes & Flavor Synergy',
      badgeIcon: '🥑',
      badgeText: 'Multi-Ingredient Layering',
      textureVal: '75% Soft Velvet Mash',
      textureWidth: '75%',
      nutrientVal: '98% Brain DHA, Omega-3 & Zinc',
      nutrientWidth: '98%',
      chewVal: 'Tongue Mash & Palate Exploration',
      chewWidth: '50%',
      ingredients: [
        { label: '🎃 Pumpkin Lentil Medley', desc: 'Plant protein & folate for rapid cellular development' },
        { label: '🫐 Wild Blueberry Swirl', desc: 'Antioxidant boost for cognitive and immune support' },
        { label: '🐟 Wild Alaskan Salmon', desc: 'Clean source of essential Omega-3 DHA fatty acids' },
        { label: '🍠 Roasted Sweet Potato', desc: 'Complex carbs and natural digestive prebiotic fiber' }
      ],
      insight: '"At 7–9 months, babies develop tongue-mashing mechanics. Velvet textures expand palate curiosity while introducing essential omega fatty acids."'
    },
    '3': {
      label: 'STAGE 3 MILESTONE (10–12M)',
      title: 'Soft Finger Morsels & Pincer Grasp',
      badgeIcon: '🖐️',
      badgeText: 'Pincer Grasp Motor Skills',
      textureVal: '50% Tender Soft Cubes',
      textureWidth: '50%',
      nutrientVal: '96% High Calcium & Bioactive Protein',
      nutrientWidth: '96%',
      chewVal: 'Active Gum & Early Tooth Mastication',
      chewWidth: '78%',
      ingredients: [
        { label: '🫛 Steam Soft Peas', desc: 'Ideal shape & size for motor coordination and grasp control' },
        { label: '🧀 Organic Grass-Fed Cottage Cheese', desc: 'Bone-building calcium & easy-to-digest protein' },
        { label: '🍚 Whole Grain Brown Rice Risotto', desc: 'Hearty chew texture building jaw strength' },
        { label: '🍌 Warm Cinnamon Banana', desc: 'Natural sweetness rich in potassium and Vitamin B6' }
      ],
      insight: '"10–12 month toddlers build independence through soft pincer-sized morsels. Textures encourage jaw muscle control and hand-eye feeding coordination."'
    },
    '4': {
      label: 'STAGE 4 MILESTONE (12+M)',
      title: 'Gourmet Toddler Plates & Culinary Depth',
      badgeIcon: '🍽️',
      badgeText: 'Complete Table Readiness',
      textureVal: '25% Culinary Soft Cubes',
      textureWidth: '25%',
      nutrientVal: '100% Balanced Micro & Macro Plate',
      nutrientWidth: '100%',
      chewVal: 'Full Mastication & Independent Feeding',
      chewWidth: '95%',
      ingredients: [
        { label: '🍝 Whole Wheat Spinach Ravioli', desc: 'Artisanal pasta filled with iron-rich spinach & ricotta' },
        { label: '🥦 Herb-Steamed Broccoli Florets', desc: 'Cruciferous veggies seasoned with subtle aromatic herbs' },
        { label: '🦃 Free-Range Turkey Meatballs', desc: 'Tender lean protein for muscle growth and vitality' },
        { label: '🍎 Baked Spiced Apple Wedges', desc: 'Warm comforting dessert without refined sugars' }
      ],
      insight: '"At 12+ months, toddlers transition to complete family-style plates. Complex textures and aromatic herb profiles prevent picky eating and foster lifelong healthy habits."'
    }
  };

  const labelEl = document.getElementById('sensoryStageLabel');
  const titleEl = document.getElementById('sensoryCardTitle');
  const heroBadgeIcon = document.querySelector('#sensoryHeroBadge .badge-icon');
  const heroBadgeText = document.getElementById('sensoryBadgeText');
  const textureValEl = document.getElementById('textureVal');
  const textureBarEl = document.getElementById('textureBar');
  const nutrientValEl = document.getElementById('nutrientVal');
  const nutrientBarEl = document.getElementById('nutrientBar');
  const chewValEl = document.getElementById('chewVal');
  const chewBarEl = document.getElementById('chewBar');
  const cloudContainer = document.getElementById('ingredientCloud');
  const insightEl = document.getElementById('pediatricInsight');
  const cardPanel = document.getElementById('sensoryDisplayCard');

  stageBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const stageKey = btn.getAttribute('data-stage');
      const data = stageData[stageKey];
      if (!data) return;

      // Toggle active states on buttons
      stageBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Subtle card fade animation
      if (cardPanel) {
        cardPanel.style.opacity = '0.4';
        cardPanel.style.transform = 'translateY(8px)';
      }

      setTimeout(() => {
        if (labelEl) labelEl.textContent = data.label;
        if (titleEl) titleEl.textContent = data.title;
        if (heroBadgeIcon) heroBadgeIcon.textContent = data.badgeIcon;
        if (heroBadgeText) heroBadgeText.textContent = data.badgeText;
        if (textureValEl) textureValEl.textContent = data.textureVal;
        if (textureBarEl) textureBarEl.style.width = data.textureWidth;
        if (nutrientValEl) nutrientValEl.textContent = data.nutrientVal;
        if (nutrientBarEl) nutrientBarEl.style.width = data.nutrientWidth;
        if (chewValEl) chewValEl.textContent = data.chewVal;
        if (chewBarEl) chewBarEl.style.width = data.chewWidth;
        if (insightEl) insightEl.textContent = data.insight;

        // Render ingredients cloud
        if (cloudContainer) {
          cloudContainer.innerHTML = '';
          data.ingredients.forEach(item => {
            const chip = document.createElement('span');
            chip.className = 'ingredient-chip';
            chip.textContent = item.label;
            chip.setAttribute('title', item.desc);
            chip.addEventListener('click', () => {
              showToast(`${item.label}: ${item.desc}`);
            });
            cloudContainer.appendChild(chip);
          });
        }

        if (cardPanel) {
          cardPanel.style.opacity = '1';
          cardPanel.style.transform = 'translateY(0)';
        }
      }, 150);
    });
  });

  // Attach sample recipe inspector button action
  const sampleBtn = document.getElementById('sampleRecipeBtn');
  if (sampleBtn) {
    sampleBtn.addEventListener('click', () => {
      const activeStage = document.querySelector('.stage-node-btn.active');
      const stageNum = activeStage ? activeStage.getAttribute('data-stage') : '1';
      showToast(`Loading Stage ${stageNum} Nutritional Lab Analysis...`);
    });
  }
}

/* --------------------------------------------------------------------------
   09. OUR KITCHEN QUALITY & STEAM INNOVATION (ABOUT PAGE)
   -------------------------------------------------------------------------- */
function initOurKitchenQualityMatrix() {
  const pillarCards = document.querySelectorAll('.pillar-interactive-card');
  if (!pillarCards.length) return;

  const pillarData = {
    '1': {
      temp: 'Fresh Harvest Ambient',
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>',
      badge: '100% Organic Farm Direct',
      note: '"Produce is harvested at peak maturity from certified organic partners and delivered within 24 hours of prep."',
      metrics: [
        { label: 'USDA Organic Certification', val: '100% Verified' },
        { label: 'Time from Soil to Kitchen', val: '< 24 Hours' },
        { label: 'Synthetic Pesticides & GMOs', val: '0% Detected' }
      ]
    },
    '2': {
      temp: '98°C Soft Thermal Steam',
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M8 4v2M16 4v2M4 11h16a1 1 0 0 1 1 1v2a7 7 0 0 1-7 7H10a7 7 0 0 1-7-7v-2a1 1 0 0 1 1-1z"/></svg>',
      badge: 'Gentle Steaming',
      note: '"Steam cooking locks in essential water-soluble B vitamins and vitamin C without leaching nutrient water."',
      metrics: [
        { label: 'Vitamin C Retention Rate', val: '98.4% Preserved' },
        { label: 'Heavy Metal & Pesticide Audit', val: '100% Passed' },
        { label: 'Small-Batch Hydration Level', val: 'Optimal Soft Texture' }
      ]
    },
    '3': {
      temp: 'Lab Assay Screen Passed',
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>',
      badge: 'Triple-Filter Certified',
      note: '"Every single cooking batch is tested for heavy metals, pesticides, and bacterial purity before sealing."',
      metrics: [
        { label: 'Lead & Heavy Metal Limits', val: 'Strict Zero Tolerance' },
        { label: 'Pathogen Screening (Listeria/E.Coli)', val: '100% Clear' },
        { label: 'Batch Certificate Transparency', val: 'Publicly Accessible' }
      ]
    },
    '4': {
      temp: '3°C Rapid Chilling',
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="22"/><line x1="20" y1="12" x2="4" y2="12"/><line x1="17.66" y1="6.34" x2="6.34" y2="17.66"/><line x1="17.66" y1="17.66" x2="6.34" y2="6.34"/></svg>',
      badge: 'Eco Cold-Chain',
      note: '"Immediate flash chilling locks in flavor profile and prevents cellular breakdown during transit."',
      metrics: [
        { label: 'Chilled Transit Temperature', val: '3°C - 5°C Constant' },
        { label: 'Thermal Insulation Pack', val: '100% Compostable' },
        { label: 'Shelf Life Freshness Window', val: '7 Days Refrigerated' }
      ]
    }
  };

  const tempEl = document.getElementById('kitchenTempDisplay');
  const iconEl = document.getElementById('kitchenPillarIcon');
  const badgeEl = document.getElementById('kitchenPillarBadge');
  const noteEl = document.getElementById('kitchenNoteText');
  const metricListEl = document.getElementById('kitchenMetricList');

  pillarCards.forEach(card => {
    card.addEventListener('click', () => {
      const pillarKey = card.getAttribute('data-pillar');
      const data = pillarData[pillarKey];
      if (!data) return;

      pillarCards.forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-selected', 'false');
      });
      card.classList.add('active');
      card.setAttribute('aria-selected', 'true');

      if (tempEl) tempEl.textContent = data.temp;
      if (iconEl) iconEl.innerHTML = data.icon;
      if (badgeEl) badgeEl.textContent = data.badge;
      if (noteEl) noteEl.textContent = data.note;

      if (metricListEl) {
        metricListEl.innerHTML = '';
        data.metrics.forEach(m => {
          const row = document.createElement('div');
          row.className = 'steam-metric-row';
          row.innerHTML = `
            <div class="metric-title-wrap">
              <span>${m.label}</span>
            </div>
            <span class="metric-status-tag">${m.val}</span>
          `;
          metricListEl.appendChild(row);
        });
      }
    });
  });

  const inspectBtn = document.getElementById('inspectKitchenBatchBtn');
  if (inspectBtn) {
    inspectBtn.addEventListener('click', () => {
      showToast('Opening Certified Lab Batch Inspection Portal...');
    });
  }
}

/* --------------------------------------------------------------------------
   10. MENU NUTRITIONAL MACRO & ALLERGEN PROFILER (MENU PAGE)
   -------------------------------------------------------------------------- */
function initMenuNutrientProfiler() {
  const priorityBtns = document.querySelectorAll('.priority-pill-btn');
  if (!priorityBtns.length) return;

  const profilerData = {
    'brain': {
      title: 'Brain DHA & Cognitive Development',
      badge: 'Cognitive Priority',
      carbsVal: '45% Complex Carbs',
      carbsWidth: '45%',
      fatVal: '35% Healthy Fats (DHA)',
      fatWidth: '35%',
      proteinVal: '20% Bio-Protein',
      proteinWidth: '20%',
      allergens: ['🥑 Organic Butter Avocado', '🐟 Wild Alaskan Salmon', '🌰 Walnut Oil Blend', '🫐 Wild Blueberries']
    },
    'immune': {
      title: 'Immune Defense & Antioxidant Boost',
      badge: 'Immunity Shield',
      carbsVal: '60% Vitamin Carbs',
      carbsWidth: '60%',
      fatVal: '25% Plant Lipids',
      fatWidth: '25%',
      proteinVal: '15% Gentle Protein',
      proteinWidth: '15%',
      allergens: ['🥕 Sweet Steam Carrot', '🎃 Roasted Pumpkin', '🫐 Wild Berry Swirl', '🍠 Golden Sweet Potato']
    },
    'bone': {
      title: 'Bone Growth & Iron Bio-Absorption',
      badge: 'Muscle & Bone Growth',
      carbsVal: '40% Whole Grain',
      carbsWidth: '40%',
      fatVal: '25% Essential Fatty Acids',
      fatWidth: '25%',
      proteinVal: '35% Lean Protein',
      proteinWidth: '35%',
      allergens: ['🫛 Steam Soft Peas', '🧀 Grass-Fed Organic Ricotta', '🦃 Free-Range Turkey', '🌾 Iron-Fortified Oats']
    },
    'gut': {
      title: 'Gentle Digestion & Prebiotic Fiber',
      badge: 'Microbiome Balance',
      carbsVal: '70% Prebiotic Fiber',
      carbsWidth: '70%',
      fatVal: '15% Plant Oils',
      fatWidth: '15%',
      proteinVal: '15% Hypoallergenic Base',
      proteinWidth: '15%',
      allergens: ['🍏 Golden Apple Pectin', '🥣 Steamed Oat Bran', '🍌 Cinnamon Banana', '🍐 Organic Pear Puree']
    }
  };

  const titleEl = document.getElementById('profilerTitle');
  const badgeEl = document.getElementById('profilerBadge');
  const carbsValEl = document.getElementById('carbsVal');
  const carbsBarEl = document.getElementById('carbsBar');
  const fatValEl = document.getElementById('fatVal');
  const fatBarEl = document.getElementById('fatBar');
  const proteinValEl = document.getElementById('proteinVal');
  const proteinBarEl = document.getElementById('proteinBar');
  const tagsContainer = document.getElementById('allergenTagsGrid');

  priorityBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const priorityKey = btn.getAttribute('data-priority');
      const data = profilerData[priorityKey];
      if (!data) return;

      priorityBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      if (titleEl) titleEl.textContent = data.title;
      if (badgeEl) badgeEl.textContent = data.badge;
      if (carbsValEl) carbsValEl.textContent = data.carbsVal;
      if (carbsBarEl) carbsBarEl.style.width = data.carbsWidth;
      if (fatValEl) fatValEl.textContent = data.fatVal;
      if (fatBarEl) fatBarEl.style.width = data.fatWidth;
      if (proteinValEl) proteinValEl.textContent = data.proteinVal;
      if (proteinBarEl) proteinBarEl.style.width = data.proteinWidth;

      if (tagsContainer) {
        tagsContainer.innerHTML = '';
        data.allergens.forEach(tagText => {
          const chip = document.createElement('span');
          chip.className = 'allergen-tag';
          chip.innerHTML = `<span>✨</span> ${tagText}`;
          tagsContainer.appendChild(chip);
        });
      }
    });
  });

  const filterBtn = document.getElementById('filterNutrientBtn');
  if (filterBtn) {
    filterBtn.addEventListener('click', () => {
      const activePill = document.querySelector('.priority-pill-btn.active');
      const priorityName = activePill ? activePill.querySelector('h4').textContent : 'Selected Nutrient Goal';
      showToast(`Filtering weekly menu for ${priorityName}...`);
    });
  }
}

/* --------------------------------------------------------------------------
   11. FAQ ACCORDION DROPDOWN HANDLER (PLANS PAGE)
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach((item, index) => {
    const btn = item.querySelector('.faq-question-btn');
    if (!btn) return;

    // Set open state for first FAQ item by default for great initial UX
    if (index === 0 && !document.querySelector('.faq-item.active')) {
      item.classList.add('active');
      btn.setAttribute('aria-expanded', 'true');
    }

    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all active items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherBtn = otherItem.querySelector('.faq-question-btn');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      // Toggle clicked item
      if (!isActive) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   12. PEDIATRIC EARLY ALLERGEN INTRODUCTION & SAFETY MATRIX (ALLERGIES PAGE)
   -------------------------------------------------------------------------- */
function initAllergenProtocolMatrix() {
  const protocolCards = document.querySelectorAll('.protocol-stage-card');
  if (!protocolCards.length) return;

  const protocolData = {
    '1': {
      badge: 'STAGE A (6–7M): MICRO-DOSE INTRO',
      title: 'Pediatric Micro-Dose Exposure Protocol',
      desc: 'Controlled single-protein micro-exposures designed under pediatric allergy guidelines to safely introduce common allergenic proteins during the optimal infant immune window.',
      isolationVal: '100% Isolated Batch',
      isolationWidth: '100%',
      purityVal: '99.9% Precision',
      purityWidth: '99%',
      airborneVal: 'Zero Risk (5%)',
      airborneWidth: '5%',
      ingredients: [
        { name: '🥜 Peanut Flour Purée Swirl', note: '0.2g organic peanut protein micro-dose blend' },
        { name: '🥚 Steamed Egg Yolk Reduction', note: 'Low-allergenic yolk protein smooth puree' },
        { name: '🌾 Hydrolyzed Oat Flakes', note: 'Hypoallergenic grain carrying base' }
      ]
    },
    '2': {
      badge: 'STAGE B (8–10M): ROTATIONAL TOLERANCE',
      title: 'Weekly Rotational Allergen Building',
      desc: 'Alternating weekly allergen introduction schedule preventing single-protein sensitization while expanding immune tolerance across diverse organic food groups.',
      isolationVal: 'Dedicated Prep Lines',
      isolationWidth: '95%',
      purityVal: '98.5% Accuracy',
      purityWidth: '98%',
      airborneVal: 'HEPA Filtered (10%)',
      airborneWidth: '10%',
      ingredients: [
        { name: '🐟 Wild Salmon Velvet Mash', note: 'Ocean omega-3 & fish protein introduction' },
        { name: '🫘 Organic Soy Lecithin Swirl', note: 'Gentle plant lecithin tolerance intro' },
        { name: '🥛 Cultured Organic Yogurt Mash', note: 'Grass-fed dairy protein building block' }
      ]
    },
    '3': {
      badge: 'STAGE C (11+M): MAINTENANCE ROUTINE',
      title: 'Toddler Oral Tolerance Maintenance',
      desc: 'Sustained weekly toddler portion inclusion ensuring established oral immune tolerance is maintained through active childhood growth stages.',
      isolationVal: 'Clean Line Verified',
      isolationWidth: '90%',
      purityVal: '100% Whole Food',
      purityWidth: '100%',
      airborneVal: 'Swab Tested (15%)',
      airborneWidth: '15%',
      ingredients: [
        { name: '🍝 Whole Wheat Spinach Ravioli', note: 'Toddler bite pasta with ricottas & gluten' },
        { name: '🌱 Sesame Tahini Glazed Squash', note: 'Nutrient-rich sesame seed oil drizzle' },
        { name: '🍳 Mini Vegetable Omelet Bites', note: 'Whole egg toddler bite morsels' }
      ]
    },
    '4': {
      badge: 'STAGE D (0% RISK): 100% ELIMINATION SHIELD',
      title: 'Certified Allergen-Free Elimination Protocol',
      desc: 'For diagnosed infant allergies. 100% complete ingredient elimination backed by triple-swab lab testing and dedicated zero-allergen preparation suites.',
      isolationVal: '100% Isolated Suite',
      isolationWidth: '100%',
      purityVal: '100% Certified Free',
      purityWidth: '100%',
      airborneVal: '0.00% Residual',
      airborneWidth: '0%',
      ingredients: [
        { name: '🥕 Steam Carrot & Butter Avocado', note: 'Certified 100% Top-8 Allergen Free' },
        { name: '🎃 Roasted Pumpkin & Red Lentil', note: 'Nut-free, dairy-free, gluten-free pure purée' },
        { name: '🍏 Golden Apple Pectin Purée', note: 'Hypoallergenic soothing digestion mash' }
      ]
    }
  };

  const badgeEl = document.getElementById('protocolBadge');
  const titleEl = document.getElementById('protocolTitle');
  const descEl = document.getElementById('protocolDesc');
  const isoValEl = document.getElementById('isoVal');
  const isoBarEl = document.getElementById('isoBar');
  const purValEl = document.getElementById('purVal');
  const purBarEl = document.getElementById('purBar');
  const airValEl = document.getElementById('airVal');
  const airBarEl = document.getElementById('airBar');
  const ingListEl = document.getElementById('protocolIngredientList');
  const displayPanel = document.getElementById('protocolDisplayPanel');

  protocolCards.forEach(card => {
    card.addEventListener('click', () => {
      const stageKey = card.getAttribute('data-protocol');
      const data = protocolData[stageKey];
      if (!data) return;

      protocolCards.forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-selected', 'false');
      });
      card.classList.add('active');
      card.setAttribute('aria-selected', 'true');

      if (displayPanel) {
        displayPanel.style.opacity = '0.4';
        displayPanel.style.transform = 'translateY(6px)';
      }

      setTimeout(() => {
        if (badgeEl) badgeEl.textContent = data.badge;
        if (titleEl) titleEl.textContent = data.title;
        if (descEl) descEl.textContent = data.desc;
        if (isoValEl) isoValEl.textContent = data.isolationVal;
        if (isoBarEl) isoBarEl.style.width = data.isolationWidth;
        if (purValEl) purValEl.textContent = data.purityVal;
        if (purBarEl) purBarEl.style.width = data.purityWidth;
        if (airValEl) airValEl.textContent = data.airborneVal;
        if (airBarEl) airBarEl.style.width = data.airborneWidth;

        if (ingListEl) {
          ingListEl.innerHTML = '';
          data.ingredients.forEach(item => {
            const div = document.createElement('div');
            div.style.cssText = 'background: var(--bg-alt); padding: 12px 16px; border-radius: var(--radius-sm); border-left: 3px solid var(--color-primary);';
            div.innerHTML = `
              <strong style="display: block; font-size: 0.9rem; color: var(--text-main);">${item.name}</strong>
              <span style="font-size: 0.8rem; color: var(--text-muted);">${item.note}</span>
            `;
            ingListEl.appendChild(div);
          });
        }

        if (displayPanel) {
          displayPanel.style.opacity = '1';
          displayPanel.style.transform = 'translateY(0)';
        }
      }, 150);
    });
  });

  const reportBtn = document.getElementById('generateAllergyReportBtn');
  if (reportBtn) {
    reportBtn.addEventListener('click', () => {
      showToast('Generating Personal Pediatric Allergy Protocol Report...');
    });
  }
}

/* --------------------------------------------------------------------------
   13. FLOATING BACK TO TOP BUTTON CONTROLLER
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
   14. KITCHEN TEAM & EXPERT CONSULTATION MODALS (OUR KITCHEN PAGE)
   -------------------------------------------------------------------------- */
const kitchenTeamData = {
  elena: {
    name: 'Dr. Elena Vance, MD, FAAP',
    role: 'Chief Pediatric Medical Advisor & Neonatal Specialist',
    badge: 'Board Certified FAAP',
    img: 'assets/images/team-dr-elena-vance.jpg',
    education: 'Johns Hopkins School of Medicine (MD) • Children\'s National Hospital Residency',
    experience: '16+ Years in Pediatric Gastroenterology & Infant Gut Microbiome',
    bio: 'Dr. Elena Vance leads our clinical advisory panel, ensuring every age-stage texture and recipe introduction aligns precisely with neonatal physiology. She has authored over 12 peer-reviewed studies on early allergen tolerance and intestinal mucosal development in infants under 24 months.',
    specialties: ['Infant Gut Health & Microbiome', 'Early Allergen Desensitization', 'Pediatric Chewing & Swallowing Textures', 'Micronutrient Deficiencies in Early Childhood'],
    quote: '"Every ingredient is vetted through clinical infant physiology — we feed growing organs, not just appetites."'
  },
  marcus: {
    name: 'Chef Marcus Chen, CEC',
    role: 'Head of Pediatric Culinary Innovation',
    badge: 'Culinary Institute of America',
    img: 'assets/images/team-chef-marcus-chen.jpg',
    education: 'The Culinary Institute of America (Hyde Park) • Certified Executive Chef',
    experience: '18+ Years in Farm-to-Table Gastronomy & Pediatric Culinary Development',
    bio: 'Former Michelin-starred Sous Chef and father of three, Chef Marcus re-imagines baby food by rejecting high-heat pressure pureeing. He developed our proprietary 98°C soft thermal steam chambers, which preserve produce cellular integrity, natural vibrant color, and sweet volatile aromatics without added salt or sugars.',
    specialties: ['Soft-Steam Temperature Modulation', 'Sensory Palate Training for Toddlers', 'Heritage Grain & Legume Hydration', 'Naturally Balanced Savory Flavor Profiles'],
    quote: '"Baby food should celebrate real flavors. Gentle steam cooking elevates the natural sweetness of organic heritage vegetables."'
  },
  priya: {
    name: 'Dr. Priya Sharma, PhD, RDN',
    role: 'Lead Pediatric Dietitian & Micronutrient Researcher',
    badge: 'Cornell University Doctorate',
    img: 'assets/images/team-dr-priya-sharma.jpg',
    education: 'Cornell University (PhD in Nutritional Biochemistry) • Registered Dietitian Nutritionist (RDN)',
    experience: '14+ Years Clinical Infant Nutrition Research & Pediatric Formulations',
    bio: 'Dr. Priya Sharma bridges biochemical nutritional research with real-world infant feeding routines. Her primary focus is maximizing non-heme iron and zinc bioavailability through organic plant-acid pairing, and optimizing DHA-to-choline ratios for critical neurodevelopment in the first 1,000 days of life.',
    specialties: ['Iron & Zinc Bioavailability Optimization', 'Neurodevelopmental DHA/Choline Synergy', 'Prebiotic & Probiotic Fiber Blends', 'Stage 1 through Stage 4 Macronutrient Tuning'],
    quote: '"Every nutrient has a partner. We pair vitamin C with organic legumes so your baby absorbs maximum vital iron."'
  },
  sarah: {
    name: 'Sarah Jenkins, MS, CFS',
    role: 'Director of Food Safety & Quality Assurance',
    badge: 'Certified Food Scientist',
    img: 'assets/images/team-sarah-jenkins.jpg',
    education: 'University of California, Davis (MS in Food Science & Microbiology) • CFS Certification',
    experience: '14+ Years in Infant Food Safety Regulation & Cleanroom Operations',
    bio: 'Formerly a senior food safety auditor for infant nutrition facilities, Sarah enforces our strict Zero-Tolerance heavy metal policy. She directs our independent third-party laboratory ICP-MS testing program, positive-pressure ISO-7 clean suites, and real-time cold-chain temperature telemetry.',
    specialties: ['ICP-MS Heavy Metal Mass Spectrometry', 'Cross-Contact Allergen Separation Protocols', 'Positive-Pressure Cleanroom Microbiology', 'Cold-Chain Telemetry & Thermal Packaging Integrity'],
    quote: '"Our zero-tolerance testing protocols provide parents with unconditional peace of mind every single meal."'
  }
};

window.openExpertModal = function(expertKey) {
  const expert = kitchenTeamData[expertKey];
  if (!expert) return;

  const modalOverlay = document.getElementById('public-modal');
  if (!modalOverlay) return;

  const modalBody = modalOverlay.querySelector('.modal-body');
  if (modalBody) {
    modalBody.innerHTML = `
      <div style="display: flex; gap: 20px; align-items: center; margin-bottom: 20px; flex-wrap: wrap;">
        <img src="${expert.img}" alt="${expert.name}" style="width: 86px; height: 86px; border-radius: 50%; object-fit: cover; border: 3px solid var(--color-primary); box-shadow: 0 4px 14px rgba(var(--color-primary-rgb), 0.25);">
        <div>
          <span class="meal-badge" style="margin-bottom: 6px; display: inline-block;">${expert.badge}</span>
          <h3 style="margin: 2px 0 4px; font-size: 1.25rem;">${expert.name}</h3>
          <div style="color: var(--color-primary); font-size: 0.85rem; font-weight: 700; text-transform: uppercase;">${expert.role}</div>
        </div>
      </div>

      <div style="background: var(--bg-alt); padding: 14px 16px; border-radius: 12px; margin-bottom: 16px; font-size: 0.88rem; line-height: 1.6;">
        <div style="margin-bottom: 4px;"><strong>🎓 Education:</strong> ${expert.education}</div>
        <div><strong>💼 Clinical Scope:</strong> ${expert.experience}</div>
      </div>

      <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.65; margin-bottom: 18px;">
        ${expert.bio}
      </p>

      <div style="margin-bottom: 20px;">
        <strong style="display: block; font-size: 0.82rem; text-transform: uppercase; color: var(--text-main); margin-bottom: 8px; letter-spacing: 0.5px;">Key Areas of Clinical Focus:</strong>
        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
          ${expert.specialties.map(s => `<span style="font-size: 0.78rem; background: var(--bg-surface); border: 1px solid var(--border-color); padding: 4px 10px; border-radius: 50px; font-weight: 500;">✓ ${s}</span>`).join('')}
        </div>
      </div>

      <div style="background: rgba(var(--color-primary-rgb), 0.08); border-left: 3px solid var(--color-primary); padding: 12px 16px; border-radius: 8px; font-style: italic; font-size: 0.85rem; color: var(--text-main); margin-bottom: 22px;">
        ${expert.quote}
      </div>

      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        <button class="btn btn-primary" style="flex: 1; padding: 12px 18px;" onclick="openConsultationModal('${expert.name}')">Book Consultation With Expert →</button>
        <button class="btn btn-outline" style="padding: 12px 18px;" onclick="closePublicModal()">Close</button>
      </div>
    `;
  }

  modalOverlay.classList.add('active');
};

window.openConsultationModal = function(preselectedExpert = '') {
  const modalOverlay = document.getElementById('public-modal');
  if (!modalOverlay) return;

  const modalBody = modalOverlay.querySelector('.modal-body');
  if (modalBody) {
    modalBody.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <span class="meal-badge" style="margin-bottom: 8px; display: inline-block;">1-on-1 Guidance</span>
        <h3 style="font-size: 1.35rem; margin-bottom: 6px;">Request Nutrition Consultation</h3>
        <p class="text-muted" style="font-size: 0.9rem;">Connect directly with our pediatric nutrition experts for personalized meal stage and allergen guidance.</p>
      </div>

      <form onsubmit="handleConsultationSubmit(event)" style="display: flex; flex-direction: column; gap: 14px;">
        <div>
          <label style="display: block; font-size: 0.82rem; font-weight: 600; margin-bottom: 6px;">Your Name</label>
          <input type="text" required placeholder="Parent or Caregiver Name" style="width: 100%; padding: 10px 14px; border: 1px solid var(--border-color); border-radius: 8px; font-size: 0.9rem; background: var(--bg-surface); color: var(--text-main);">
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div>
            <label style="display: block; font-size: 0.82rem; font-weight: 600; margin-bottom: 6px;">Email Address</label>
            <input type="email" required placeholder="name@example.com" style="width: 100%; padding: 10px 14px; border: 1px solid var(--border-color); border-radius: 8px; font-size: 0.9rem; background: var(--bg-surface); color: var(--text-main);">
          </div>
          <div>
            <label style="display: block; font-size: 0.82rem; font-weight: 600; margin-bottom: 6px;">Baby's Age</label>
            <select required style="width: 100%; padding: 10px 14px; border: 1px solid var(--border-color); border-radius: 8px; font-size: 0.9rem; background: var(--bg-surface); color: var(--text-main);">
              <option value="4-6m">4–6 Months (Stage 1 Purees)</option>
              <option value="7-9m">7–9 Months (Stage 2 Blends)</option>
              <option value="10-12m">10–12 Months (Stage 3 Mashes)</option>
              <option value="12-24m">12–24+ Months (Toddler Soft Bites)</option>
            </select>
          </div>
        </div>

        <div>
          <label style="display: block; font-size: 0.82rem; font-weight: 600; margin-bottom: 6px;">Primary Focus or Allergen Concerns</label>
          <input type="text" placeholder="e.g. Dairy intolerance, iron absorption, starting solids" style="width: 100%; padding: 10px 14px; border: 1px solid var(--border-color); border-radius: 8px; font-size: 0.9rem; background: var(--bg-surface); color: var(--text-main);">
        </div>

        ${preselectedExpert ? `<div style="font-size: 0.82rem; color: var(--color-primary); font-weight: 600;">Preferred Expert: ${preselectedExpert}</div>` : ''}

        <button type="submit" class="btn btn-primary" style="width: 100%; padding: 12px; margin-top: 8px;">
          Confirm Consultation Request →
        </button>
      </form>
    `;
  }

  modalOverlay.classList.add('active');
};

window.handleConsultationSubmit = function(e) {
  e.preventDefault();
  closePublicModal();
  showToast('Consultation requested! Our pediatric nutrition team will reach out within 24 hours.');
};

window.closePublicModal = function() {
  const modalOverlay = document.getElementById('public-modal');
  if (modalOverlay) modalOverlay.classList.remove('active');
};


