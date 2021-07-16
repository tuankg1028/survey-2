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
      $(".slick-active form").height() + 50 + "px"
    );
  });

  let timeNext = {};
  $("body").on("click", ".see-next-btn", function() {
    const appId = $(".slick-active .app-id").val();
    if (!timeNext[appId]) timeNext[appId] = 1;

    let currentSection = $(".slick-active .section")[timeNext[appId]];
    $(currentSection).css("display", "inline");
    timeNext[appId]++;

    // check next section next
    let nextSection = $(".slick-active .section")[timeNext[appId]];
    if (!nextSection) {
      $(this).css("display", "none");
      $(".slick-active form").attr("isLastSection", true);
      showNextButton();
    }

    // change height
    $(".slick-slide").css(
      "height",
      $(".slick-active form").height() + 50 + "px"
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
        $(".slick-active form").height() + 50 + "px"
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

  // $(".wrap-forms").slick({
  //   dots: false,
  //   infinite: false,
  //   speed: 500,
  //   arrows: true,
  //   autoplay: false,
  //   draggable: false,
  //   swipe: false,
  //   // adaptiveHeight: true,
  //   prevArrow:
  //     "<div class='wrap-btn-pre'> <button class='login100-form-btn button-pre'>Back</button> </div>",
  //   nextArrow:
  //     "<div class='wrap-btn-next'> <button class='login100-form-btn button-next'>Next</button> </div>",
  //     slidesToScroll: 1
  // });

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
      $(".slick-active form").height() + 50 + "px"
    );
  });

  function showInstallationQuestion() {
    const value = Number(
      $(".slick-active .predict-question[type='radio']:checked").val()
    );
    const ourPrediction = Number(
      $(".slick-active input[name='our-prediction']").val()
    );
    const installtionAnswer = $(
      ".slick-active input[name='answer-installation']"
    ).val();

    if (value == 1) {
      $(".slick-active .question-installed").remove();
      $(".slick-active input[name='answer-installation']").val("");
    } else if (value == 0) {
      // check elememnt existed
      if (!$(".slick-active .question-installed").length) {
        const appId = $(".slick-active form").attr("appId");
        $(".slick-active .predict-question[type='radio']")
          .parents(".question-1")
          .append(
            `
          <div class="question-1 mt-2 question-installed">
            <div class="title font-weight-bold">6. Do you want to install this application? Please select the following options:</div>
            <!-- anwsers-->
            <div class="anwsers mt-2">
                ${
                  ourPrediction == 1
                    ? ""
                    : `<label class="container-radio">Yes<input class="final-question" type="radio" name="questions[${appId}][install]" value="1" required="required" ${
                        installtionAnswer == 1 ? "checked" : ""
                      } ><span class="checkmark"></span></label>`
                }
                ${
                  ourPrediction == 0
                    ? ""
                    : `<label class="container-radio">No<input class="final-question" type="radio" name="questions[${appId}][install]" value="0" required="required" ${
                        installtionAnswer == 0 && installtionAnswer !== ""
                          ? "checked"
                          : ""
                      } ><span class="checkmark"></span></label>`
                }
                ${
                  ourPrediction == 2
                    ? ""
                    : `<label class="container-radio">Maybe<input class="final-question" type="radio" name="questions[${appId}][install]" value="2" required="required" ${
                        installtionAnswer == 2 ? "checked" : ""
                      } ><span class="checkmark"></span></label>`
                }
            </div>
          </div>
          `
          );
      }
    }
  }
  // install-question
  $("body").on(
    "change",
    ".slick-active .predict-question[type='radio']",
    function() {
      showInstallationQuestion();
      refreshHeight();
    }
  );

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
  // handle click on final question button
  $("#final-question-button").click(() => {
    const isValid = $("form#final-question")[0].checkValidity();
    if (isValid) {
      const value = $("input[name='satisfaction']:checked").val();
      const comment = $("textarea[name='final-comment']").val();

      $(".slick-active form .final-question-in-form").attr("value", value);
      $(".slick-active form .final-question-in-form.question-comment").attr(
        "value",
        comment
      );

      $("#finalQuestion").modal("hide");
      $(".wrap-btn-next").trigger("click");
    } else {
      $("form#final-question button[type='submit']").click();
    }
  });
  function showNextButton() {
    const isLastSection = $(".slick-active form").attr("isLastSection");
    const isAnswered = $(".slick-active form").attr("isAnswered");

    if (isAnswered || isLastSection)
      $(".wrap-btn-next .button-next").css("visibility", "visible");
    else $(".wrap-btn-next .button-next").css("visibility", "hidden");
  }
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
      // show next button on slider
      showNextButton();
      return;
    }

    // next
    const isValid = $(".slick-active form")[0].checkValidity();
    const indexQuestion = $(".slick-active form").attr("indexQuestion");
    const valueOfFinalQuestion = $(
      ".slick-active form .final-question-in-form"
    ).attr("value");
    if (isValid) {
      // show modal to confirm final question
      if (
        (indexQuestion == 14 || indexQuestion == 18 || indexQuestion == 22) &&
        valueOfFinalQuestion === undefined
      ) {
        $("#finalQuestion").modal("show");
        $("input[name=satisfaction]").prop("checked", false);
        $("textarea[name='final-comment']").prop("value", "");

        $(".slick-active form .slick-active form").val("");
      } else {
        const data = Qs.parse($(".slick-active form").serialize());
        const token = $("input[name='token']").val();
        $.ajax({
          url: "/handle-questions",
          type: "post",
          data: data,
          headers: { Authorization: token },
          success: function(response) {}
        }).fail(err => {
          alert("Unfortunately something went wrong. Please submit again");
        });

        // marked as answered
        $(".slick-active form").attr("isAnswered", true);
        origSlide(a, b);

        // next
        loadQuestion();
        showNextButton();
      }
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

  function getDescOfApps(indexQuestion) {
    const descs = {
      1: `
      <div>Training phase,</div>
      <div>You read carefully the app description, collected data, collection purposes, and whether your data is shared with third parties of 10 apps in 2 categories (5 apps/category). Then, you make the decision whether you install these apps. You can answer with yes (install), no (non-install), or maybe (maybe install) options.</div>
      `,
      11: `
      <div>The naive prediction system</div>
      <div>According to your feedback in the training phase, the first system generates the answers (i.e., the installation decision) for four target apps. We hope to develop the prediction model based on your feedback in the training phase. You read the app description, personal data requests, collection purposes, share with the third party and the prediction answer. Then, you decide on the system prediction (i.e., satisfied by the taken decision). If the answer is “No”, please provide us with your correct answer. Finally, we ask whether you are satisfied with the system generated answer. You can answer with yes, no, or maybe options.</div>
      `,
      15: `
      <div>The category-based prediction system</div>
      <div>According to your feedback in the training phase, the second system generates the answers (i.e., the installation decision) for four target apps in the same category. We hope to develop the prediction model based on the category of the training apps. You read the app description, personal data requests, collection purposes, share with the third party and the prediction answer. Then, you decide on the system prediction (i.e., satisfied by the taken decision). If the answer is “No”, please provide us with your correct answer. Finally, we ask whether you are satisfied with the system generated answer. You can answer with yes, no, or maybe options.</div>
      `,
      19: `
      <div>The ensemble-based prediction system</div>
      <div>According to your feedback in the training phase, the third system generates the answers (i.e., the installation decision) for four target apps based on the pair of fields (e.g., app name vs category, category vs purpose, category vs the third party, etc.) in the training apps rather than consider only the category. We hope to develop the prediction model based on the relationship of the pair of fields. You read the app description, personal data requests, collection purposes, share with the third party and the prediction answer. Then, you decide on the system prediction (i.e., satisfied by the taken decision). If the answer is “No”, please provide us with your correct answer. Finally, we ask whether you are satisfied with the system generated answer. You can answer with yes, no, or maybe options.</div>
      `
    };
    return descs[indexQuestion];
  }
  function showAppDescription(indexQuestion) {
    $("#descriptionQuestion .modal-body").html(
      `
      <div>${getDescOfApps(indexQuestion)}</div>
      `
    );
    $("#descriptionQuestion").modal("show");
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

          // === SHOW APP DESC ======
          // if (index == 1 || index == 11 || index == 15 || index == 19) {
          //   showAppDescription(index)
          // }
          // show installtion question
          showInstallationQuestion();
          //
          $(".slick-active .status").val(1);
          appTimer();
          // capitalizeFLetter();

          // show next button on slider
          showNextButton();
        })
        .fail(err => {
          endLoad();
          setTimeout(() => {
            $("#errorModal").modal("show");
          }, 800);
        });
    } else if (index == 23) {
      startLoad();
      window.location.href = "/success";
      endLoad();
    }
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

    // change height
    $(".slick-slide").css(
      "height",
      $(".slick-active form").height() + 50 + "px"
    );
    // show collect
    setTimeout(() => {
      $(".slick-active .colec-data").show();
      // change height
      refreshHeight();
    }, 0);
  }

  function refreshHeight() {
    $(".slick-slide").css(
      "height",
      $(".slick-active form").height() + 50 + "px"
    );
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
      $(".slick-active form").height() + 50 + "px"
    );
  });
})(jQuery);
