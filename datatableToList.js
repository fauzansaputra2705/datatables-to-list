(function ($) {
  $.fn.DataTableToList = function (options, asd) {
    var attributes = $.extend(
      {
        length: 10,
        search: true,
        container: $(this),
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
    var postData = {};

    var formatAjaxParams = {
      type: "get",
      cache: false,
      data: {},
      // contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      dataType: "json",
      async: true,
    };

    $(document).on("input", "#_search", function () {
      var val = $(this).val();
      postData["search[value]"] = val;

      scope.find(attributes.container).html("");
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

      var ajaxParams =
        typeof attributes.ajax === "function"
          ? attributes.ajax()
          : attributes.ajax;

      $.extend(true, formatAjaxParams, ajaxParams);
      $.extend(formatAjaxParams.data, postData);

      formatAjaxParams.success = function (response) {
        render(response);
        _draw2 = response.draw;
      };
      formatAjaxParams.error = function (jqXHR, textStatus, errorThrown) {
        attributes.formatAjaxError &&
          attributes.formatAjaxError(jqXHR, textStatus, errorThrown);
      };
    }

    function executeAjax(params) {
      $.ajax(params);
    }

    function render(data) {
      log("render");
      loading = true;
      scope.find(attributes.container).append(attributes.templateHtml(data));
      log("done");
      loading = false;
    }

    paramsAjax(start, _draw1);
    executeAjax(formatAjaxParams);

    $(window).on("load scroll resize", function () {
      if ($(window).scrollTop() + $(window).height() == $(document).height()) {
        if (!loading) {
          scope.find("#loading").remove();

          s = attributes.length + start;
          d = _draw1 + 1;
          if (s != start) {
            paramsAjax(s, d);
            executeAjax(formatAjaxParams);
          }
        }

        scope
          .find(attributes.container)
          .after("<span id='loading'>Loading ...</span>");
      } else {
        scope.find("#loading").remove();
      }
    });
  };
})(jQuery);
