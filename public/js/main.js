function startLoad() {
  $("html, body").css({
    overflow: "hidden",
    height: "100%"
  });
  $("#wrap-loader").show(0);
}

function endLoad() {
  $("#wrap-loader").hide(0);
  $("html, body").css({
    overflow: "auto",
    height: "auto"
  });
}

(function($) {
  "use strict";
  // Animate loader off screen
  endLoad();
  /*==================================================================
    [ Validate ]*/
  var input = $(".validate-input .input100");

  $(".validate-form").on("submit", function() {
    var check = true;

    for (var i = 0; i < input.length; i++) {
      if (validate(input[i]) == false) {
        showValidate(input[i]);
        check = false;
      }
    }

    return check;
  });

  $(".validate-form .input100").each(function() {
    $(this).focus(function() {
      hideValidate(this);
    });
  });

  function validate(input) {
    if ($(input).attr("type") == "email" || $(input).attr("name") == "email") {
      if (
        $(input)
          .val()
          .trim()
          .match(
            /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/
          ) == null
      ) {
        return false;
      }
    }
    // confirm password
    else if (
      $(input).attr("type") == "password" &&
      $(input).attr("name") == "confirmPass"
    ) {
      if ($(input).val() !== $(".signup100-form input[name='pass']").val()) {
        return false;
      }
    } else {
      if (
        $(input)
          .val()
          .trim() == ""
      ) {
        return false;
      }
    }
  }

  function showValidate(input) {
    var thisAlert = $(input).parent();

    $(thisAlert).addClass("alert-validate");
  }

  function hideValidate(input) {
    var thisAlert = $(input).parent();

    $(thisAlert).removeClass("alert-validate");
  }

  var btn = $("#button");

  $(window).scroll(function() {
    if ($(window).scrollTop() > 300) {
      btn.addClass("show");
    } else {
      btn.removeClass("show");
    }
  });

  btn.on("click", function(e) {
    e.preventDefault();
    $("html, body").animate({ scrollTop: 0 }, "300");
  });

  // var input = document.getElementById("input");
  // var x = document.getElementById("div");
  // var string = input.value;
  // x.innerHTML = string[0].toUpperCase() + string.slice(1);
})(jQuery);
