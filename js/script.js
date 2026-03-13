

const buttons = document.querySelectorAll("button");

buttons.forEach(btn=>{
  btn.addEventListener("mouseenter",()=>{
    btn.style.opacity = "0.85";
  });

  btn.addEventListener("mouseleave",()=>{
    btn.style.opacity = "1";
  });
});


const navToggle = document.querySelector(".nav-toggle");
const navLinksContainer = document.querySelector(".nav-links");

if(navToggle && navLinksContainer){
  navToggle.addEventListener("click", () => {
    navLinksContainer.classList.toggle("nav-open");
  });
}


function scrollToTarget(targetSelector){
  const el = document.querySelector(targetSelector);
  if(!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}


document.querySelectorAll("[data-scroll-target]").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const target = btn.getAttribute("data-scroll-target");
    if(target) scrollToTarget(target);
  });
});


const shopLink = document.querySelector('.nav-links a[href="#shop"]');
if(shopLink){
  shopLink.addEventListener("click", (e) => {
    e.preventDefault();
    scrollToTarget("#shop");
  });
}


const fragranceLink = document.querySelector('.nav-links a[href="#fragrance"]');
if(fragranceLink){
  fragranceLink.addEventListener("click", (e) => {
    e.preventDefault();
    scrollToTarget("#fragrance");
  });
}


const aboutLink = document.querySelector('.nav-links a[href="#about"]');
if(aboutLink){
  aboutLink.addEventListener("click", (e) => {
    e.preventDefault();
    scrollToTarget("#about");
  });
}


const blogLink = document.querySelector('.nav-links a[href="#blog"]');
if(blogLink){
  blogLink.addEventListener("click", (e) => {
    e.preventDefault();
    scrollToTarget("#blog");
  });
}


const contactLink = document.querySelector('.nav-links a[href="#contact"]');
if(contactLink){
  contactLink.addEventListener("click", (e) => {
    e.preventDefault();
    scrollToTarget("#contact");
  });
}


document.querySelectorAll(".shop-page").forEach((shopSection) => {
  const mainImg = shopSection.querySelector(".main-product-img");
  const left = shopSection.querySelector(".gallery-arrow-left");
  const right = shopSection.querySelector(".gallery-arrow-right");
  const dots = Array.from(shopSection.querySelectorAll(".gallery-dots .dot"));

  if (!mainImg) return;

  const slides = [
  "assets/original.png",   
  "assets/lily.png",       
  "assets/rose.png",       
  "assets/One Time.png"    
  ];

  let idx = 0;

  function setActiveDot(i) {
    if (dots.length === 0) return;
    const dotIndex = Math.max(0, Math.min(dots.length - 1, i % dots.length));
    dots.forEach((d) => d.classList.remove("active"));
    dots[dotIndex].classList.add("active");
  }

  function setSlide(i) {
    idx = (i + slides.length) % slides.length;
    mainImg.src = slides[idx];

    const mainContainer = mainImg.closest(".main-product");
    if (mainContainer){
      
      mainContainer.classList.remove(
        "bg-original",
        "bg-lily",
        "bg-rose",
        "bg-onetime"
      );

      
      if (idx === 0){
        mainContainer.classList.add("bg-original");
      } else if (idx === 1){
        mainContainer.classList.add("bg-lily");
      } else if (idx === 2){
        mainContainer.classList.add("bg-rose");
      } else if (idx === 3){
        mainContainer.classList.add("bg-onetime");
      }
    }
    setActiveDot(idx);
  }

  
  const fragOptions = Array.from(shopSection.querySelectorAll(".frag-option"));
  fragOptions.forEach((opt) => {
    opt.addEventListener("click", () => {
      fragOptions.forEach((o) => o.classList.remove("active"));
      opt.classList.add("active");
    });
  });

  
  const fragRadios = Array.from(shopSection.querySelectorAll('.frag-option input[type="radio"]'));
  fragRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      const label = radio.closest(".frag-option")?.querySelector(".frag-label")?.textContent?.trim();
      const targetIndex =
        label === "Original" ? 0 :
        label === "Lily" ? 1 :
        label === "Rose" ? 2 : 0;
      setSlide(targetIndex);
    });
  });

  if (left) left.addEventListener("click", () => setSlide(idx - 1));
  if (right) right.addEventListener("click", () => setSlide(idx + 1));

 
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => setSlide(i));
  });

  
  setSlide(0);
});

// Toggle details under each plan (single vs double)
document.querySelectorAll(".purchase-card").forEach((card) => {
  const singleRadio = card.querySelector('input[name="plan"][value="single"]');
  const doubleRadio = card.querySelector('input[name="plan"][value="double"]');
  const singleDetails = card.querySelector(".plan-single-details");
  const doubleDetails = card.querySelector(".plan-double-details");

  function applyMode() {
    if (!singleDetails || !doubleDetails) return;

    if (singleRadio && singleRadio.checked) {
      singleDetails.style.display = "block";
      doubleDetails.style.display = "none";
    } else if (doubleRadio && doubleRadio.checked) {
      singleDetails.style.display = "none";
      doubleDetails.style.display = "block";
    }
  }

  singleRadio?.addEventListener("change", applyMode);
  doubleRadio?.addEventListener("change", applyMode);

  // initial state
  applyMode();
});

