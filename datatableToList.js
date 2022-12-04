(function ($) {
  $.fn.DataTableToList = function (options, asd) {
    var attributes = $.extend(
      {
        length: 10,
        search: true,
        container: $(this),
        columns: [],
        templateHtml: function () {},
        debug: false,
      },
      options
    );

    var scope = $(this);
    var loading = false;

    var log = function (obj) {
      if (attributes.debug && console.log != undefined) {
        console.log(obj);
      }
    };
    log("initialized");
    log(scope);
    log(attributes);

    if (attributes.search) {
      scope
        .find(attributes.container)
        .before(
          `<input type="text" class="form-control" placeholder="Search" aria-describedby="basic-addon2" id="_search">`
        );
    }

    var start = 0;
    var _draw1 = 1;
    var _draw2 = 0;
    var recordsTotal = 0;
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

    $(document).on("input", "#_search", function () {
      var val = $(this).val();
      postData["search[value]"] = val;
      postData["search[regex]"] = false;

      scope.find(attributes.container).html("");
      countDataRender = 0;
      start = 0;
      d = _draw1 + 1;
      paramsAjax(start, d);
      executeAjax(formatAjaxParams);
    });

    function paramsAjax(s, d) {
      _draw1 = d;
      start = s;

      postData["start"] = s;
      postData["length"] = attributes.length;
      postData["draw"] = d;

      $.map(attributes.columns, function (v, i) {
        postData[`columns[${i}][data]`] = v.data;
        postData[`columns[${i}][name]`] = v.name;
        postData[`columns[${i}][searchable]`] = true;
        postData[`columns[${i}][orderable]`] = false;
        postData[`columns[${i}][search][value]`] = "";
        postData[`columns[${i}][search][regex]`] = false;
      });

      var ajaxParams =
        typeof attributes.ajax === "function"
          ? attributes.ajax()
          : attributes.ajax;

      $.extend(true, formatAjaxParams, ajaxParams);
      $.extend(formatAjaxParams.data, postData);

      formatAjaxParams.beforeSend = function () {
        loading = true;
      };
      formatAjaxParams.complete = function () {
        loading = false;
      };
      formatAjaxParams.success = function (response) {
        render(response);
        _draw2 = response.draw;
        recordsTotal = response.recordsTotal;
        countDataRender = response.data.length + countDataRender;
      };
      formatAjaxParams.error = function (jqXHR, textStatus, errorThrown) {
        attributes.formatAjaxError &&
          attributes.formatAjaxError(jqXHR, textStatus, errorThrown);
      };
    }

    function executeAjax(params) {
      $.ajax(params);
    }

    $.fn.reload = function () {
      $.ajax(formatAjaxParams);
    };

    function render(data) {
      log("render");
      scope.find(attributes.container).append(attributes.templateHtml(data));
      log("done");
    }

    paramsAjax(start, _draw1);
    executeAjax(formatAjaxParams);

    $(window).on("load scroll resize", function () {
      if ($(window).scrollTop() + $(window).height() == $(document).height()) {
        if (!loading) {
          scope.find("#loading").remove();

          s = attributes.length + start;
          d = _draw1 + 1;
          if (countDataRender < recordsTotal) {
            clearTimeout($.data(this, "scrollTimer"));
            $.data(
              this,
              "scrollTimer",
              setTimeout(function () {
                paramsAjax(s, d);
                executeAjax(formatAjaxParams);
              }, 500)
            );
          }
        }

        if (countDataRender < recordsTotal) {
          scope
            .find(attributes.container)
            .after(
              "<div id='loading' style='text-align: center'>Loading ...</div>"
            );
        } else {
          scope.find("#loading").remove();
        }
      } else {
        scope.find("#loading").remove();
      }
    });
  };
})(jQuery);
