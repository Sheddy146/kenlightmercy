(function ($) {
  "use strict";
  if ($("body").not(".is-mobile").hasClass("tt-magic-cursor")) {
    if ($(window).width() > 1024) {
      $(".magnetic-item").wrap('<div class="magnetic-wrap"></div>');
      if ($("a.magnetic-item").length) {
        $("a.magnetic-item").addClass("not-hide-cursor");
      }
      var $mouse = { x: 0, y: 0 };
      var $pos = { x: 0, y: 0 };
      var $ratio = 0.15;
      var $active = !1;
      var $ball = $("#ball");
      var $ballWidth = 34;
      var $ballHeight = 34;
      var $ballScale = 1;
      var $ballOpacity = 0.5;
      var $ballBorderWidth = 2;
      gsap.set($ball, {
        xPercent: -50,
        yPercent: -50,
        width: $ballWidth,
        height: $ballHeight,
        borderWidth: $ballBorderWidth,
        opacity: $ballOpacity,
      });
      document.addEventListener("mousemove", mouseMove);
      function mouseMove(e) {
        $mouse.x = e.clientX;
        $mouse.y = e.clientY;
      }
      gsap.ticker.add(updatePosition);
      function updatePosition() {
        if (!$active) {
          $pos.x += ($mouse.x - $pos.x) * $ratio;
          $pos.y += ($mouse.y - $pos.y) * $ratio;
          gsap.set($ball, { x: $pos.x, y: $pos.y });
        }
      }
      $(".magnetic-wrap").on("mousemove", function (e) {
        parallaxCursor(e, this, 2);
        callParallax(e, this);
      });
      function callParallax(e, parent) {
        parallaxIt(e, parent, parent.querySelector(".magnetic-item"), 25);
      }
      function parallaxIt(e, parent, target, movement) {
        var boundingRect = parent.getBoundingClientRect();
        var relX = e.clientX - boundingRect.left;
        var relY = e.clientY - boundingRect.top;
        gsap.to(target, {
          duration: 0.3,
          x: ((relX - boundingRect.width / 2) / boundingRect.width) * movement,
          y:
            ((relY - boundingRect.height / 2) / boundingRect.height) * movement,
          ease: Power2.easeOut,
        });
      }
      function parallaxCursor(e, parent, movement) {
        var rect = parent.getBoundingClientRect();
        var relX = e.clientX - rect.left;
        var relY = e.clientY - rect.top;
        $pos.x =
          rect.left + rect.width / 2 + (relX - rect.width / 2) / movement;
        $pos.y =
          rect.top + rect.height / 2 + (relY - rect.height / 2) / movement;
        gsap.to($ball, { duration: 0.3, x: $pos.x, y: $pos.y });
      }
      $(".magnetic-wrap")
        .on("mouseenter", function (e) {
          gsap.to($ball, {
            duration: 0.3,
            scale: 2,
            borderWidth: 1,
            opacity: $ballOpacity,
          });
          $active = !0;
        })
        .on("mouseleave", function (e) {
          gsap.to($ball, {
            duration: 0.3,
            scale: $ballScale,
            borderWidth: $ballBorderWidth,
            opacity: $ballOpacity,
          });
          gsap.to(this.querySelector(".magnetic-item"), {
            duration: 0.3,
            x: 0,
            y: 0,
            clearProps: "all",
          });
          $active = !1;
        });
      $(
        ".cursor-alter, .tt-main-menu-list > li > a, .tt-main-menu-list > li > .tt-submenu-trigger > a"
      )
        .not(".magnetic-item")
        .on("mouseenter", function () {
          gsap.to($ball, {
            duration: 0.3,
            borderWidth: 0,
            opacity: 0.2,
            backgroundColor: "#CCC",
            width: "100px",
            height: "100px",
          });
        })
        .on("mouseleave", function () {
          gsap.to($ball, {
            duration: 0.3,
            borderWidth: $ballBorderWidth,
            opacity: $ballOpacity,
            backgroundColor: "transparent",
            width: $ballWidth,
            height: $ballHeight,
            clearProps: "backgroundColor",
          });
        });
      $(".tt-ol-submenu-caret-wrap .magnetic-wrap")
        .on("mouseenter", function () {
          gsap.to($ball, {
            duration: 0.3,
            scale: 1.3,
            borderWidth: $ballBorderWidth,
          });
        })
        .on("mouseleave", function () {
          gsap.to($ball, { duration: 0.3, scale: $ballScale });
        });
      $("[data-cursor]").each(function () {
        $(this)
          .on("mouseenter", function () {
            $ball.append('<div class="ball-view"></div>');
            $(".ball-view").append($(this).attr("data-cursor"));
            gsap.to(ball, {
              duration: 0.3,
              yPercent: -75,
              width: 95,
              height: 95,
              opacity: 1,
              borderWidth: 0,
              backgroundColor: "#FFF",
            });
            gsap.to(".ball-view", { duration: 0.3, scale: 1, autoAlpha: 1 });
          })
          .on("mouseleave", function () {
            gsap.to(ball, {
              duration: 0.3,
              yPercent: -50,
              width: $ballWidth,
              height: $ballHeight,
              opacity: $ballOpacity,
              borderWidth: $ballBorderWidth,
              backgroundColor: "transparent",
            });
            gsap.to(".ball-view", {
              duration: 0.3,
              scale: 0,
              autoAlpha: 0,
              clearProps: "all",
            });
            $ball.find(".ball-view").remove();
          });
        $(this).addClass("not-hide-cursor");
      });
      $(".swiper-container").each(function () {
        if ($(this).parent().attr("data-simulate-touch") == "true") {
          if ($(this).parent().hasClass("cursor-drag")) {
            $(this)
              .on("mouseenter", function () {
                $ball.append('<div class="ball-drag"></div>');
                gsap.to($ball, {
                  duration: 0.3,
                  width: 60,
                  height: 60,
                  opacity: 1,
                });
              })
              .on("mouseleave", function () {
                $ball.find(".ball-drag").remove();
                gsap.to($ball, {
                  duration: 0.3,
                  width: $ballWidth,
                  height: $ballHeight,
                  opacity: $ballOpacity,
                });
              });
            $(this).addClass("not-hide-cursor");
            $(this)
              .find("[data-cursor]")
              .on("mouseenter mouseover", function () {
                $ball.find(".ball-drag").remove();
                return !1;
              })
              .on("mouseleave", function () {
                $ball.append('<div class="ball-drag"></div>');
                gsap.to($ball, {
                  duration: 0.3,
                  width: 60,
                  height: 60,
                  opacity: 1,
                });
              });
          }
        }
      });
      $(".swiper-container").each(function () {
        if ($(this).parent().attr("data-simulate-touch") == "true") {
          if ($(this).parent().hasClass("cursor-drag-mouse-down")) {
            $(this)
              .on("mousedown pointerdown", function (e) {
                if (e.which === 1) {
                  gsap.to($ball, {
                    duration: 0.2,
                    width: 60,
                    height: 60,
                    opacity: 1,
                  });
                  $ball.append('<div class="ball-drag"></div>');
                }
              })
              .on("mouseup pointerup", function () {
                $ball.find(".ball-drag").remove();
                if ($(this).find("[data-cursor]:hover").length) {
                } else {
                  gsap.to($ball, {
                    duration: 0.2,
                    width: $ballWidth,
                    height: $ballHeight,
                    opacity: $ballOpacity,
                  });
                }
              })
              .on("mouseleave", function () {
                $ball.find(".ball-drag").remove();
                gsap.to($ball, {
                  duration: 0.2,
                  width: $ballWidth,
                  height: $ballHeight,
                  opacity: $ballOpacity,
                });
              });
            $(this)
              .find("[data-cursor]")
              .on("mousedown pointerdown", function () {
                return !1;
              });
            $(this)
              .find("[data-cursor]")
              .on("mouseenter mouseover", function () {
                $ball.find(".ball-drag").remove();
                return !1;
              });
          }
        }
      });
      $(".cursor-close").each(function () {
        $(this).addClass("ball-close-enabled");
        $(this)
          .on("mouseenter", function () {
            $ball.addClass("ball-close-enabled");
            $ball.append('<div class="ball-close">Close</div>');
            gsap.to($ball, {
              duration: 0.3,
              yPercent: -75,
              width: 80,
              height: 80,
              opacity: 1,
            });
            gsap.from(".ball-close", { duration: 0.3, scale: 0, autoAlpha: 0 });
          })
          .on("mouseleave click", function () {
            $ball.removeClass("ball-close-enabled");
            gsap.to($ball, {
              duration: 0.3,
              yPercent: -50,
              width: $ballWidth,
              height: $ballHeight,
              opacity: $ballOpacity,
            });
            $ball.find(".ball-close").remove();
          });
        $(
          ".cursor-close a, .cursor-close button, .cursor-close .tt-btn, .cursor-close .hide-cursor"
        )
          .not(".not-hide-cursor")
          .on("mouseenter", function () {
            $ball.removeClass("ball-close-enabled");
          })
          .on("mouseleave", function () {
            $ball.addClass("ball-close-enabled");
          });
      });
      $(".portfolio-interactive-item").each(function () {
        var $piItem = $(this);
        if ($(this).find(".pi-item-image").length) {
          $piItem
            .find(".pi-item-title-link")
            .on("mouseenter mouseover", function () {
              $("#magic-cursor").addClass("portfolio-interactive-hover-on");
              $piItem.find(".pi-item-image").appendTo($ball);
              gsap.to($ball, {
                duration: 0.3,
                width: "20vw",
                height: "20vw",
                opacity: 1,
              });
              $ball.find(".pi-item-image video").each(function () {
                $(this).get(0).play();
              });
            })
            .on("mouseleave", function () {
              $("#magic-cursor").removeClass("portfolio-interactive-hover-on");
              $ball.find(".pi-item-image").appendTo($piItem);
              gsap.to($ball, {
                duration: 0.3,
                width: $ballWidth,
                height: $ballHeight,
                opacity: $ballOpacity,
              });
              $piItem.find(".pi-item-image video").each(function () {
                $(this).get(0).pause();
              });
            });
          $(this).find(".pi-item-title-link").addClass("not-hide-cursor");
        }
      });
      $(".blog-interactive-item").each(function () {
        var $biItem = $(this);
        if ($biItem.find(".bi-item-image").length) {
          $biItem
            .find(".bi-item-title a")
            .on("mouseenter mouseover", function () {
              $("#magic-cursor").addClass("blog-interactive-hover-on");
              $biItem.find(".bi-item-image").appendTo($ball);
              gsap.to($ball, {
                duration: 0.3,
                width: "20vw",
                height: "20vw",
                opacity: 1,
              });
            })
            .on("mouseleave", function () {
              $("#magic-cursor").removeClass("blog-interactive-hover-on");
              $ball.find(".bi-item-image").appendTo($biItem);
              gsap.to($ball, {
                duration: 0.3,
                width: $ballWidth,
                height: $ballHeight,
                opacity: $ballOpacity,
              });
            });
          $biItem.find(".bi-item-title a").addClass("not-hide-cursor");
          $biItem.addClass("bi-item-image-on");
        }
      });
      $(".tt-page-nav").each(function () {
        if ($(this).find(".tt-pn-image").length) {
          $(this)
            .find(".tt-pn-link")
            .on("mouseenter mouseover", function () {
              $("#magic-cursor").addClass("tt-pn-hover-on");
              $(this).parent().find(".tt-pn-image").appendTo($ball);
              gsap.to($ball, {
                duration: 0.3,
                width: "20vw",
                height: "20vw",
                opacity: 1,
              });
              $ball.find(".tt-pn-image video").each(function () {
                $(this).get(0).play();
              });
            })
            .on("mouseleave", function () {
              $("#magic-cursor").removeClass("tt-pn-hover-on");
              $ball.find(".tt-pn-image").appendTo(this);
              gsap.to($ball, {
                duration: 0.3,
                width: $ballWidth,
                height: $ballHeight,
                opacity: $ballOpacity,
              });
              $(this)
                .parent()
                .find(".tt-pn-image video")
                .each(function () {
                  $(this).get(0).pause();
                });
            });
          $(this).find(".tt-pn-link").addClass("not-hide-cursor");
        } else {
          $(this).find(".tt-pn-link").removeClass("not-hide-cursor");
        }
      });
      if ($(".tt-pn-image").length) {
        $(".tt-page-nav").each(function () {
          $(this)
            .find(".tt-pn-link")
            .on("mouseenter mouseover", function () {
              $("#magic-cursor").addClass("tt-page-nav-hover-on");
              $(this).parent().find(".tt-pn-image").appendTo($ball);
              gsap.to($ball, {
                duration: 0.3,
                width: "20vw",
                height: "20vw",
                opacity: 1,
              });
              if ($(".tt-pn-image video").length) {
                $(".tt-pn-image video").get(0).play();
              }
            })
            .on("mouseleave", function () {
              $("#magic-cursor").removeClass("tt-page-nav-hover-on");
              $ball.find(".tt-pn-image").appendTo(this);
              gsap.to($ball, {
                duration: 0.3,
                width: $ballWidth,
                height: $ballHeight,
                opacity: $ballOpacity,
              });
              if ($(".tt-pn-image video").length) {
                $(".tt-pn-image video").get(0).pause();
              }
            });
        });
        $(".tt-pn-link").addClass("not-hide-cursor");
      } else {
        $(".tt-pn-link").removeClass("not-hide-cursor");
      }
      $(
        "a, button, .tt-btn, .tt-form-control, .tt-form-radio, .tt-form-check, .hide-cursor"
      )
        .not(".not-hide-cursor")
        .not(".cursor-alter")
        .not(".tt-main-menu-list > li > a")
        .not(".tt-main-menu-list > li > .tt-submenu-trigger > a")
        .on("mouseenter", function () {
          gsap.to($ball, { duration: 0.3, scale: 0, opacity: 0 });
        })
        .on("mouseleave", function () {
          gsap.to($ball, {
            duration: 0.3,
            scale: $ballScale,
            opacity: $ballOpacity,
          });
        });
      $("a")
        .not('[target="_blank"]')
        .not('[href^="#"]')
        .not('[href^="mailto"]')
        .not('[href^="tel"]')
        .not(".lg-trigger")
        .on("click", function () {
          gsap.to($ball, { duration: 0.3, scale: 1.3, autoAlpha: 0 });
        });
      $(document)
        .on("mouseleave", function () {
          gsap.to("#magic-cursor", { duration: 0.3, autoAlpha: 0 });
        })
        .on("mouseenter", function () {
          gsap.to("#magic-cursor", { duration: 0.3, autoAlpha: 1 });
        });
      $(document).on("mousemove", function (e) {
        gsap.to("#magic-cursor", { duration: 0.3, autoAlpha: 1 });
      });
    }
  }
})(jQuery);
