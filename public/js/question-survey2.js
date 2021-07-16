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

  $(".question-desc form").submit(function(e) {
    e.preventDefault();
    startLoad();
    // submit
    const token = $("input[name='token']").val();

    const data = {
      questions: {},
      categories: []
    };

    const elements = $(".question-desc form");
    for (let index = 1; index < elements.length - 1; index++) {
      const element = elements[index];
      const question = Qs.parse($(element).serialize()).questions;

      const appId = Object.keys(question)[0];
      data.questions[appId] = question[appId];
    }
    data.categories = Qs.parse(
      $(elements[elements.length - 1]).serialize()
    ).categories;

    // comment
    data.comment = $("textarea[name='comment']").val();

    data.workerId = $("input[name='workerId']").val();
    data.campaignId = $("input[name='campaignId']").val();
    data.slotId = $("input[name='slotId']").val();
    data.randKey = $("input[name='randKey']").val();

    data.firstGroupQuest = {};
    data.firstGroupQuest["privacy issue"] = $(
      "input[name='privacy issue']:checked"
    ).val(); //

    data.firstGroupQuest["satisfied"] = $(
      "input[name='satisfied']:checked"
    ).val(); //

    data.firstGroupQuest["relevant information"] = $(
      "input[name='relevant information']:checked"
    ).val(); //

    data.firstGroupQuest["interested accessing data"] = $(
      "input[name='interested accessing data']:checked"
    ).val(); //

    // basicInfo
    data.basicInfo = {};
    data.basicInfo["age"] = $("input[name='age']").val(); //
    data.basicInfo["gender"] = $("input[name='gender']:checked").val(); //
    data.basicInfo["education"] = $("input[name='education']").val(); //
    data.basicInfo["occupation"] = $("input[name='occupation']").val(); //
    data.basicInfo["fieldOfWork"] = $("input[name='fieldOfWork']").val(); //
    data.basicInfo["OSOfDevices"] = $("input[name='OSOfDevices']").val(); //

    // merge comment to question
    const questionComments = Qs.parse(
      $(elements[elements.length - 1]).serialize()
    ).questions;

    for (const appId in questionComments) {
      const element = questionComments[appId];

      data.questions[appId] = { ...data.questions[appId], ...element };
    }
    $.ajax({
      url: $(".main-form").attr("action"),
      type: "post",
      data: {
        data: JSON.stringify(data)
      },
      headers: { Authorization: token },
      success: function(response) {
        endLoad();
        window.location.href = "/success";
      }
    }).fail(err => {
      alert("Unfortunately something went wrong. Please submit again");
      endLoad();
    });
  });
  $(".wrap-forms").on("init", function(event, slick) {
    // change height
    setTimeout(() => {
      $(".slick-slide").css(
        "height",
        $(".slick-active form").height() + 20 + "px"
      );
    }, 500);

    // load html
    loadQuestion();
  });

  $(".wrap-forms").on("init reInit afterChange", function(
    event,
    slick,
    currentSlide,
    nextSlide
  ) {
    //currentSlide is undefined on init -- set it to 0 in this case (currentSlide is 0 based)
    var i = (currentSlide ? currentSlide : 0) + 1;
    $(".pagingInfo").html(
      `<span style="color: #FF9800; font-size: 30px">${i}</span> / ${slick.slideCount}`
    );
  });

  $(".wrap-forms").slick({
    dots: false,
    infinite: false,
    speed: 500,
    arrows: true,
    autoplay: false,
    draggable: false,
    swipe: false,
    // adaptiveHeight: true,
    prevArrow:
      "<div class='wrap-btn-pre'> <button class='login100-form-btn button-pre'>Back</button> </div>",
    nextArrow:
      "<div class='wrap-btn-next'> <button class='login100-form-btn button-next'>Next</button> </div>"
  });

  $(".wrap-forms").on("afterChange", function(event, slick, currentSlide) {
    const total_slide = $(".question-desc form").length;
    $("#button").click();
    if (currentSlide === total_slide) {
      $(".wrap-btn-next").addClass("hidden");
    } else {
      $(".wrap-btn-next").removeClass("hidden");
    }

    if (currentSlide === 0) {
      $(".wrap-btn-pre").addClass("hidden");
    } else {
      $(".wrap-btn-pre").removeClass("hidden");
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
  //Modifies Slick To Allow Next/Prev Trigger
  ////////////////////////////////////////////
  var slickInstance = $(".wrap-forms")[0];
  //this turns off the next and prev functions
  slickInstance.slick.$nextArrow.off("click.slick");
  slickInstance.slick.$prevArrow.off("click.slick");
  //this holds the original changeSlide function
  var origSlide = slickInstance.slick.changeSlide;
  //function that conditions the readding of slide functionality
  slickInstance.slick.changeSlide = function(a, b) {
    // previous
    if (a.data.message === "previous") {
      origSlide(a, b);
      return;
    }
    // next
    const isValid = $(".slick-active form")[0].checkValidity();

    if (isValid) {
      origSlide(a, b);

      // next
      loadQuestion();
    } else {
      $(".slick-active form button[type='submit']").click();
    }
  };
  // re-add arrow func
  slickInstance.slick.initArrowEvents();

  setInterval(() => {
    const value = parseInt($(".slick-active form .count-time").val());

    $(".slick-active form .count-time").val(value + 1);
  }, 1000);

  function capitalizeFLetter() {
    const capitalizeFLetters = $(".capitalizeFLetter");

    for (let i = 0; i < capitalizeFLetters.length; i++) {
      const capitalizeFLetter = capitalizeFLetters[i];
      let string = $(capitalizeFLetter).text();

      $(capitalizeFLetter).text(
        string[0].toUpperCase() + string.slice(1).toLowerCase()
      );
    }
  }

  function loadQuestion() {
    const appId = $(".slick-active .app-id").val();
    const index = $(".slick-active .index").val();
    const status = parseInt($(".slick-active .status").val());
    if (appId && !status) {
      startLoad();
      $.ajax({
        method: "GET",
        url: `/question/${appId}/${index}`
      })
        .done(function(html) {
          $(".slick-active .wrap-form").html(html);
          endLoad();

          $(".slick-active .status").val(1);
          appTimer();
          // capitalizeFLetter();
        })
        .fail(err => {
          endLoad();
          setTimeout(() => {
            $("#errorModal").modal("show");
          }, 800);
        });
    }
    // else {
    //   const appForms = $(".slider-item form").not(".main-form");

    //   const invalidApps = [];
    //   for (let i = 0; i < appForms.length; i++) {
    //     const appForm = appForms[i];

    //     const predictionLevel = $(appForm).attr("predictionLevel");
    //     const appId = $(appForm).attr("appId");
    //     const indexQuestion = $(appForm).attr("indexQuestion");
    //     const selectedLevel = $(appForm)
    //       .find(".final-question:checked")
    //       .val();

    //     if (predictionLevel != selectedLevel) {
    //       invalidApps.push({
    //         appId,
    //         selectedLevel,
    //         indexQuestion
    //       });
    //     }
    //   }

    //   startLoad();
    //   $.ajax({
    //     method: "POST",
    //     url: "/question/app-invalid",
    //     data: {
    //       data: JSON.stringify(invalidApps)
    //     }
    //   })
    //     .done(function(html) {
    //       $(".wrap-comments-data").html(html);
    //       endLoad();
    //       // change height
    //       $(".slick-slide").css(
    //         "height",
    //         $(".slick-active form").height() + 20 + "px"
    //       );
    //     })
    //     .fail(err => {
    //       endLoad();
    //       setTimeout(() => {
    //         $("#errorModal").modal("show");
    //       }, 800);
    //     });
    // }
  }

  // setTimeout(function() {
  //   $("#errorModal").modal({ backdrop: "static", keyboard: false });
  //   $("#errorModal").modal("hide");
  // }, 200);
  $("#errorModal #btn-err").click(function() {
    $("#errorModal").modal("hide");
    loadQuestion();
  });

  function appTimer() {
    $(".slick-active .colec-data").hide();
    $(".slick-active .comments-data-judgement").hide();
    $(".login100-form-btn").hide();
    // const timeBaseOnDesc =
    //   $(".slick-active form").attr("descLength") <= 500 ? 40000 : 60000;
    const timeBaseOnDesc = 0;
    // change height
    $(".slick-slide").css(
      "height",
      $(".slick-active form").height() + 20 + "px"
    );
    // show collect
    setTimeout(() => {
      $(".slick-active .colec-data").show();
      // change height
      $(".slick-slide").css(
        "height",
        $(".slick-active form").height() + 20 + "px"
      );
    }, 0);
    // show comment
    setTimeout(() => {
      $(".slick-active .comments-data-judgement").show();
      $(".login100-form-btn").show();
      // change height
      $(".slick-slide").css(
        "height",
        $(".slick-active form").height() + 20 + "px"
      );
    }, 60000);
  }
  // radio change
  $("body").on("change", ".final-question", function() {
    const value = $(this).val();
    let text = "";

    switch (value) {
      case "1": {
        text = "Very Low";
        break;
      }
      case "2": {
        text = "Low";
        break;
      }
      case "3": {
        text = "Neutral";
        break;
      }
      case "4": {
        text = "High";
        break;
      }
      case "5": {
        text = "Very High";
        break;
      }
    }
    $(this)
      .parents(".comments-data-judgement")
      .find(".wrap-comment-final")
      .show();

    $(this)
      .parents(".comments-data-judgement")
      .find(".awnser-filnal")
      .text(text);

    $(".slick-slide").css(
      "height",
      $(".slick-active form").height() + 20 + "px"
    );
  });
})(jQuery);