// Add to cart: separate carts for single vs double subscription
(function setupCartHandling() {
  const addCartBtn = document.querySelector(".add-cart");
  if (!addCartBtn) return;

  addCartBtn.addEventListener("click", () => {
    // Determine selected plan
    const selectedPlanInput = document.querySelector('input[name="plan"]:checked');
    const plan = selectedPlanInput?.value === "double" ? "double" : "single";

    // Determine selected fragrance label
    const selectedFragInput = document.querySelector('input[name="frag"]:checked');
    const fragLabel = selectedFragInput
      ? selectedFragInput.closest(".frag-option")?.querySelector(".frag-label")?.textContent?.trim()
      : "Original";

    
    const price = plan === "double" ? 169.99 : 99.99;

    const storageKey = plan === "double" ? "cart_double" : "cart_single";

    const existing = (() => {
      try {
        const raw = localStorage.getItem(storageKey);
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    })();

    const newItem = {
      id: Date.now(),
      plan,
      fragrance: fragLabel || "Original",
      price,
      quantity: 1,
    };

    existing.push(newItem);
    localStorage.setItem(storageKey, JSON.stringify(existing));

    // Redirect to cart page 
    window.location.href = `cart.html?plan=${plan}`;
  });
})();

/* accordion for fragrance page */

const accordionItems = document.querySelectorAll(".accordion-item");

accordionItems.forEach(item => {

const header = item.querySelector(".accordion-header");

header.addEventListener("click", () => {

accordionItems.forEach(i=>{
i.classList.remove("active");
i.querySelector(".accordion-icon").textContent="+";
});

item.classList.add("active");

item.querySelector(".accordion-icon").textContent="−";

});

});

/* about page stat animation (run whenever section enters view) */

(function setupAboutStatsAnimation() {
  const statsSection = document.querySelector(".about-stats");
  if (!statsSection) return;

  const stats = statsSection.querySelectorAll(".stat-number");
  if (!stats.length) return;

  // Store final values and start from 0%
  stats.forEach((stat) => {
    const text = stat.textContent || "0";
    const numeric = parseInt(text, 10) || 0;
    stat.dataset.target = String(numeric);
    stat.textContent = "0%";
  });

  function animateOnce() {
    stats.forEach((stat) => {
      const target = parseInt(stat.dataset.target || "0", 10);
      let current = 0;
      const step = Math.max(1, Math.round(target / 50));

      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        stat.textContent = current + "%";
      }, 20);
    });
  }

  function resetAndAnimate() {
    stats.forEach((stat) => {
      stat.textContent = "0%";
    });
    animateOnce();
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            resetAndAnimate();
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(statsSection);
  } else {
    
    resetAndAnimate();
  }
})();

/* blog navigation */

document.querySelectorAll(".nav-links a").forEach(link=>{
    if(link.textContent==="Blog"){
    link.href="blog.html";
    }
    });

/* cart page rendering */

(function setupCartPage() {
  const cartSection = document.querySelector(".cart-page");
  if (!cartSection) return;

  const params = new URLSearchParams(window.location.search);
  const plan = params.get("plan") === "double" ? "double" : "single";
  const storageKey = plan === "double" ? "cart_double" : "cart_single";

  const titleEl = document.getElementById("cart-title");
  const subtitleEl = document.getElementById("cart-subtitle");
  const itemsContainer = document.getElementById("cart-items");
  const emptyEl = document.getElementById("cart-empty");

  if (titleEl) {
    titleEl.textContent =
      plan === "double" ? "Your Double Subscription Cart" : "Your Single Subscription Cart";
  }
  if (subtitleEl) {
    subtitleEl.textContent =
      plan === "double"
        ? "Items you’ve added under the Double Subscription plan."
        : "Items you’ve added under the Single Subscription plan.";
  }

  let items = [];
  try {
    const raw = localStorage.getItem(storageKey);
    items = raw ? JSON.parse(raw) : [];
  } catch {
    items = [];
  }

  function render() {
    if (!itemsContainer) return;

    itemsContainer.innerHTML = "";

    if (!items.length) {
      if (emptyEl) emptyEl.style.display = "block";
      return;
    }

    if (emptyEl) emptyEl.style.display = "none";

    items.forEach((item) => {
      const row = document.createElement("div");
      row.className = "cart-item";
      row.dataset.id = String(item.id);

      const main = document.createElement("div");
      main.className = "cart-item-main";

      const title = document.createElement("div");
      title.className = "cart-item-title";
      title.textContent =
        item.plan === "double" ? "Double Subscription" : "Single Subscription";

      const meta = document.createElement("div");
      meta.className = "cart-item-meta";
      meta.textContent = `Fragrance: ${item.fragrance || "Original"} • Qty: ${
        item.quantity || 1
      }`;

      main.appendChild(title);
      main.appendChild(meta);

      const rightSide = document.createElement("div");
      rightSide.className = "cart-item-right";

      const price = document.createElement("div");
      price.className = "cart-item-price";
      price.textContent = `$${(item.price || 0).toFixed(2)}`;

      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "cart-item-delete";
      delBtn.textContent = "Remove";
      delBtn.addEventListener("click", () => {
        items = items.filter((i) => i.id !== item.id);
        localStorage.setItem(storageKey, JSON.stringify(items));
        render();
      });

      rightSide.appendChild(price);
      rightSide.appendChild(delBtn);

      row.appendChild(main);
      row.appendChild(rightSide);

      itemsContainer.appendChild(row);
    });
  }

  render();
})();
