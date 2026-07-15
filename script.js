const mainContent = document.querySelector("main");
const primarySectionOrder = ["hero", "skills", "projects", "experience", "about", "contact"];

if (mainContent) {
  primarySectionOrder.forEach((sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) mainContent.append(section);
  });
}

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const contactForm = document.querySelector(".contact-form");
const formStatus = document.querySelector(".form-status");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navLinks.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open navigation");
    }
  });
}

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const subject = encodeURIComponent(`Portfolio inquiry from ${name || "visitor"}`);
    const body = encodeURIComponent(
      [`Name: ${name}`, `Email: ${email}`, "", message || "Hi Nyein, I would like to discuss a software project."].join("\n")
    );

    window.location.href = `mailto:nyeinsithuaung20@gmail.com?subject=${subject}&body=${body}`;
    formStatus.textContent = "Opening your email app so you can send the message directly.";
    contactForm.reset();
  });
}

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 45, 360)}ms`;
    observer.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const canUseTilt =
  window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canUseTilt) {
  document.querySelectorAll(".tilt-card").forEach((card) => {
    if (!(card instanceof HTMLElement)) return;

    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const pointerX = (event.clientX - bounds.left) / bounds.width;
      const pointerY = (event.clientY - bounds.top) / bounds.height;
      const tiltStrength = card.classList.contains("featured-tilt") ? 16 : 12;
      const rotateY = (pointerX - 0.5) * tiltStrength;
      const rotateX = (0.5 - pointerY) * tiltStrength;

      card.style.setProperty("--tilt-x", `${rotateX.toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${rotateY.toFixed(2)}deg`);
      card.style.setProperty("--tilt-glow-x", `${(pointerX * 100).toFixed(1)}%`);
      card.style.setProperty("--tilt-glow-y", `${(pointerY * 100).toFixed(1)}%`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
      card.style.setProperty("--tilt-glow-x", "50%");
      card.style.setProperty("--tilt-glow-y", "50%");
    });
  });
}
const projectCarousel = document.querySelector("[data-project-carousel]");

if (projectCarousel) {
  const projectStage = projectCarousel.querySelector("[data-carousel-stage]");
  const projectCards = Array.from(projectCarousel.querySelectorAll("[data-project-card]"));
  const dotsWrap = projectCarousel.querySelector("[data-carousel-dots]");
  const previousProjectButton = projectCarousel.querySelector("[data-carousel-prev]");
  const nextProjectButton = projectCarousel.querySelector("[data-carousel-next]");
  let activeProjectIndex = 0;
  let dragStartX = 0;
  let dragPointerId = null;
  let didDragProject = false;
  let wheelLocked = false;
  const interactiveProjectElementSelector = "a, button, input, textarea, select, label";

  projectCarousel.tabIndex = 0;

  const getCircularOffset = (index) => {
    const total = projectCards.length;
    let offset = index - activeProjectIndex;

    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;

    return offset;
  };

  const updateProjectCarousel = () => {
    if (!projectCards.length) return;

    projectCards.forEach((card, index) => {
      const offset = getCircularOffset(index);
      card.classList.remove("is-active", "is-prev", "is-next", "is-far-prev", "is-far-next");
      card.setAttribute("aria-hidden", offset === 0 ? "false" : "true");
      card.style.setProperty("--card-z", String(Math.max(1, 8 - Math.abs(offset))));

      if (offset === 0) {
        card.classList.add("is-active");
      } else if (offset === -1) {
        card.classList.add("is-prev");
      } else if (offset === 1) {
        card.classList.add("is-next");
      } else if (offset === -2) {
        card.classList.add("is-far-prev");
      } else if (offset === 2) {
        card.classList.add("is-far-next");
      }
    });

    dotsWrap?.querySelectorAll(".project-3d-dot").forEach((dot, index) => {
      const isActive = index === activeProjectIndex;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-current", isActive ? "true" : "false");
    });
  };

  const showProject = (index) => {
    if (!projectCards.length) return;

    activeProjectIndex = (index + projectCards.length) % projectCards.length;
    updateProjectCarousel();
  };

  if (dotsWrap && projectCards.length) {
    projectCards.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.className = "project-3d-dot";
      dot.type = "button";
      dot.setAttribute("aria-label", `Show project ${index + 1}`);
      dot.addEventListener("click", () => showProject(index));
      dotsWrap.append(dot);
    });
  }

  previousProjectButton?.addEventListener("click", () => showProject(activeProjectIndex - 1));
  nextProjectButton?.addEventListener("click", () => showProject(activeProjectIndex + 1));

  const getClickedProjectCard = (event) => {
    const targetCard = event.target instanceof Element ? event.target.closest("[data-project-card]") : null;
    if (targetCard && projectCards.includes(targetCard)) return targetCard;

    return document
      .elementsFromPoint(event.clientX, event.clientY)
      .map((element) => element.closest("[data-project-card]"))
      .find((card) => card && projectCards.includes(card));
  };

  projectStage?.addEventListener("click", (event) => {
    const clickedContactLink =
      event.target instanceof Element ? event.target.closest(".project-card-link[href^='#']") : null;

    if (clickedContactLink instanceof HTMLAnchorElement) {
      if (didDragProject) {
        event.preventDefault();
        didDragProject = false;
        return;
      }

      const targetId = clickedContactLink.getAttribute("href");
      const targetSection = targetId ? document.querySelector(targetId) : null;

      if (targetSection) {
        event.preventDefault();
        targetSection.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
          block: "start",
        });
        window.history.pushState(null, "", targetId);
      }

      return;
    }

    const clickedCard = getClickedProjectCard(event);
    if (!clickedCard) return;

    const clickedIndex = projectCards.indexOf(clickedCard);
    if (clickedIndex < 0) return;

    if (didDragProject) {
      event.preventDefault();
      didDragProject = false;
      return;
    }

    if (clickedIndex === activeProjectIndex) return;

    event.preventDefault();
    showProject(clickedIndex);
  });

  projectStage?.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    if (event.target instanceof Element && event.target.closest(interactiveProjectElementSelector)) return;

    dragStartX = event.clientX;
    dragPointerId = event.pointerId;
    didDragProject = false;
    projectStage.classList.add("is-dragging");
    projectStage.setPointerCapture?.(event.pointerId);
  });

  projectStage?.addEventListener("pointermove", (event) => {
    if (dragPointerId !== event.pointerId) return;

    if (Math.abs(event.clientX - dragStartX) > 8) {
      didDragProject = true;
    }
  });

  const endProjectDrag = (event) => {
    if (dragPointerId !== event.pointerId) return;

    const dragDistance = event.clientX - dragStartX;
    projectStage?.classList.remove("is-dragging");
    projectStage?.releasePointerCapture?.(event.pointerId);
    dragPointerId = null;

    if (Math.abs(dragDistance) > 44) {
      showProject(activeProjectIndex + (dragDistance < 0 ? 1 : -1));
    }
  };

  projectStage?.addEventListener("pointerup", endProjectDrag);
  projectStage?.addEventListener("pointercancel", endProjectDrag);

  projectStage?.addEventListener("wheel", (event) => {
    const usesHorizontalWheel = Math.abs(event.deltaX) > Math.abs(event.deltaY) || event.shiftKey;
    const delta = usesHorizontalWheel ? event.deltaX || event.deltaY : 0;

    if (!usesHorizontalWheel || Math.abs(delta) < 8) return;

    event.preventDefault();

    if (wheelLocked) return;
    wheelLocked = true;
    showProject(activeProjectIndex + (delta > 0 ? 1 : -1));

    window.setTimeout(() => {
      wheelLocked = false;
    }, 420);
  }, { passive: false });

  projectCarousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      showProject(activeProjectIndex - 1);
    }

    if (event.key === "ArrowRight") {
      showProject(activeProjectIndex + 1);
    }
  });

  updateProjectCarousel();
}
