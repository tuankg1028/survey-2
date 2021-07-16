(function($) {
  "use strict";
  $("body").on("click", ".see-less-btn", function() {
    $(this)
      .parent()
      .find(".see-more-btn")
      .click();
  });
  $("body").on("click", ".see-more-btn", function() {
    // var dots = document.getElementById("dots");
    var moreText = $(this).prev();
    var btnText = $(this);

    if (moreText.css("display") === "none" || moreText.css("display") === "") {
      btnText.text("Read less");

      btnText
        .parent()
        .find(".see-less-btn")
        .css("display", "inline");
      moreText.css("display", "inline");
    } else {
      btnText.text("Read more");
      moreText.css("display", "none");

      btnText
        .parent()
        .find(".see-less-btn")
        .css("display", "none");
    }

    // change height
    $(".slick-slide").css(
      "height",
      $(".slick-active form").height() + 20 + "px"
    );
  });

  $("body").on("change", ".wrap-anwser input[type='radio']", function() {
    const value = $(this).val();

    const elements = $(this)
      .parents(".wrap-anwser")
      .next()
      .find("tbody  tr:odd");
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];

      $(element)
        .find(`input[value='${value}']`)
        .prop("checked", true);
    }
  });

  setInterval(() => {
    const value = parseInt($(".slick-active form .count-time").val());

    $(".slick-active form .count-time").val(value + 1);
  }, 1000);
})(jQuery);
