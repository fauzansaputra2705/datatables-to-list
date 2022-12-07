(function ($, window, document, undefined) {
  ("use strict");

  var DataTableToList = function (selector, options) {
    if (this instanceof DataTableToList) {
      return $(selector).DataTableToList(options);
    } else {
      options = selector;
    }

    // var len = this.length;
    var defaults = $.extend({}, DataTableToList.defaults, options);
    var $this = $(this);

    this.filter = function (data) {
      __reload($this, defaults, data);
    };

    this.each(function () {
      __log(defaults, "initialized");
      __log(defaults, $this);
      __log(defaults, defaults);

      if (defaults.search) {
        if ($("#_DatatableToListSearch").length === 0) {
          $this
            .find(defaults.container)
            .before(
              `<input type="text" class="form-control" placeholder="Search" id="_DatatableToListSearch">`
            );
        }
      }

      $this.find("#_DatatableToListSearch").on("keyup paste", function () {
        var val = $(this).val();
        console.log(val);
        setTimeout(function () {
          __search($this, defaults, val);
        }, 300);
      });

      if ($("#_DatatableToListSearch").val().length > 0) {
        var val = $("#_DatatableToListSearch").val();
        __search($this, defaults, val);
      } else {
        $this.find(defaults.container).html("");
        __executeAjax(__paramsAjax($this, defaults, start, _draw1));
      }

      $(window).on("load scroll resize", function () {
        if (
          $(window).scrollTop() + $(window).height() ==
          $(document).height()
        ) {
          if (!loading) {
            $this.find("#loading").remove();

            if (
              countDataRender > 0 &&
              countDataRender < recordsFiltered &&
              countDataRender < recordsTotal
            ) {
              s = defaults.length + start;
              d = _draw1 + 1;

              clearTimeout($.data(this, "scrollTimer"));
              $.data(
                this,
                "scrollTimer",
                setTimeout(function () {
                  __executeAjax(__paramsAjax($this, defaults, s, d));
                }, 500)
              );
            }
          }
          if (
            countDataRender > 0 &&
            countDataRender < recordsFiltered &&
            countDataRender < recordsTotal
          ) {
            $this
              .find(defaults.container)
              .after(
                "<div id='loading' style='text-align: center'>Loading ...</div>"
              );
          } else {
            $this.find("#loading").remove();
          }
        } else {
          $this.find("#loading").remove();
        }
      });
    });
    return this;
  };

  var loading = false;

  var __log = function (defaults, obj) {
    if (defaults.debug && console.log != undefined) {
      console.log(obj);
    }
  };

  var start = 0;
  var _draw1 = 1;
  var _draw2 = 0;
  var recordsTotal = 0;
  var recordsFiltered = 0;
  var countDataRender = 0;
  var postData = {};
  var formatAjaxParams = {
    // type: "get",
    cache: false,
    data: {},
    // contentType: "application/x-www-form-urlencoded; charset=UTF-8",
    dataType: "json",
    async: true,
  };

  function __search($this, defaults, val) {
    postData["search[value]"] = val;
    postData["search[regex]"] = false;

    countDataRender = 0;
    s = 0;
    d = _draw1 + 1;

    $this.find(defaults.container).html("");
    __executeAjax(__paramsAjax($this, defaults, s, d));
  }

  function __paramsAjax($this, defaults, s, d) {
    _draw1 = d;
    start = s;

    postData["start"] = s;
    postData["length"] = defaults.length;
    postData["draw"] = d;

    $.map(defaults.columns, function (v, i) {
      postData[`columns[${i}][data]`] = v.data;
      postData[`columns[${i}][name]`] = v.name;
      postData[`columns[${i}][searchable]`] = true;
      postData[`columns[${i}][orderable]`] = false;
      postData[`columns[${i}][search][value]`] = "";
      postData[`columns[${i}][search][regex]`] = false;
    });

    var ajaxParams =
      typeof defaults.ajax === "function" ? defaults.ajax() : defaults.ajax;

    $.extend(true, formatAjaxParams, ajaxParams);
    $.extend(formatAjaxParams.data, postData);

    formatAjaxParams.beforeSend = function () {
      loading = true;
    };
    formatAjaxParams.complete = function () {
      loading = false;
    };
    formatAjaxParams.success = function (response) {
      _draw2 = response.draw;
      recordsTotal = response.recordsTotal;
      recordsFiltered = response.recordsFiltered;
      if (response.data.length == 0) {
        countDataRender = 0;
      } else {
        countDataRender = response.data.length + countDataRender;
      }

      if (countDataRender > 0) {
        __render($this, defaults, response);
      }
    };
    formatAjaxParams.error = function (jqXHR, textStatus, errorThrown) {
      defaults.formatAjaxError &&
        defaults.formatAjaxError(jqXHR, textStatus, errorThrown);
    };
    return formatAjaxParams;
  }

  function __executeAjax(params) {
    $.ajax(params);
  }

  function __render($this, defaults, data) {
    __log(defaults, "render");
    var html = defaults.templateHtml(data);
    $this.find(defaults.container).append(html);
    __log(defaults, "done");
  }

  function __reload($this, defaults, data = null) {
    countDataRender = 0;
    s = 0;
    d = _draw1 + 1;

    $.extend(defaults.ajax.data, data);

    $this.find(defaults.container).html("");
    __executeAjax(__paramsAjax($this, defaults, s, d));
  }

  DataTableToList.defaults = {
    length: 10,
    search: true,
    container: $(this),
    // ajax: null,
    columns: [],
    templateHtml: function () {},
    debug: false,
  };

  // jQuery access
  $.fn.DataTableToList = DataTableToList;
})(jQuery, window, document);

// (function ($) {
//   $.fn.DataTableToList = function (options, asd) {
//     var attributes = $.extend(
//       {
//         length: 10,
//         search: true,
//         container: $(this),
//         columns: [],
//         templateHtml: function () {},
//         debug: false,
//       },
//       options
//     );

//     $(window).on("load scroll resize", function () {
//       if ($(window).scrollTop() + $(window).height() == $(document).height()) {
//         if (!loading) {
//           scope.find("#loading").remove();

//           if (
//             countDataRender > 0 &&
//             countDataRender < recordsFiltered &&
//             countDataRender < recordsTotal
//           ) {
//             s = attributes.length + start;
//             d = _draw1 + 1;
//             clearTimeout($.data(this, "scrollTimer"));
//             $.data(
//               this,
//               "scrollTimer",
//               setTimeout(function () {
//                 paramsAjax(s, d);
//                 executeAjax(formatAjaxParams);
//               }, 500)
//             );
//           }
//         }
//         if (
//           countDataRender > 0 &&
//           countDataRender < recordsFiltered &&
//           countDataRender < recordsTotal
//         ) {
//           scope
//             .find(attributes.container)
//             .after(
//               "<div id='loading' style='text-align: center'>Loading ...</div>"
//             );
//         } else {
//           scope.find("#loading").remove();
//         }
//       } else {
//         scope.find("#loading").remove();
//       }
//     });
//   };
// })(jQuery);
