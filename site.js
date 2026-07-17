/* Shared <site-header> / <site-footer> web components.
   Usage:
     <site-header base="../" active="team"></site-header>
     <site-footer base="../"></site-footer>
   - base:   "" for root pages (index.html, team.html), "../" for sub-pages (privacy/, etc.)
   - active: which nav item to highlight — "story" | "approach" | "team" | "news" (optional)
   Styling lives in site.css (load it in <head>). Classes are `ec-` prefixed
   to avoid colliding with any page's own stylesheet. */
(function(){
  "use strict";

  var BRAND = "EquitiFy Capital";
  var CHEVRON = '<svg class="ec-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';

  function headerHTML(base, active, overlay){
    function on(name){ return active === name ? ' class="ec-active"' : ''; }
    return ''
      + '<header class="ec-nav' + (overlay ? ' ec-nav--overlay' : '') + '">'
      +   '<div class="ec-nav-inner">'
      +     '<a href="' + base + 'index.html" class="ec-logo">' + BRAND + '</a>'
      +     '<nav class="ec-links">'
      +       '<a href="' + base + 'team.html"' + on('team') + '>Our Team</a>'
      +       '<div class="ec-has-sub">'
      +         '<a href="#">Portfolio ' + CHEVRON + '</a>'
      +         '<div class="ec-sub">'
      +           '<a href="' + base + 'investment-portfolio.html">Investment Portfolio</a>'
      +           '<a href="#">Development Portfolio</a>'
      +         '</div>'
      +       '</div>'
      +       '<a href="' + base + 'index.html"' + on('news') + '>News &amp; Insights</a>'
      +       '<a href="' + base + 'investor-portal.html"' + on('investor') + '>Investor Portal</a>'
      +       '<a href="' + base + 'community.html"' + on('community') + '>Community</a>'
      +       '<a href="' + base + 'media.html"' + on('media') + '>Media</a>'
      +       '<a href="' + base + 'index.html#contact" class="btn btn-solid ec-cta-m">Get in touch</a>'
      +     '</nav>'
      +     '<a href="' + base + 'index.html#contact" class="btn btn-solid ec-cta-d">Get in touch</a>'
      +     '<button class="ec-toggle" aria-label="Toggle menu" aria-expanded="false"><span></span><span></span><span></span></button>'
      +   '</div>'
      + '</header>';
  }

  function footerHTML(base){
    return ''
      + '<footer class="ec-footer">'
      +   '<div class="container">'
      +     '<div class="ec-footer-grid">'
      +       '<div class="ec-footer-brand">'
      +         '<div class="ec-flogo">EquitiFy Capital, LLC</div>'
      +         '<p>Capital for the corners America runs on — financing and acquisition for gas station and QSR real estate nationwide.</p>'
      +       '</div>'
      +       '<div><h4>Sitemap</h4><ul>'
      +         '<li><a href="' + base + 'index.html">Our Story</a></li>'
      +         '<li><a href="' + base + 'index.html#approach">Our Approach</a></li>'
      +         '<li><a href="' + base + 'team.html">Our Team</a></li>'
      +         '<li><a href="' + base + 'index.html">News &amp; Insights</a></li>'
      +         '<li><a href="' + base + 'index.html#contact">Get in Touch</a></li>'
      +       '</ul></div>'
      +       '<div><h4>Office</h4><ul>'
      +         '<li><span>555 Republic Dr, Suite #525</span></li>'
      +         '<li><span>Plano, TX 75074</span></li>'
      +         '<li><a href="mailto:info@equitifycap.net">info@equitifycap.net</a></li>'
      +       '</ul></div>'
      +       '<div><h4>Legal</h4><ul>'
      +         '<li><a href="' + base + 'disclaimer/">Legal Disclaimer</a></li>'
      +         '<li><a href="' + base + 'disclosures/">Disclosures</a></li>'
      +         '<li><a href="' + base + 'privacy/">Privacy Policy</a></li>'
      +       '</ul></div>'
      +     '</div>'
      +     '<div class="ec-footer-bottom">'
      +       '<p>&copy; 2026 EquitiFy Capital, LLC. All rights reserved.</p>'
      +       '<div class="ec-footer-legal">'
      +         '<a href="' + base + 'disclaimer/">Legal Disclaimer</a>'
      +         '<a href="' + base + 'disclosures/">Disclosures</a>'
      +         '<a href="' + base + 'privacy/">Privacy Policy</a>'
      +       '</div>'
      +     '</div>'
      +   '</div>'
      + '</footer>';
  }

  function wireNav(root){
    var header = root.querySelector(".ec-nav");
    var toggle = root.querySelector(".ec-toggle");
    var links = root.querySelector(".ec-links");
    if(!header || !toggle || !links) return;

    function setOpen(open){
      header.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    }
    toggle.addEventListener("click", function(){
      setOpen(!header.classList.contains("is-open"));
    });

    var isMobile = function(){ return window.matchMedia("(max-width:900px)").matches; };
    root.querySelectorAll(".ec-has-sub > a").forEach(function(a){
      a.addEventListener("click", function(e){
        if(isMobile()){
          e.preventDefault();
          e.stopPropagation();
          a.parentElement.classList.toggle("is-open");
        }
      });
    });

    links.addEventListener("click", function(e){
      if(e.target.closest(".ec-has-sub > a")) return;
      if(e.target.tagName === "A") setOpen(false);
    });
  }

  /* Overlay nav: transparent over the hero, solid white once scrolled. */
  function wireScroll(root){
    var header = root.querySelector(".ec-nav");
    if(!header) return;
    var THRESHOLD = 40;
    var ticking = false;
    function update(){
      var y = window.pageYOffset || document.documentElement.scrollTop || 0;
      header.classList.toggle("ec-scrolled", y > THRESHOLD);
      ticking = false;
    }
    window.addEventListener("scroll", function(){
      if(!ticking){ window.requestAnimationFrame(update); ticking = true; }
    }, {passive:true});
    update();
  }

  class SiteHeader extends HTMLElement{
    connectedCallback(){
      var overlay = this.hasAttribute("overlay");
      this.innerHTML = headerHTML(this.getAttribute("base") || "", this.getAttribute("active") || "", overlay);
      wireNav(this);
      if(overlay) wireScroll(this);
    }
  }
  class SiteFooter extends HTMLElement{
    connectedCallback(){
      this.innerHTML = footerHTML(this.getAttribute("base") || "");
    }
  }

  customElements.define("site-header", SiteHeader);
  customElements.define("site-footer", SiteFooter);
})();
