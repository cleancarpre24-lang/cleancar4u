(function () {
  var WHATSAPP = "972538998195";
  var DEFAULT_MSG = "שלום, אני רוצה לקבוע טיפול לרכב שלי";

  function waUrl(text) {
    return (
      "https://wa.me/" +
      WHATSAPP +
      "?text=" +
      encodeURIComponent(text || DEFAULT_MSG)
    );
  }

  document.querySelectorAll("[data-wa]").forEach(function (el) {
    var msg = el.getAttribute("data-wa-msg");
    var text =
      msg !== null && msg !== "" ? msg : DEFAULT_MSG;
    el.href = waUrl(text);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener noreferrer");
  });

  var header = document.getElementById("site-header");
  if (header) {
    function onScroll() {
      header.classList.toggle("is-scrolled", window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  var tabs = document.querySelectorAll("[data-testimonial-tab]");
  var panels = document.querySelectorAll("[data-testimonial-panel]");
  if (tabs.length && panels.length) {
    function setActive(i) {
      tabs.forEach(function (t, j) {
        t.classList.toggle("is-active", j === i);
        t.setAttribute("aria-selected", j === i ? "true" : "false");
      });
      panels.forEach(function (p, j) {
        p.hidden = j !== i;
      });
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () {
        setActive(i);
      });
    });
    setActive(0);
  }
})();
