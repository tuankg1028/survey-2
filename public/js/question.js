(function($) {
  "use strict";
  $("body").on("click", ".see-less-btn", function() {
    $(this)
      .parent()
      .find(".see-more-btn")
      .click();
  });
  $("body").on("change", ".satisfaction-question[type='radio']", function() {
    const value = Number($(this).val());

    if (value == 1) {
      $(".comment-box").hide();
      $(".comment-box textarea").attr("required", false);
    } else {
      $(".comment-box").show();
      $(".comment-box textarea").attr("required", true);
    }
  });
  // install-question
  $("body").on(
    "change",
    ".wrap-question .predict-question[type='radio']",
    function() {
      const parent = $(this).parents(".wrap-question");

      const ourPrediction = Number(parent.find("input.our-prediction").val());
      const installtionAnswer = parent
        .find("input[name='answer-installation']")
        .val();

      const value = Number($(this).val());
      if (value == 1) {
        parent.find(".question-installed").remove();
        parent.find("input[name='answer-installation']").val("");
      } else if (value == 0) {
        // check elememnt existed
        if (!parent.find(".question-installed").length) {
          const appId = parent.attr("questionId");
          $(this)
            .parents(".question-1")
            .append(
              `
            <div class="question-1 mt-2 question-installed">
              <div class="title font-weight-bold">Do you want to install this application? Please select the following options:</div>
              <!-- anwsers-->
              <div class="anwsers mt-2">
                  ${
                    ourPrediction == 1
                      ? ""
                      : `<label class="container-radio">Yes (Without restriction)<input class="final-question" type="radio" name="questions[${appId}][install]" value="1" required="required" ${
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
                      : `<label class="container-radio">With restriction<input class="final-question" type="radio" name="questions[${appId}][install]" value="2" required="required" ${
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
  );
})(jQuery);
