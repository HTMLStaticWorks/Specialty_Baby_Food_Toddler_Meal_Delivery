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

  // Attach click listener to meal cards for detail view
  document.querySelectorAll('.meal-card').forEach(card => {
    card.addEventListener('click', () => {
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
          <button class="btn btn-primary" style="width: 100%;" onclick="addPreferenceDemo('${name}')">Add to Weekly Preferences →</button>
        `;
      }

      modalOverlay.classList.add('active');
    });
  });
}

window.addPreferenceDemo = function(mealName) {
  showToast(`Added "${mealName}" to your preferences!`);
  const modalOverlay = document.getElementById('public-modal');
  if (modalOverlay) modalOverlay.classList.remove('active');
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

