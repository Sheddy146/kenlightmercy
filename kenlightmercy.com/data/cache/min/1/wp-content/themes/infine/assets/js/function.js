(function ($) {
  "use strict";
  var $window = $(window);
  var $body = $("body");
  var defaults = {
      label: "MENU",
      duplicate: !0,
      duration: 200,
      easingOpen: "swing",
      easingClose: "swing",
      closedSymbol: "&#9658;",
      openedSymbol: "&#9660;",
      prependTo: "body",
      appendTo: "",
      parentTag: "a",
      closeOnClick: !1,
      allowParentLinks: !1,
      nestedParentLinks: !0,
      showChildren: !1,
      removeIds: !0,
      removeClasses: !1,
      removeStyles: !1,
      brand: "",
      animations: "jquery",
      init: function () {},
      beforeOpen: function () {},
      beforeClose: function () {},
      afterOpen: function () {},
      afterClose: function () {},
    },
    mobileMenu = "slicknav",
    prefix = "slicknav",
    Keyboard = {
      DOWN: 40,
      ENTER: 13,
      ESCAPE: 27,
      LEFT: 37,
      RIGHT: 39,
      SPACE: 32,
      TAB: 9,
      UP: 38,
    };
  function Plugin(element, options) {
    this.element = element;
    this.settings = $.extend({}, defaults, options);
    if (!this.settings.duplicate && !options.hasOwnProperty("removeIds")) {
      this.settings.removeIds = !1;
    }
    this._defaults = defaults;
    this._name = mobileMenu;
    this.init();
  }
  Plugin.prototype.init = function () {
    var $this = this,
      menu = $(this.element),
      settings = this.settings,
      iconClass,
      menuBar;
    if (settings.duplicate) {
      $this.mobileNav = menu.clone();
    } else {
      $this.mobileNav = menu;
    }
    if (settings.removeIds) {
      $this.mobileNav.removeAttr("id");
      $this.mobileNav.find("*").each(function (i, e) {
        $(e).removeAttr("id");
      });
    }
    if (settings.removeClasses) {
      $this.mobileNav.removeAttr("class");
      $this.mobileNav.find("*").each(function (i, e) {
        $(e).removeAttr("class");
      });
    }
    if (settings.removeStyles) {
      $this.mobileNav.removeAttr("style");
      $this.mobileNav.find("*").each(function (i, e) {
        $(e).removeAttr("style");
      });
    }
    iconClass = prefix + "_icon";
    if (settings.label === "") {
      iconClass += " " + prefix + "_no-text";
    }
    if (settings.parentTag == "a") {
      settings.parentTag = 'a href="#"';
    }
    $this.mobileNav.attr("class", prefix + "_nav");
    menuBar = $('<div class="' + prefix + '_menu"></div>');
    if (settings.brand !== "") {
      var brand = $(
        '<div class="' + prefix + '_brand">' + settings.brand + "</div>"
      );
      $(menuBar).append(brand);
    }
    $this.btn = $(
      [
        "<" +
          settings.parentTag +
          ' aria-haspopup="true" role="button" tabindex="0" class="' +
          prefix +
          "_btn " +
          prefix +
          '_collapsed">',
        '<span class="' + prefix + '_menutxt">' + settings.label + "</span>",
        '<span class="' + iconClass + '">',
        '<span class="' + prefix + '_icon-bar"></span>',
        '<span class="' + prefix + '_icon-bar"></span>',
        '<span class="' + prefix + '_icon-bar"></span>',
        "</span>",
        "</" + settings.parentTag + ">",
      ].join("")
    );
    $(".navbar-toggle").append($this.btn);
    if (settings.appendTo !== "") {
      $(settings.appendTo).append(menuBar);
    } else {
      $(settings.prependTo).prepend(menuBar);
    }
    menuBar.append($this.mobileNav);
    var items = $this.mobileNav.find("li");
    $(items).each(function () {
      var item = $(this),
        data = {};
      data.children = item.children("ul").attr("role", "menu");
      item.data("menu", data);
      if (data.children.length > 0) {
        var a = item.contents(),
          containsAnchor = !1,
          nodes = [];
        $(a).each(function () {
          if (!$(this).is("ul")) {
            nodes.push(this);
          } else {
            return !1;
          }
          if ($(this).is("a")) {
            containsAnchor = !0;
          }
        });
        var wrapElement = $(
          "<" +
            settings.parentTag +
            ' role="menuitem" aria-haspopup="true" tabindex="-1" class="' +
            prefix +
            '_item"/>'
        );
        if (
          !settings.allowParentLinks ||
          settings.nestedParentLinks ||
          !containsAnchor
        ) {
          var $wrap = $(nodes).wrapAll(wrapElement).parent();
          $wrap.addClass(prefix + "_row");
        } else
          $(nodes)
            .wrapAll(
              '<span class="' + prefix + "_parent-link " + prefix + '_row"/>'
            )
            .parent();
        if (!settings.showChildren) {
          item.addClass(prefix + "_collapsed");
        } else {
          item.addClass(prefix + "_open");
        }
        item.addClass(prefix + "_parent");
        var arrowElement = $(
          '<span class="' +
            prefix +
            '_arrow">' +
            (settings.showChildren
              ? settings.openedSymbol
              : settings.closedSymbol) +
            "</span>"
        );
        if (
          settings.allowParentLinks &&
          !settings.nestedParentLinks &&
          containsAnchor
        )
          arrowElement = arrowElement.wrap(wrapElement).parent();
        $(nodes).last().after(arrowElement);
      } else if (item.children().length === 0) {
        item.addClass(prefix + "_txtnode");
      }
      item
        .children("a")
        .attr("role", "menuitem")
        .on("click", function (event) {
          if (
            settings.closeOnClick &&
            !$(event.target)
              .parent()
              .closest("li")
              .hasClass(prefix + "_parent")
          ) {
            $($this.btn).trigger("click");
          }
        });
      if (settings.closeOnClick && settings.allowParentLinks) {
        item
          .children("a")
          .children("a")
          .on("click", function (event) {
            $($this.btn).trigger("click");
          });
        item
          .find("." + prefix + "_parent-link a:not(." + prefix + "_item)")
          .on("click", function (event) {
            $($this.btn).trigger("click");
          });
      }
    });
    $(items).each(function () {
      var data = $(this).data("menu");
      if (!settings.showChildren) {
        $this._visibilityToggle(data.children, null, !1, null, !0);
      }
    });
    $this._visibilityToggle($this.mobileNav, null, !1, "init", !0);
    $this.mobileNav.attr("role", "menu");
    $(document).on("mousedown", function () {
      $this._outlines(!1);
    });
    $(document).on("keyup", function () {
      $this._outlines(!0);
    });
    $($this.btn).on("click", function (e) {
      e.preventDefault();
      $this._menuToggle();
    });
    $this.mobileNav.on("click", "." + prefix + "_item", function (e) {
      e.preventDefault();
      $this._itemClick($(this));
    });
    $($this.btn).on("keydown", function (e) {
      var ev = e || event;
      switch (ev.keyCode) {
        case Keyboard.ENTER:
        case Keyboard.SPACE:
        case Keyboard.DOWN:
          e.preventDefault();
          if (
            ev.keyCode !== Keyboard.DOWN ||
            !$($this.btn).hasClass(prefix + "_open")
          ) {
            $this._menuToggle();
          }
          $($this.btn)
            .next()
            .find('[role="menuitem"]')
            .first()
            .trigger("focus");
          break;
      }
    });
    $this.mobileNav.on("keydown", "." + prefix + "_item", function (e) {
      var ev = e || event;
      switch (ev.keyCode) {
        case Keyboard.ENTER:
          e.preventDefault();
          $this._itemClick($(e.target));
          break;
        case Keyboard.RIGHT:
          e.preventDefault();
          if (
            $(e.target)
              .parent()
              .hasClass(prefix + "_collapsed")
          ) {
            $this._itemClick($(e.target));
          }
          $(e.target).next().find('[role="menuitem"]').first().trigger("focus");
          break;
      }
    });
    $this.mobileNav.on("keydown", '[role="menuitem"]', function (e) {
      var ev = e || event;
      switch (ev.keyCode) {
        case Keyboard.DOWN:
          e.preventDefault();
          var allItems = $(e.target)
            .parent()
            .parent()
            .children()
            .children('[role="menuitem"]:visible');
          var idx = allItems.index(e.target);
          var nextIdx = idx + 1;
          if (allItems.length <= nextIdx) {
            nextIdx = 0;
          }
          var next = allItems.eq(nextIdx);
          next.trigger("focus");
          break;
        case Keyboard.UP:
          e.preventDefault();
          var allItems = $(e.target)
            .parent()
            .parent()
            .children()
            .children('[role="menuitem"]:visible');
          var idx = allItems.index(e.target);
          var next = allItems.eq(idx - 1);
          next.trigger("focus");
          break;
        case Keyboard.LEFT:
          e.preventDefault();
          if (
            $(e.target)
              .parent()
              .parent()
              .parent()
              .hasClass(prefix + "_open")
          ) {
            var parent = $(e.target).parent().parent().prev();
            parent.trigger("focus");
            $this._itemClick(parent);
          } else if (
            $(e.target)
              .parent()
              .parent()
              .hasClass(prefix + "_nav")
          ) {
            $this._menuToggle();
            $($this.btn).trigger("focus");
          }
          break;
        case Keyboard.ESCAPE:
          e.preventDefault();
          $this._menuToggle();
          $($this.btn).trigger("focus");
          break;
      }
    });
    if (settings.allowParentLinks && settings.nestedParentLinks) {
      $("." + prefix + "_item a").on("click", function (e) {
        e.stopImmediatePropagation();
      });
    }
  };
  Plugin.prototype._menuToggle = function (el) {
    var $this = this;
    var btn = $this.btn;
    var mobileNav = $this.mobileNav;
    if (btn.hasClass(prefix + "_collapsed")) {
      btn.removeClass(prefix + "_collapsed");
      btn.addClass(prefix + "_open");
    } else {
      btn.removeClass(prefix + "_open");
      btn.addClass(prefix + "_collapsed");
    }
    btn.addClass(prefix + "_animating");
    $this._visibilityToggle(mobileNav, btn.parent(), !0, btn);
  };
  Plugin.prototype._itemClick = function (el) {
    var $this = this;
    var settings = $this.settings;
    var data = el.data("menu");
    if (!data) {
      data = {};
      data.arrow = el.children("." + prefix + "_arrow");
      data.ul = el.next("ul");
      data.parent = el.parent();
      if (data.parent.hasClass(prefix + "_parent-link")) {
        data.parent = el.parent().parent();
        data.ul = el.parent().next("ul");
      }
      el.data("menu", data);
    }
    if (data.parent.hasClass(prefix + "_collapsed")) {
      data.arrow.html(settings.openedSymbol);
      data.parent.removeClass(prefix + "_collapsed");
      data.parent.addClass(prefix + "_open");
      data.parent.addClass(prefix + "_animating");
      $this._visibilityToggle(data.ul, data.parent, !0, el);
    } else {
      data.arrow.html(settings.closedSymbol);
      data.parent.addClass(prefix + "_collapsed");
      data.parent.removeClass(prefix + "_open");
      data.parent.addClass(prefix + "_animating");
      $this._visibilityToggle(data.ul, data.parent, !0, el);
    }
  };
  Plugin.prototype._visibilityToggle = function (
    el,
    parent,
    animate,
    trigger,
    init
  ) {
    var $this = this;
    var settings = $this.settings;
    var items = $this._getActionItems(el);
    var duration = 0;
    if (animate) {
      duration = settings.duration;
    }
    function afterOpen(trigger, parent) {
      $(trigger).removeClass(prefix + "_animating");
      $(parent).removeClass(prefix + "_animating");
      if (!init) {
        settings.afterOpen(trigger);
      }
    }
    function afterClose(trigger, parent) {
      el.attr("aria-hidden", "true");
      items.attr("tabindex", "-1");
      $this._setVisAttr(el, !0);
      el.hide();
      $(trigger).removeClass(prefix + "_animating");
      $(parent).removeClass(prefix + "_animating");
      if (!init) {
        settings.afterClose(trigger);
      } else if (trigger == "init") {
        settings.init();
      }
    }
    if (el.hasClass(prefix + "_hidden")) {
      el.removeClass(prefix + "_hidden");
      if (!init) {
        settings.beforeOpen(trigger);
      }
      if (settings.animations === "jquery") {
        el.stop(!0, !0).slideDown(duration, settings.easingOpen, function () {
          afterOpen(trigger, parent);
        });
      } else if (settings.animations === "velocity") {
        el.velocity("finish").velocity("slideDown", {
          duration: duration,
          easing: settings.easingOpen,
          complete: function () {
            afterOpen(trigger, parent);
          },
        });
      }
      el.attr("aria-hidden", "false");
      items.attr("tabindex", "0");
      $this._setVisAttr(el, !1);
    } else {
      el.addClass(prefix + "_hidden");
      if (!init) {
        settings.beforeClose(trigger);
      }
      if (settings.animations === "jquery") {
        el.stop(!0, !0).slideUp(
          duration,
          this.settings.easingClose,
          function () {
            afterClose(trigger, parent);
          }
        );
      } else if (settings.animations === "velocity") {
        el.velocity("finish").velocity("slideUp", {
          duration: duration,
          easing: settings.easingClose,
          complete: function () {
            afterClose(trigger, parent);
          },
        });
      }
    }
  };
  Plugin.prototype._setVisAttr = function (el, hidden) {
    var $this = this;
    var nonHidden = el
      .children("li")
      .children("ul")
      .not("." + prefix + "_hidden");
    if (!hidden) {
      nonHidden.each(function () {
        var ul = $(this);
        ul.attr("aria-hidden", "false");
        var items = $this._getActionItems(ul);
        items.attr("tabindex", "0");
        $this._setVisAttr(ul, hidden);
      });
    } else {
      nonHidden.each(function () {
        var ul = $(this);
        ul.attr("aria-hidden", "true");
        var items = $this._getActionItems(ul);
        items.attr("tabindex", "-1");
        $this._setVisAttr(ul, hidden);
      });
    }
  };
  Plugin.prototype._getActionItems = function (el) {
    var data = el.data("menu");
    if (!data) {
      data = {};
      var items = el.children("li");
      var anchors = items.find("a");
      data.links = anchors.add(items.find("." + prefix + "_item"));
      el.data("menu", data);
    }
    return data.links;
  };
  Plugin.prototype._outlines = function (state) {
    if (!state) {
      $("." + prefix + "_item, ." + prefix + "_btn").css("outline", "none");
    } else {
      $("." + prefix + "_item, ." + prefix + "_btn").css("outline", "");
    }
  };
  Plugin.prototype.toggle = function () {
    var $this = this;
    $this._menuToggle();
  };
  Plugin.prototype.open = function () {
    var $this = this;
    if ($this.btn.hasClass(prefix + "_collapsed")) {
      $this._menuToggle();
    }
  };
  Plugin.prototype.close = function () {
    var $this = this;
    if ($this.btn.hasClass(prefix + "_open")) {
      $this._menuToggle();
    }
  };
  $.fn[mobileMenu] = function (options) {
    var args = arguments;
    if (options === undefined || typeof options === "object") {
      return this.each(function () {
        if (!$.data(this, "plugin_" + mobileMenu)) {
          $.data(this, "plugin_" + mobileMenu, new Plugin(this, options));
        }
      });
    } else if (
      typeof options === "string" &&
      options[0] !== "_" &&
      options !== "init"
    ) {
      var returns;
      this.each(function () {
        var instance = $.data(this, "plugin_" + mobileMenu);
        if (
          instance instanceof Plugin &&
          typeof instance[options] === "function"
        ) {
          returns = instance[options].apply(
            instance,
            Array.prototype.slice.call(args, 1)
          );
        }
      });
      return returns !== undefined ? returns : this;
    }
  };
  $window.on("load", function () {
    $(".preloader").fadeOut(600);
  });
  if ($(".main-menu").length) {
    $(".main-menu").slicknav({ label: "", prependTo: ".responsive-menu" });
  }
  if ($(".at-animation-image-style-1").length) {
    gsap.registerPlugin(ScrollTrigger);
    let revealContainers = document.querySelectorAll(
      ".at-animation-image-style-1"
    );
    revealContainers.forEach((container) => {
      let image = container.querySelector("img");
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          toggleActions: "play none none none",
        },
      });
      tl.set(container, { autoAlpha: 1 });
      tl.from(container, 1, { xPercent: -100, ease: Power2.out });
      tl.from(image, 1, {
        xPercent: 100,
        scale: 1,
        delay: -1,
        ease: Power2.out,
      });
    });
  }
  if (
    $(
      ".at-animation-heading-style-1 .elementor-heading-title, .at-animation-heading-style-1 .ekit-heading--title"
    ).length
  ) {
    let staggerAmount = 0.05,
      translateXValue = 0,
      delayValue = 0.5,
      animatedTextElements = document.querySelectorAll(
        ".at-animation-heading-style-1 .elementor-heading-title, .at-animation-heading-style-1 .ekit-heading--title"
      );
    animatedTextElements.forEach((element) => {
      let animationSplitText = new SplitText(element, { type: "chars, words" });
      gsap.from(animationSplitText.words, {
        duration: 1,
        delay: delayValue,
        x: 20,
        autoAlpha: 0,
        stagger: staggerAmount,
        scrollTrigger: { trigger: element, start: "top 85%" },
      });
    });
  }
  if (
    $(
      ".at-animation-heading-style-2 .elementor-heading-title, .at-animation-heading-style-2 .ekit-heading--title"
    ).length
  ) {
    let staggerAmount = 0.05,
      translateXValue = 20,
      delayValue = 0.5,
      easeType = "power2.out",
      animatedTextElements = document.querySelectorAll(
        ".at-animation-heading-style-2 .elementor-heading-title, .at-animation-heading-style-2 .ekit-heading--title"
      );
    animatedTextElements.forEach((element) => {
      let animationSplitText = new SplitText(element, { type: "chars, words" });
      gsap.from(animationSplitText.chars, {
        duration: 1,
        delay: delayValue,
        x: translateXValue,
        autoAlpha: 0,
        stagger: staggerAmount,
        ease: easeType,
        scrollTrigger: { trigger: element, start: "top 85%" },
      });
    });
  }
  if (
    $(
      ".at-animation-heading-style-3 .elementor-heading-title, .at-animation-heading-style-3 .ekit-heading--title"
    ).length
  ) {
    let animatedTextElements = document.querySelectorAll(
      ".at-animation-heading-style-3 .elementor-heading-title, .at-animation-heading-style-3 .ekit-heading--title"
    );
    animatedTextElements.forEach((element) => {
      if (element.animation) {
        element.animation.progress(1).kill();
        element.split.revert();
      }
      element.split = new SplitText(element, {
        type: "lines,words,chars",
        linesClass: "split-line",
      });
      gsap.set(element, { perspective: 400 });
      gsap.set(element.split.chars, { opacity: 0, x: "50" });
      element.animation = gsap.to(element.split.chars, {
        scrollTrigger: { trigger: element, start: "top 90%" },
        x: "0",
        y: "0",
        rotateX: "0",
        opacity: 1,
        duration: 1,
        ease: Back.easeOut,
        stagger: 0.02,
      });
    });
  }
})(jQuery);
