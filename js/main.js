/* 手機版導航欄切換（包含 ARIA 更新 與 focus 管理） */
function toggleMobileMenu(focusFirst = true) {
    const menu = document.getElementById('mobile-menu');
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const isHidden = menu.classList.contains('hidden');

    if (isHidden) {
        menu.classList.remove('hidden');
        menu.setAttribute('aria-hidden', 'false');
        toggleBtn.setAttribute('aria-expanded', 'true');
        if (focusFirst) {
            const firstItem = menu.querySelector('[role="menuitem"]');
            if (firstItem) firstItem.focus();
        }
    } else {
        menu.classList.add('hidden');
        menu.setAttribute('aria-hidden', 'true');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.focus();
    }
}

const menuToggleBtn = document.getElementById('mobile-menu-toggle');
if (menuToggleBtn) {
    menuToggleBtn.addEventListener('click', () => {
        toggleMobileMenu();
    });
    menuToggleBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMobileMenu();
        } else if (e.key === 'Escape') {
            const menu = document.getElementById('mobile-menu');
            if (!menu.classList.contains('hidden')) toggleMobileMenu();
        }
    });
}

/* 倒數計時器邏輯 */
const targetDate = new Date('2026-09-12T12:20:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference < 0) {
        ['countdown-days', 'countdown-hours', 'countdown-mins', 'countdown-secs'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerText = '00';
        });
        clearInterval(countdownInterval);
        return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((difference % (1000 * 60)) / 1000);

    const pad = (n) => String(n).padStart(2, '0');
    document.getElementById('countdown-days').innerText = pad(days);
    document.getElementById('countdown-hours').innerText = pad(hours);
    document.getElementById('countdown-mins').innerText = pad(mins);
    document.getElementById('countdown-secs').innerText = pad(secs);
}

updateCountdown();
const countdownInterval = setInterval(updateCountdown, 1000);

/* 手風琴折疊式面板 Accordion 互動控制（ARIA + 鍵盤） */
let activeAccordion = null;

function setAccordionState(id, expanded) {
    const btn = document.getElementById(`accordion-btn-${id}`);
    const content = document.getElementById(`accordion-content-${id}`);
    const icon = document.getElementById(`accordion-icon-${id}`);
    if (!btn || !content) return;

    btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    content.setAttribute('aria-hidden', expanded ? 'false' : 'true');

    if (expanded) {
        content.style.maxHeight = content.scrollHeight + "px";
        if (icon) icon.classList.add('rotate-180');
    } else {
        content.style.maxHeight = null;
        if (icon) icon.classList.remove('rotate-180');
    }
}

function toggleAccordion(id) {
    if (activeAccordion === id) {
        setAccordionState(id, false);
        activeAccordion = null;
        return;
    }

    for (let i = 1; i <= 3; i++) {
        setAccordionState(i, false);
    }

    setAccordionState(id, true);
    activeAccordion = id;
    const content = document.getElementById(`accordion-content-${id}`);
    if (content) content.querySelector('p, li, a, span')?.focus?.();
}

['accordion-btn-1', 'accordion-btn-2', 'accordion-btn-3'].forEach((id) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const idx = id.split('-').pop();
            toggleAccordion(Number(idx));
        } else if (e.key === 'Escape') {
            for (let i = 1; i <= 3; i++) setAccordionState(i, false);
            activeAccordion = null;
        }
    });
});

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        toggleAccordion(1);
    }, 300);
});
