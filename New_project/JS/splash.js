// ===== Màn hình chờ Clove =====
(function () {
    const splash = document.getElementById("splash");
    if (!splash) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const SHOW_TIME = reduceMotion ? 5000 : 30000; // thời gian hiển thị (ms)

    document.body.classList.add("splash-active");

    // Mẫu con bướm dùng lại nhiều lần
    const butterflySvg = function () {
        return `
        <svg viewBox="0 0 100 80" aria-hidden="true">
            <defs>
                <linearGradient id="wingGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stop-color="#8b5cf6"/>
                    <stop offset="0.6" stop-color="#c04ff0"/>
                    <stop offset="1" stop-color="#ff5fc0"/>
                </linearGradient>
            </defs>
            <g class="wing_l">
                <path d="M50 42 C32 2, 4 2, 6 30 C8 50, 30 56, 50 46 Z" fill="url(#wingGrad)"/>
                <path d="M50 46 C36 50, 18 74, 34 74 C46 72, 50 58, 50 46 Z" fill="#6a3df0"/>
            </g>
            <g class="wing_r">
                <path d="M50 42 C68 2, 96 2, 94 30 C92 50, 70 56, 50 46 Z" fill="url(#wingGrad)"/>
                <path d="M50 46 C64 50, 82 74, 66 74 C54 72, 50 58, 50 46 Z" fill="#6a3df0"/>
            </g>
            <ellipse cx="50" cy="46" rx="2.6" ry="14" fill="#23242d"/>
        </svg>`;
    };

    // Logo bướm lớn ở giữa
    const logoSlot = splash.querySelector(".splash_logo_slot");
    if (logoSlot) {
        logoSlot.innerHTML = butterflySvg().replace("<svg", '<svg class="splash_logo"');
    }

    if (!reduceMotion) {
        // Bướm nhỏ bay tỏa ra từ giữa
        const butterflyLayer = splash.querySelector(".splash_butterflies");
        const COUNT = 14;

        for (let i = 0; i < COUNT; i++) {
            const wrap = document.createElement("div");
            wrap.innerHTML = butterflySvg();
            const el = wrap.firstElementChild;
            el.classList.add("mini_butterfly");
            el.style.setProperty("--size", 22 + Math.random() * 34 + "px");
            el.style.setProperty("--flap", 0.22 + Math.random() * 0.2 + "s");
            butterflyLayer.appendChild(el);

            const angle = (Math.PI * 2 * i) / COUNT + Math.random() * 0.5;
            const dist = 30 + Math.random() * 45; // % kích thước màn hình
            const dx = Math.cos(angle) * dist * (window.innerWidth / 100);
            const dy = Math.sin(angle) * dist * (window.innerHeight / 100) - 40;
            const rot = (Math.cos(angle) > 0 ? 1 : -1) * (20 + Math.random() * 40);
            const delay = 1000 + Math.random() * 1400;

            el.animate(
                [
                    { opacity: 0, transform: "translate(-50%, -50%) scale(0.2) rotate(0deg)" },
                    { opacity: 1, offset: 0.15 },
                    {
                        opacity: 1,
                        offset: 0.7,
                        transform: `translate(calc(-50% + ${dx * 0.8}px), calc(-50% + ${dy * 0.8}px)) scale(1) rotate(${rot}deg)`
                    },
                    {
                        opacity: 0,
                        transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy - 80}px)) scale(0.8) rotate(${rot * 1.4}deg)`
                    }
                ],
                { duration: 2600 + Math.random() * 900, delay: delay, easing: "ease-out", fill: "both" }
            );
        }

        // Tàn lửa tím/hồng/vàng bay lên
        const emberLayer = splash.querySelector(".splash_embers");
        const colors = ["#6a3df0", "#ff5fc0", "#f6d86b", "#b66bf5"];
        for (let i = 0; i < 26; i++) {
            const e = document.createElement("span");
            e.className = "ember";
            e.style.setProperty("--x", Math.random() * 100 + "%");
            e.style.setProperty("--d", 5 + Math.random() * 11 + "px");
            e.style.setProperty("--c", colors[i % colors.length]);
            e.style.setProperty("--t", 2.4 + Math.random() * 2.2 + "s");
            e.style.setProperty("--delay", Math.random() * 3 + "s");
            e.style.setProperty("--drift", (Math.random() - 0.5) * 160 + "px");
            emberLayer.appendChild(e);
        }
    }

    // Đóng màn hình chờ
    let closed = false;
    function closeSplash() {
        if (closed) return;
        closed = true;
        splash.classList.add("is-leaving");
        setTimeout(function () {
            splash.remove();
            document.body.classList.remove("splash-active");
        }, reduceMotion ? 350 : 950);
    }

    const timer = setTimeout(closeSplash, SHOW_TIME);

    splash.querySelector(".splash_skip").addEventListener("click", function () {
        clearTimeout(timer);
        closeSplash();
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            clearTimeout(timer);
            closeSplash();
        }
    });
})();