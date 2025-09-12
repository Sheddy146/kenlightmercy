(function ($) {
  $.fn.evo_cal_functions = function (O) {
    el = this;
    switch (O.return) {
      case "load_shortcodes":
        return el.find(".evo_cal_data").data("sc");
        break;
      case "update_shortcodes":
        el.find(".evo_cal_data").data("sc", O.SC);
        break;
    }
  };
  $.fn.evo_get_global = function (opt) {
    var defaults = { S1: "", S2: "" };
    var OPT = $.extend({}, defaults, opt);
    var BUS = $("#evo_global_data").data("d");
    if (!(OPT.S1 in BUS)) return !1;
    if (!(OPT.S2 in BUS[OPT.S1])) return !1;
    return BUS[OPT.S1][OPT.S2];
  };
  $.fn.evo_get_txt = function (opt) {
    var defaults = { V: "" };
    var OPT = $.extend({}, defaults, opt);
    var BUS = $("#evo_global_data").data("d");
    if (!("txt" in BUS)) return !1;
    if (!(OPT.V in BUS.txt)) return !1;
    return BUS.txt[OPT.V];
  };
  $.fn.evo_get_cal_def = function (opt) {
    var defaults = { V: "" };
    var OPT = $.extend({}, defaults, opt);
    var BUS = $("#evo_global_data").data("d");
    if (!("cal_def" in BUS)) return !1;
    if (!(OPT.V in BUS.cal_def)) return !1;
    return BUS.cal_def[OPT.V];
  };
  $.fn.evo_get_dms_vals = function (opt) {
    var defaults = { type: "d", V: "" };
    var OPT = $.extend({}, defaults, opt);
    var BUS = $("#evo_global_data").data("d");
    if (!("dms" in BUS)) return !1;
    if (!(OPT.type in BUS.dms)) return !1;
    return BUS.dms[OPT.type][OPT.V];
  };
  $.fn.evo_admin_get_ajax = function (opt) {
    var el = this,
      OO = this.evo_process_ajax_params(opt),
      LB = OO.lbdata.class
        ? $("body").find(".evo_lightbox." + OO.lbdata.class)
        : !1,
      ajax_url = el.evo_get_ajax_url({
        a: OO.adata.a,
        e: OO.adata.end,
        type: OO.adata.ajax_type,
      });
    $.ajax({
      beforeSend: function () {
        if (opt.onBefore) opt.onBefore.call(el, OO, LB);
        el.evo_perform_ajax_run_loader(OO, LB, "start");
      },
      type: "POST",
      url: ajax_url,
      data: OO.adata.data,
      dataType: "json",
      success: function (data) {
        if (opt.onSuccess || opt.success) {
          (opt.onSuccess || opt.success).call(el, data, OO, LB);
        } else {
          el.evo_perform_ajax_success(OO, data, LB);
          if (opt.successExtra) opt.successExtra.call(el, OO, data, LB);
        }
      },
      complete: function () {
        if (opt.onComplete) opt.onComplete.call(el, OO, data, LB);
        el.evo_perform_ajax_run_loader(OO, LB, "end");
      },
    });
  };
  $.fn.evo_ajax_lightbox_form_submit = function (opt, formObj) {
    const el = this;
    var OO = this.evo_process_ajax_params(opt);
    console.log(OO);
    var _lbdata = OO.lbdata;
    var _adata = OO.adata;
    var _populate_id = OO._populate_id;
    var form = this.closest("form");
    if (formObj !== undefined) form = formObj;
    if (el.hasClass("validate")) {
      var hasError = !1;
      $("body").trigger("evo_elm_form_presubmit_validation", [
        form,
        function (isValid) {
          hasError = isValid ? false : !0;
        },
      ]);
      if (hasError) {
        LB = el.closest(".evo_lightbox");
        LB.evo_lightbox_show_msg({ message: "Required fields missing" });
        return;
      }
    }
    var LB = !1;
    if (_lbdata.class != "")
      LB = $("body").find(".evo_lightbox." + _lbdata.class);
    if (LB) LB.evo_lightbox_hide_msg();
    var ajax_url = el.evo_get_ajax_url({
      a: _adata.a,
      e: _adata.end,
      type: _adata.ajax_type,
    });
    var extra_ajax_data = "data" in _adata ? _adata.data : null;
    form.ajaxSubmit({
      beforeSubmit: function (opt, xhr) {
        el.evo_perform_ajax_run_loader(OO, LB, "start");
      },
      dataType: "json",
      url: ajax_url,
      type: "POST",
      data: extra_ajax_data,
      success: function (data) {
        el.evo_perform_ajax_success(OO, data, LB);
      },
      complete: function () {
        el.evo_perform_ajax_run_loader(OO, LB, "end");
      },
    });
  };
  $.fn.evo_perform_ajax_run_loader = function (OO, LB, type) {
    var el = this;
    var _lbdata = OO.lbdata;
    var _adata = OO.adata;
    var customer_loader_elm = !1;
    var loader_btn_el = !1;
    if (_adata.loader_el != "") customer_loader_elm = _adata.loader_el;
    if ("loader_class" in _adata && _adata.loader_class != "")
      customer_loader_elm = $("." + _adata.loader_class);
    if (_adata.loader_btn_el != "" && _adata.loader_btn_el !== undefined)
      loader_btn_el = el;
    var LB_loader = !1;
    if (LB && "loader" in _lbdata && _lbdata.loader) LB_loader = !0;
    if (type == "start") {
      var trigger_id = "uid" in OO && OO.uid != "" ? OO.uid : OO.ajax_action;
      $("body").trigger("evo_ajax_beforesend_" + trigger_id, [OO, el]);
      if (LB_loader) {
        LB.find(".ajde_popup_text").addClass("evoloading loading");
        LB.evo_lightbox_start_inloading();
      }
      if (customer_loader_elm)
        $(customer_loader_elm).addClass("evoloading loading");
      if (loader_btn_el) el.addClass("evobtn_loader");
    } else {
      var trigger_id = "uid" in OO && OO.uid != "" ? OO.uid : OO.ajax_action;
      $("body").trigger("evo_ajax_complete_" + trigger_id, [OO, el]);
      if (LB_loader) {
        LB.find(".ajde_popup_text").removeClass("evoloading loading");
        LB.evo_lightbox_stop_inloading();
      }
      if (customer_loader_elm)
        $(customer_loader_elm).removeClass("evoloading loading");
      if (loader_btn_el) el.removeClass("evobtn_loader");
    }
    return { l1: customer_loader_elm, l2: LB_loader };
  };
  $.fn.evo_perform_ajax_success = function (OO, data, LB) {
    var el = this;
    var _lbdata = OO.lbdata;
    var _adata = OO.adata;
    var _populate_id = OO._populate_id;
    if (!data || data === undefined) return;
    var _success = "success" in data ? data.success : data.status === "good";
    var extractedContent = "content" in data ? data.content : "";
    if ("data" in data && "content" in data.data)
      extractedContent = data.data.content;
    var extractedData = "data" in data ? data.data : data;
    extractedData.content = extractedContent;
    if (typeof extractedData !== "object" || extractedData === null) {
      extractedData = { msg: extractedData };
    }
    extractedData.success = _success;
    extractedData.status =
      "status" in extractedData
        ? extractedData.status
        : _success
        ? "good"
        : "bad";
    data = extractedData;
    if (LB.length > 0) {
      if (
        data &&
        typeof data === "object" &&
        !Array.isArray(data) &&
        "msg" in data &&
        data.msg !== ""
      ) {
        LB.evo_lightbox_show_msg({
          type: _success ? "good" : "bad",
          message: data.msg,
          hide_lightbox: _success ? _lbdata.hide : !1,
          hide_message: _lbdata.hide_msg,
        });
      }
      if (
        data &&
        _lbdata.new_content &&
        "content" in data &&
        data.content != ""
      ) {
        if (_populate_id) {
          $("body")
            .find("#" + _populate_id)
            .replaceWith(data.content);
        } else {
          LB.evo_lightbox_populate_content({ content: data.content });
        }
      }
    } else {
      if (data && _populate_id && "content" in data && data.content != "") {
        $("body")
          .find("#" + _populate_id)
          .html(data.content);
      }
    }
    if ("show_snackbar" in _adata && "msg" in data && data.msg != "")
      el.evo_snackbar({ message: data.msg });
    if ("populate_dom_classes" in data) {
      $.each(data.populate_dom_classes, function (domclass, content) {
        $("body")
          .find("." + domclass)
          .html(content);
      });
    }
    if ("refresh_dom_content" in data) {
      $.each(data.refresh_dom_content, function (domid, content) {
        $("body")
          .find("#" + domid)
          .replaceWith(content);
      });
    }
    if (data && "sp_content" in data) {
      $("body").find("#evops_content").html(data.sp_content);
    }
    if (data && "sp_content_foot" in data) {
      $("body").find(".evosp_foot").html(data.sp_content_foot);
    }
    $("body").trigger("evo_elm_load_interactivity");
    setTimeout(function () {
      if ("evoelms" in data) {
        $.each(data.evoelms, function (uniqueid, elm_data) {
          $("body")
            .find(".has_dynamic_vals")
            .each(function () {
              if ($(this).attr("id") != uniqueid) return;
              var dynamic_elm = $(this);
              $.each(elm_data, function (elm_key, elmv) {
                dynamic_elm.data(elm_key, elmv);
              });
            });
        });
      }
    }, 200);
    $("body").trigger("evo_ajax_success_" + OO.uid, [OO, data, el]);
  };
  $.fn.evo_process_ajax_params = function (opt) {
    var defz = {
      uid: "",
      adata: {},
      lbdata: {},
      _populate_id: "",
      content: "",
      content_id: "",
      t: "",
      lbc: "",
      lbac: "",
      lbsz: "",
      lightbox_loader: !0,
      preload_temp_key: "init",
      load_new_content: !0,
      lb_padding: "",
      load_new_content_id: "",
      ajax: "no",
      ajax_url: "",
      end: "admin",
      ajax_action: "",
      a: "",
      ajax_type: "ajax",
      d: "",
      other_data: "",
      ajaxdata: "",
    };
    var OO = $.extend({}, defz, opt);
    var processed = {};
    processed.uid = OO.uid;
    var _adata = OO.adata == "" ? {} : OO.adata;
    var passed_type_val = !1;
    if (
      "type" in _adata &&
      _adata.type != "" &&
      !["ajax", "rest", "endpoint"].includes(_adata.type)
    ) {
      passed_type_val = _adata.type;
      _adata.type = "";
    }
    var def_avals = {
      a: "",
      type: "ajax",
      end: "admin",
      data: "",
      loader_el: "",
      loader_btn_el: "",
      loader_class: "",
      url: "",
    };
    $.each(def_avals, function (key, value) {
      if (
        key == "data" &&
        !("a" in _adata) &&
        "data" in _adata &&
        "a" in _adata.data
      )
        return;
      if (!(key in _adata) && value != "") _adata[key] = value;
    });
    var def_adata_mapping = {
      a: "a",
      ajax_action: "a",
      ajax_type: "type",
      end: "end",
      ajax_url: "url",
      ajaxdata: "data",
      d: "data",
    };
    $.each(def_adata_mapping, function (oldV, newV) {
      if (newV in _adata && _adata[newV] != "") return;
      if (oldV in OO && OO[oldV] !== "") {
        _adata[newV] = OO[oldV];
      }
    });
    if (_adata.data === undefined) _adata.data = {};
    $.each(_adata, function (key, value) {
      if (!(key in def_avals)) {
      }
    });
    if ("data" in _adata) {
      _adata.data.nn =
        typeof evo_admin_ajax_handle !== "undefined" &&
        evo_admin_ajax_handle !== null
          ? evo_admin_ajax_handle.postnonce
          : evo_general_params.n;
      _adata.data.uid = processed.uid;
      if (passed_type_val) _adata.data.type = passed_type_val;
      if ("action" in _adata.data) _adata.a = _adata.data.action;
      if ("a" in _adata.data) _adata.a = _adata.data.a;
      if ("ajaxdata" in OO) processed.ajaxdata = _adata.data;
    }
    processed.adata = _adata;
    var _lbdata = OO.lbdata == "" ? {} : OO.lbdata;
    var def_lbdata_mapping = {
      lbc: "class",
      lbsz: "size",
      lbac: "additional_class",
      t: "title",
      lb_padding: "padding",
      load_new_content: "new_content",
      lightbox_loader: "loader",
      content_id: "content_id",
      content: "content",
      hide_lightbox: "hide",
      hide_message: "hide_msg",
      lightbox_key: "class",
    };
    $.each(def_lbdata_mapping, function (oldV, newV) {
      if (
        newV in _lbdata &&
        _lbdata[newV] !== "" &&
        _lbdata[newV] !== null &&
        _lbdata[newV] !== undefined
      ) {
        return;
      }
      if (oldV in OO && OO[oldV] !== "") {
        _lbdata[newV] = OO[oldV];
      }
    });
    var def_lbvals = {
      padding: "evopad30",
      loader: !1,
      preload_temp_key: "init",
      new_content: !0,
      additional_class: "",
      title: "",
      hide: !1,
      hide_msg: 2000,
      content: "",
      content_id: "",
    };
    $.each(def_lbvals, function (key, value) {
      if (key in _lbdata) return;
      if (value == "") return;
      _lbdata[key] = value;
    });
    if (OO.ajaxdata.load_lbcontent) _lbdata.new_content = !0;
    if (OO.ajaxdata.load_new_content) _lbdata.new_content = !0;
    processed._populate_id = !1;
    if (OO.load_new_content_id != "")
      processed._populate_id = OO.load_new_content_id;
    if ("new_content_id" in _lbdata && _lbdata.new_content_id != "")
      processed._populate_id = _lbdata.new_content_id;
    if ("content_id" in _lbdata && _lbdata.content_id != "")
      processed._populate_id = _lbdata.content_id;
    processed.lbdata = _lbdata;
    if (processed.uid == "" && "uid" in processed.lbdata)
      processed.uid = processed.lbdata.uid;
    $.each(opt, function (oldkey, oldval) {
      if (oldkey in processed) return;
      processed[oldkey] = oldval;
    });
    return processed;
  };
  $("body").on("click", ".evolb_trigger", function (event) {
    if (event !== undefined) {
      event.preventDefault();
      event.stopPropagation();
    }
    $(this).evo_lightbox_open($(this).data("lbvals"));
  });
  $("body").on("click", ".evolb_close_btn", function () {
    const LB = $(this).closest(".evo_lightbox");
    LB.evo_lightbox_close();
  });
  $("body").on(
    "click",
    ".evolb_trigger_save, .evo_submit_form",
    function (event) {
      if (event !== undefined) {
        event.preventDefault();
        event.stopPropagation();
      }
      $(this).evo_ajax_lightbox_form_submit($(this).data("d"));
    }
  );
  $("body").on("click", ".evo_trigger_ajax_run", function (event) {
    if (event !== undefined) {
      event.preventDefault();
      event.stopPropagation();
    }
    $(this).evo_admin_get_ajax($(this).data("d"));
  });
  $("body").on("evo_lightbox_trigger", function (event, data) {
    $("body").evo_lightbox_open(data);
  });
  $.fn.evo_alert = function (opt) {
    var defz = {
      title: "Confirmation Action",
      message: "",
      yes_text: "Proceed",
      no_text: "No",
      on_yes: function () {},
      on_no: function () {},
    };
    var options = $.extend({}, defz, opt);
    var alertHtml =
      '<div class="evo_alert_box">' +
      '<p class="evotal evopad10i">' +
      options.message +
      "</p>" +
      '<div class="evo_alert_buttons evotar">' +
      '<button class="evo_alert_no evoboxsn evobrn evooln evocurp evohoop7 evopad10-20 evobr20 evobgclt">' +
      options.no_text +
      "</button>" +
      '<button class="evo_alert_yes evoboxsn evobrn evooln evocurp evoHbgc1 evopad10-20 evobr20 evomarr10 evobgclp evoclw">' +
      options.yes_text +
      "</button>" +
      "</div></div>";
    var lightboxOptions = {
      lbdata: {
        class: "evo_alert_lightbox",
        title: options.title || "Alert",
        content: alertHtml,
        padding: "pad20",
        size: "small",
      },
    };
    $(this).evo_lightbox_open(lightboxOptions);
    setTimeout(function () {
      var LIGHTBOX = $(".evo_lightbox.evo_alert_lightbox");
      LIGHTBOX.find(".evo_alert_yes").on("click", function () {
        options.on_yes(LIGHTBOX);
        LIGHTBOX.evo_lightbox_close();
        removeKeyListeners();
      });
      LIGHTBOX.find(".evo_alert_no").on("click", function () {
        options.on_no(LIGHTBOX);
        LIGHTBOX.evo_lightbox_close();
        removeKeyListeners();
      });
      function handleKeyPress(event) {
        if (event.key === "Escape") {
          options.on_no(LIGHTBOX);
          LIGHTBOX.remove();
          removeKeyListeners();
        } else if (event.key === "Enter") {
          options.on_yes(LIGHTBOX);
          LIGHTBOX.remove();
          removeKeyListeners();
        }
      }
      $(document).on("keydown", handleKeyPress);
      function removeKeyListeners() {
        $(document).off("keydown", handleKeyPress);
      }
      LIGHTBOX.find(".evolb_close_btn").on("click", function () {
        removeKeyListeners();
      });
    }, 350);
  };
  $.fn.evo_lightbox_open = function (opt) {
    var OO = this.evo_process_ajax_params(opt);
    var _lbdata = OO.lbdata;
    var _adata = OO.adata;
    var _populate_id = OO._populate_id;
    if (!("class" in _lbdata) || _lbdata.class == "") return;
    const fl_footer =
      _adata.end == "client" ? '<div class="evolb_footer"></div>' : "";
    var __lb_size = _lbdata.size === undefined ? "" : _lbdata.size;
    var html =
      '<div class="evo_lightbox ' +
      _lbdata.class +
      " " +
      _adata.end +
      " " +
      (_lbdata.additional_class !== undefined ? _lbdata.additional_class : "") +
      '" data-lbc="' +
      _lbdata.class +
      '"><div class="evolb_content_in"><div class="evolb_content_inin"><div class="evolb_box ' +
      _lbdata.class +
      " " +
      __lb_size +
      '"><div class="evolb_header"><a class="evolb_backbtn" style="display:none"><i class="fa fa-angle-left"></i></a>';
    if (_lbdata.title !== undefined)
      html += '<p class="evolb_title">' + _lbdata.title + "</p>";
    html +=
      '<span class="evolb_close_btn evolbclose "><i class="fa fa-xmark"><i></span></div><div class="evolb_content ' +
      _lbdata.padding +
      '"></div><p class="message"></p>' +
      fl_footer +
      "</div></div></div></div>";
    $("#evo_lightboxes").append(html);
    var LIGHTBOX = $(".evo_lightbox." + _lbdata.class);
    setTimeout(function () {
      $("#evo_lightboxes").show();
      LIGHTBOX.addClass("show");
      $("body").addClass("evo_overflow");
      $("html").addClass("evo_overflow");
    }, 300);
    LIGHTBOX.evo_lightbox_show_open_animation(OO);
    if (_lbdata.content_id != "") {
      var content = $("#" + _lbdata.content_id).html();
      LIGHTBOX.find(".evolb_content").html(content);
    }
    if (_lbdata.content != "") {
      LIGHTBOX.find(".evolb_content").html(_lbdata.content);
    }
    if ("a" in _adata && _adata.a != "") {
      LB.evo_admin_get_ajax(OO);
    }
    if ("url" in _adata && _adata.url != "") {
      $.ajax({
        beforeSend: function () {},
        url: OO.ajax_url,
        success: function (data) {
          LIGHTBOX.find(".evolb_content").html(data);
        },
        complete: function () {},
      });
    }
    $("body").trigger("evo_lightbox_processed", [OO, LIGHTBOX]);
  };
  $.fn.evo_lightbox_close = function (opt) {
    if (!this.hasClass("show")) return;
    const defaults = { delay: 500, remove_from_dom: !0 };
    const OO = $.extend({}, defaults, opt);
    const hideDelay = parseInt(OO.delay);
    const completeClose = this.parent().find(".evo_lightbox.show").length === 1;
    hideDelay > 500
      ? setTimeout(() => this.removeClass("show"), hideDelay - 500)
      : this.removeClass("show");
    setTimeout(() => {
      if (completeClose) {
        $("body, html").removeClass("evo_overflow");
      }
      if (OO.remove_from_dom) this.remove();
    }, hideDelay);
  };
  $.fn.evo_lightbox_populate_content = function (opt) {
    LB = this;
    var defaults = { content: "" };
    var OO = $.extend({}, defaults, opt);
    LB.find(".evolb_content").html(OO.content);
  };
  $.fn.evo_lightbox_show_msg = function (opt) {
    LB = this;
    var defaults = {
      type: "good",
      message: "",
      hide_message: !1,
      hide_lightbox: !1,
    };
    var OO = $.extend({}, defaults, opt);
    LB.find(".message")
      .removeClass("bad good")
      .addClass(OO.type)
      .html(OO.message)
      .fadeIn();
    if (OO.hide_message)
      setTimeout(function () {
        LB.evo_lightbox_hide_msg();
      }, OO.hide_message);
    if (OO.hide_lightbox) LB.evo_lightbox_close({ delay: OO.hide_lightbox });
  };
  $.fn.evo_lightbox_hide_msg = function (opt) {
    LB = this;
    LB.find("p.message").hide();
  };
  $.fn.evo_lightbox_show_open_animation = function (opt) {
    LB = this;
    var defaults = {
      animation_type: "initial",
      preload_temp_key: "init",
      end: "admin",
    };
    var OO = $.extend({}, defaults, opt);
    if (OO.animation_type == "initial") {
      passed_data =
        typeof evo_admin_ajax_handle !== "undefined"
          ? evo_admin_ajax_handle
          : evo_general_params;
      html = passed_data.html.preload_general;
      if (OO.preload_temp_key != "init")
        html = passed_data.html[OO.preload_temp_key];
      LB.find(".evolb_content").html(html);
    }
    if (OO.animation_type == "saving")
      LB.find(".evolb_content").addClass("loading");
  };
  $.fn.evo_get_ajax_url = function (opt) {
    var defaults = { a: "", e: "client", type: "ajax" };
    var OO = $.extend({}, defaults, opt);
    if (OO.type == "endpoint") {
      var evo_ajax_url =
        OO.e == "client" || typeof evo_general_params !== "undefined"
          ? evo_general_params.evo_ajax_url
          : evo_admin_ajax_handle.evo_ajax_url;
      return evo_ajax_url.toString().replace("%%endpoint%%", OO.a);
    } else if (OO.type == "rest") {
      var evo_ajax_url =
        OO.e == "client" || typeof evo_general_params !== "undefined"
          ? evo_general_params.rest_url
          : evo_admin_ajax_handle.rest_url;
      return evo_ajax_url.toString().replace("%%endpoint%%", OO.a);
    } else {
      action_add = OO.a != "" ? "?action=" + OO.a : "";
      return OO.e == "client" || typeof evo_general_params !== "undefined"
        ? evo_general_params.ajaxurl + action_add
        : evo_admin_ajax_handle.ajaxurl + action_add;
    }
  };
  $.fn.evo_start_loading = function (opt) {
    var defaults = { type: "1" };
    var OPT = $.extend({}, defaults, opt);
    var el = this;
    if (OPT.type == "1") el.addClass("evoloading loading");
    if (OPT.type == "2") el.addClass("evoloading_2");
  };
  $.fn.evo_stop_loading = function (opt) {
    var el = this;
    var defaults = { type: "1" };
    var OPT = $.extend({}, defaults, opt);
    if (OPT.type == "1") el.removeClass("evoloading loading");
    if (OPT.type == "2") el.removeClass("evoloading_2");
  };
  $.fn.evo_lightbox_start_inloading = function (opt) {
    LB = this;
    LB.find(".evolb_content").addClass("loading");
  };
  $.fn.evo_lightbox_stop_inloading = function (opt) {
    LB = this;
    LB.find(".evolb_content").removeClass("loading");
  };
  $.fn.evo_countdown_get = function (opt) {
    var defaults = { gap: "", endutc: "" };
    var OPT = $.extend({}, defaults, opt);
    var gap = OPT.gap;
    if (gap == "") {
      var Mnow = moment().utc();
      var M = moment();
      M.set("millisecond", OPT.endutc);
      gap = OPT.endutc - Mnow.unix();
    }
    if (gap < 0) {
      return { d: 0, h: 0, m: 0, s: 0 };
    }
    distance = gap * 1000;
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    return { d: days, h: hours, m: minutes, s: seconds };
  };
  $.fn.evo_countdown = function (opt) {
    var defaults = { S1: "" };
    var OPT = $.extend({}, defaults, opt);
    var el = $(this);
    const day_text =
      el.data("d") !== undefined && el.data("d") != "" ? el.data("d") : "Day";
    const days_text =
      el.data("ds") !== undefined && el.data("ds") != ""
        ? el.data("ds")
        : "Days";
    var duration = el.data("dur");
    var endutc = parseInt(el.data("endutc"));
    var text = el.data("t");
    if (text === undefined) text = "";
    if (el.hasClass("evo_cd_on")) return;
    var Mnow = moment().utc();
    var M = moment();
    M.set("millisecond", OPT.endutc);
    gap = endutc - Mnow.unix();
    if (gap > 0) {
      dd = el.evo_countdown_get({ gap: gap });
      el.html(
        (dd.d > 0 ? dd.d + " " + (dd.d > 1 ? days_text : day_text) + " " : "") +
          dd.h +
          ":" +
          dd.m +
          ":" +
          dd.s +
          "  " +
          text
      );
      el.data("gap", gap - 1);
      el.addClass("evo_cd_on");
      var CD = setInterval(function () {
        gap = el.data("gap");
        duration = el.data("dur");
        const bar_elm = el.closest(".evo_event_progress").find(".evo_ep_bar");
        if (gap > 0) {
          if (duration !== undefined && bar_elm.length) {
            perc = ((duration - gap) / duration) * 100;
            bar_elm.find("b").css("width", perc + "%");
          }
          dd = el.evo_countdown_get({ gap: gap });
          el.html(
            (dd.d > 0
              ? dd.d + " " + (dd.d > 1 ? days_text : day_text) + " "
              : "") +
              dd.h +
              ":" +
              dd.m +
              ":" +
              dd.s +
              " " +
              text
          );
          el.data("gap", gap - 1);
        } else {
          const expire_timer_action = el.data("exp_act");
          if (expire_timer_action !== undefined) {
            $("body").trigger("runajax_refresh_now_cal", [el, el.data("n")]);
          }
          const _complete_text = el.evo_get_txt({ V: "event_completed" });
          if (bar_elm.length) {
            bar_elm.addClass("evo_completed");
          }
          if (el.closest(".evcal_desc").length) {
            el.closest(".evcal_desc").find(".eventover").html(_complete_text);
            el.closest(".evcal_desc").find(".evo_live_now").remove();
          }
          if (el.closest(".eventon_list_event").length) {
            el.closest(".eventon_list_event").find("span.evo_live_now").hide();
          }
          el.html("");
          clearInterval(CD);
        }
      }, 1000);
    } else {
      clearInterval(CD);
    }
  };
  $.fn.evo_HB_process_template = function (opt) {
    var defaults = { TD: "", part: "" };
    var OPT = $.extend({}, defaults, opt);
    BUS = $("#evo_global_data").data("d");
    template = Handlebars.compile(BUS.temp[OPT.part]);
    return template(OPT.TD);
  };
  $.fn.evo_cal_events_in_range = function (opt) {
    var defaults = {
      S: "",
      E: "",
      hide: !0,
      closeEC: !0,
      showEV: !1,
      showEVL: !1,
      showAllEvs: !1,
    };
    var OPT = $.extend({}, defaults, opt);
    var CAL = $(this);
    eJSON = CAL.find(".evo_cal_events").data("events");
    R = {};
    html = "";
    json = {};
    show = 0;
    if (eJSON && eJSON.length > 0) {
      $.each(eJSON, function (ind, ED) {
        eO = CAL.find("#event_" + ED._ID);
        if (eO === undefined || eO.length == 0) return;
        if (OPT.hide) eO.hide();
        this_show = !1;
        if (ED.month_long || ED.year_long) {
          this_show = !0;
        } else {
          if (
            CAL.evo_is_in_range({
              S: OPT.S,
              E: OPT.E,
              start: ED.event_start_unix,
              end: ED.event_end_unix,
            })
          ) {
            this_show = !0;
          }
        }
        if (OPT.showAllEvs) this_show = !0;
        if (this_show) {
          if (OPT.showEV) eO.show();
          if (OPT.closeEC && SC.evc_open == "no")
            eO.find(".event_description").hide().removeClass("open");
          html += eO[0].outerHTML;
          json[ED._ID] = ED;
          show++;
        }
      });
    } else {
      var cal_events = CAL.find(".eventon_list_event");
      cal_events.each(function (index, elm) {
        var ED = $(elm).evo_cal_get_basic_eventdata();
        if (!ED) return;
        if (OPT.hide) $(elm).hide();
        this_show = !1;
        if ($(elm).hasClass("month_long") || $(elm).hasClass("year_long")) {
          this_show = !0;
        } else {
          if (
            CAL.evo_is_in_range({
              S: OPT.S,
              E: OPT.E,
              start: ED.event_start_unix,
              end: ED.event_end_unix,
            })
          ) {
            this_show = !0;
          }
        }
        if (OPT.showAllEvs) this_show = !0;
        if (this_show) {
          if (OPT.showEV) $(elm).show();
          if (OPT.closeEC && SC.evc_open == "no")
            $(elm).find(".event_description").hide().removeClass("open");
          html += $(elm)[0].outerHTML;
          json[ED.uID] = ED;
          show++;
        }
      });
    }
    if (OPT.showEV) {
      no_event_content = CAL.evo_get_global({ S1: "html", S2: "no_events" });
      tx_noevents = CAL.evo_get_txt({ V: "no_events" });
      EL = CAL.find(".eventon_events_list");
      EL.find(".eventon_list_event.no_events").remove();
      if (show == 0)
        EL.append(
          '<div class="eventon_list_event no_events">' +
            no_event_content +
            "</div>"
        );
    }
    if (OPT.showEVL) {
      CAL.find(".eventon_events_list").show().removeClass("evo_hide");
    }
    R.count = show;
    R.html = html;
    R.json = json;
    return R;
  };
  $.fn.evo_is_in_range = function (opt) {
    var defaults = { S: "", E: "", start: "", end: "" };
    var OPT = $.extend({}, defaults, opt);
    S = parseInt(OPT.S);
    E = parseInt(OPT.E);
    start = parseInt(OPT.start);
    end = parseInt(OPT.end);
    return (start <= S && end >= E) ||
      (start <= S && end >= S && end <= E) ||
      (start <= E && end >= E) ||
      (start >= S && end <= E)
      ? true
      : !1;
  };
  $.fn.evo_cal_hide_events = function () {
    CAL = $(this);
    CAL.find(".eventon_list_event").hide();
  };
  $.fn.evo_cal_get_basic_eventdata = function () {
    var ELM = $(this);
    var _time = ELM.data("time");
    if (_time === undefined) return !1;
    const time = _time.split("-");
    const ri = ELM.data("ri").replace("r", "");
    const eID = ELM.data("event_id");
    var _event_title = ELM.find(".evcal_event_title").text();
    _event_title = _event_title.replace(/'/g, "&apos;");
    var RR = {
      uID: eID + "_" + ri,
      ID: eID,
      event_id: eID,
      ri: ri,
      event_start_unix: parseInt(time[0]),
      event_end_unix: parseInt(time[1]),
      ux_val: ELM.find(".evcal_list_a").data("ux_val"),
      event_title: _event_title,
      hex_color: ELM.data("colr"),
      hide_et: ELM.hasClass("no_et") ? "y" : "n",
      evcal_event_color: ELM.data("colr"),
      unix_start: parseInt(time[0]),
      unix_end: parseInt(time[1]),
    };
    RR.ett1 = {};
    ELM.find(".evoet_eventtypes.ett1 .evoetet_val").each(function () {
      RR.ett1[$(this).data("id")] = $(this).data("v");
    });
    const eventtop_data = ELM.find(".evoet_data").data("d");
    if (
      eventtop_data &&
      "loc.n" in eventtop_data &&
      eventtop_data["loc.n"] != ""
    ) {
      RR.location = eventtop_data["loc.n"];
    }
    if (
      eventtop_data &&
      "orgs" in eventtop_data &&
      eventtop_data.orgs !== undefined
    ) {
      var org_names = "";
      $.each(eventtop_data.orgs, function (index, value) {
        org_names += value + " ";
      });
      RR.organizer = org_names;
    }
    if (ELM.find(".evo_event_schema").length > 0) {
      imgObj = ELM.find(".evo_event_schema")
        .find("meta[itemprop=image]")
        .attr("content");
      RR.image_url = imgObj;
    }
    if (
      eventtop_data &&
      "tags" in eventtop_data &&
      eventtop_data.tags !== undefined
    ) {
      RR.event_tags = eventtop_data.tags;
    }
    return RR;
  };
  $.fn.evo_day_in_month = function (opt) {
    var defaults = { M: "", Y: "" };
    var OPT = $.extend({}, defaults, opt);
    return new Date(OPT.Y, OPT.M, 0).getDate();
  };
  $.fn.evo_get_day_name_index = function (opt) {
    var defaults = { M: "", Y: "", D: "" };
    var OPT = $.extend({}, defaults, opt);
    return new Date(Date.UTC(OPT.Y, OPT.M - 1, OPT.D)).getUTCDay();
  };
  $.fn.evo_prepare_lb = function () {
    $(this).find(".evo_lightbox_body").html("");
  };
  $.fn.evo_show_lb = function (opt) {
    var defaults = { RTL: "", calid: "" };
    var OPT = $.extend({}, defaults, opt);
    $(this)
      .addClass("show " + OPT.RTL)
      .attr("data-cal_id", OPT.calid);
    $("body").trigger("evolightbox_show");
  };
  $.fn.evo_append_lb = function (opt) {
    var defaults = { C: "", CAL: "" };
    var OPT = $.extend({}, defaults, opt);
    $(this).find(".evo_lightbox_body").html(OPT.C);
    if (OPT.CAL != "" && OPT.CAL !== undefined && OPT.CAL.hasClass("color")) {
      const LIST = $(this).find(".eventon_events_list");
      if (LIST.length > 0) {
        LIST.find(".eventon_list_event").addClass("color");
      }
    }
  };
  $.fn.evo_update_sc_from_filters = function () {
    var ev_cal = $(this);
    SC = ev_cal.find(".evo_cal_data").data("sc");
    var filter_section = ev_cal.find(".eventon_filter_line").first();
    filter_section.find(".eventon_filter").each(function (index) {
      O = $(this);
      var filter_val = O.data("filter_val");
      filter_val = filter_val == "" ? "NOT-all" : filter_val;
      ADD =
        O.data("fl_o") && O.data("fl_o") != "IN" ? O.data("fl_o") + "-" : "";
      SC[O.data("filter_field")] = ADD + filter_val;
    });
    ev_cal.find(".evo_cal_data").data("sc", SC);
  };
  $.fn.evo_shortcode_data = function () {
    var ev_cal = $(this);
    return ev_cal.find(".evo_cal_data").data("sc");
  };
  $.fn.evo_get_sc_val = function (opt) {
    var defaults = { F: "" };
    var OPT = $.extend({}, defaults, opt);
    var ev_cal = $(this);
    if (OPT.F == "") return !1;
    SC = ev_cal.find(".evo_cal_data").data("sc");
    if (!SC[OPT.F]) return !1;
    return SC[OPT.F];
  };
  $.fn.evo_update_cal_sc = function (opt) {
    var defaults = { F: "", V: "" };
    var OPT = $.extend({}, defaults, opt);
    var ev_cal = $(this);
    SC = ev_cal.find(".evo_cal_data").data("sc");
    SC[OPT.F] = OPT.V;
    ev_cal.find(".evo_cal_data").data("sc", SC);
  };
  $.fn.evo_update_all_cal_sc = function (opt) {
    var defaults = { SC: "" };
    var OPT = $.extend({}, defaults, opt);
    var CAL = $(this);
    CAL.find(".evo_cal_data").data("sc", OPT.SC);
  };
  $.fn.evo_is_hex_dark = function (opt) {
    var defaults = { hex: "808080" };
    var OPT = $.extend({}, defaults, opt);
    hex = OPT.hex;
    var c = hex.replace("#", "");
    var is_hex =
      typeof c === "string" && c.length === 6 && !isNaN(Number("0x" + c));
    if (is_hex) {
      var values = c.split("");
      r = parseInt(values[0].toString() + values[1].toString(), 16);
      g = parseInt(values[2].toString() + values[3].toString(), 16);
      b = parseInt(values[4].toString() + values[5].toString(), 16);
    } else {
      var vals = c.substring(c.indexOf("(") + 1, c.length - 1).split(", ");
      var r = vals[0];
      var g = vals[1];
      var b = vals[2];
    }
    var luma = (r * 299 + g * 587 + b * 114) / 1000;
    return luma > 155 ? true : !1;
  };
  $.fn.evo_rgb_process = function (opt) {
    var defaults = { data: "808080", type: "rgb", method: "rgb_to_val" };
    var opt = $.extend({}, defaults, opt);
    const color = opt.data;
    if (opt.method == "rgb_to_hex") {
      if (color == "1") {
        return;
      } else {
        if (color !== "" && color) {
          rgb = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
          return (
            "#" +
            ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2)
          );
        }
      }
    }
    if (opt.method == "rgb_to_val") {
      if (opt.type == "hex") {
        var rgba = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
        var rgb = new Array();
        rgb.r = parseInt(rgba[1], 16);
        rgb.g = parseInt(rgba[2], 16);
        rgb.b = parseInt(rgba[3], 16);
      } else {
        rgb = color;
      }
      return parseInt((rgb.r + rgb.g + rgb.b) / 3);
    }
  };
  $.fn.evo_get_OD = function () {
    var ev_cal = $(this);
    return ev_cal.find(".evo_cal_data").data("od");
  };
  $.fn.evoGetFilters = function () {
    var ev_cal = $(this);
    var evodata = ev_cal.find(".evo-data");
    var filters_on =
      evodata.attr("data-filters_on") == "true" ? "true" : "false";
    if (filters_on == "true") {
      var filter_section = ev_cal.find(".eventon_filter_line");
      var filter_array = [];
      filter_section.find(".eventon_filter").each(function (index) {
        var filter_val = $(this).attr("data-filter_val");
        if (filter_val != "all") {
          var filter_ar = {};
          filter_ar.filter_type = $(this).attr("data-filter_type");
          filter_ar.filter_name = $(this).attr("data-filter_field");
          if ($(this).attr("data-fl_o") == "NOT") {
            filter_ar.filter_op = "NOT IN";
          }
          filter_ar.filter_val = filter_val;
          filter_array.push(filter_ar);
        }
      });
    } else {
      var filter_array = "";
    }
    return filter_array;
  };
  $.fn.evo_getevodata = function () {
    var ev_cal = $(this);
    var evoData = {};
    ev_cal.find(".evo-data").each(function () {
      $.each(this.attributes, function (i, attrib) {
        var name = attrib.name;
        if (attrib.name != "class" && attrib.name != "style") {
          name__ = attrib.name.split("-");
          evoData[name__[1]] = attrib.value;
        }
      });
    });
    return evoData;
  };
  $.fn.evo_loader_animation = function (opt) {
    var defaults = { direction: "start" };
    var OPT = $.extend({}, defaults, opt);
    if (OPT.direction == "start") {
      $(this).find("#eventon_loadbar").slideDown();
    } else {
      $(this).find("#eventon_loadbar").slideUp();
    }
  };
  $.fn.evo_item_shortcodes = function () {
    var OBJ = $(this);
    var shortcode_array = {};
    OBJ.each(function () {
      $.each(this.attributes, function (i, attrib) {
        var name = attrib.name;
        if (
          attrib.name != "class" &&
          attrib.name != "style" &&
          attrib.value != ""
        ) {
          name__ = attrib.name.split("-");
          shortcode_array[name__[1]] = attrib.value;
        }
      });
    });
    return shortcode_array;
  };
  $.fn.evo_shortcodes = function () {
    var ev_cal = $(this);
    var shortcode_array = {};
    ev_cal.find(".cal_arguments").each(function () {
      $.each(this.attributes, function (i, attrib) {
        var name = attrib.name;
        if (
          attrib.name != "class" &&
          attrib.name != "style" &&
          attrib.value != ""
        ) {
          name__ = attrib.name.split("-");
          shortcode_array[name__[1]] = attrib.value;
        }
      });
    });
    return shortcode_array;
  };
})(jQuery);
