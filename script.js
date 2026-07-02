lucide.createIcons();
const header = document.querySelector("header");

window.addEventListener("scroll", () => {

    if(window.scrollY > 40){

        header.classList.add("scrolled");

    }else{

        header.classList.remove("scrolled");

    }

});
const menuToggle = document.getElementById("menu-toggle");
const navigation = document.getElementById("primary-navigation");

menuToggle.addEventListener("click", () => {
    navigation.classList.toggle("active");
});
document.querySelectorAll("#primary-navigation a").forEach(link => {

    link.addEventListener("click", () => {

        navigation.classList.remove("active");

    });

});

/* =====================================
   HERO ILLUSTRATION
   Particles + premium mouse parallax
===================================== */

(function(){

    const illustration = document.getElementById("heroIllustration");

    if(!illustration) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---- Particles ---- */

    const particleField = document.getElementById("heroParticles");

    if(particleField && !reduceMotion){

        const PARTICLE_COUNT = 26;

        const frag = document.createDocumentFragment();

        for(let i = 0; i < PARTICLE_COUNT; i++){

            const p = document.createElement("span");

            p.className = "hero-particle";

            const size = (Math.random() * 2.4 + 1).toFixed(1);
            const top = (Math.random() * 100).toFixed(1);
            const left = (Math.random() * 100).toFixed(1);
            const dx = (Math.random() * 60 - 30).toFixed(0);
            const dy = (Math.random() * -80 - 20).toFixed(0);
            const duration = (Math.random() * 10 + 10).toFixed(1);
            const delay = (Math.random() * 10).toFixed(1);

            p.style.width = size + "px";
            p.style.height = size + "px";
            p.style.top = top + "%";
            p.style.left = left + "%";
            p.style.setProperty("--dx", dx + "px");
            p.style.setProperty("--dy", dy + "px");
            p.style.animationDuration = duration + "s";
            p.style.animationDelay = delay + "s";

            frag.appendChild(p);

        }

        particleField.appendChild(frag);

    }

    /* ---- Mouse parallax ---- */

    if(!reduceMotion){

        const globeWrap = document.getElementById("globeWrap");
        const heroIcons = illustration.querySelector(".hero-icons");
        const particles = particleField;

        let targetX = 0, targetY = 0;
        let currentX = 0, currentY = 0;
        let ticking = false;

        illustration.addEventListener("mousemove", (e) => {

            const rect = illustration.getBoundingClientRect();
            const relX = (e.clientX - rect.left) / rect.width - 0.5;
            const relY = (e.clientY - rect.top) / rect.height - 0.5;

            targetX = relX;
            targetY = relY;

            if(!ticking){

                requestAnimationFrame(animateParallax);
                ticking = true;

            }

        });

        illustration.addEventListener("mouseleave", () => {

            targetX = 0;
            targetY = 0;

            if(!ticking){

                requestAnimationFrame(animateParallax);
                ticking = true;

            }

        });

        function animateParallax(){

            currentX += (targetX - currentX) * 0.08;
            currentY += (targetY - currentY) * 0.08;

            if(globeWrap){

                globeWrap.style.transform =
                    `translate(${currentX * 10}px, ${currentY * 8}px)`;

            }

            if(heroIcons){

                heroIcons.style.transform =
                    `translate(${currentX * 18}px, ${currentY * 14}px)`;

            }

            if(particles){

                particles.style.transform =
                    `translate(${currentX * 6}px, ${currentY * 6}px)`;

            }

            if(Math.abs(currentX - targetX) > 0.001 || Math.abs(currentY - targetY) > 0.001){

                requestAnimationFrame(animateParallax);

            }else{

                ticking = false;

            }

        }

    }

    /* Re-render Lucide icons for the newly injected hero markup */

    if(window.lucide){

        lucide.createIcons();

    }

})();
