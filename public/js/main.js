// Generated by CoffeeScript 1.3.3
(function() {
  var update_vendor_image_preview, vendor_image_keydown;

  update_vendor_image_preview = function() {
    var el, frame, hideshow, img, imgval;
    el = $(".vendor-image-url input");
    frame = el.closest(".vendor-image-url").find(".vendor-image-preview-frame");
    hideshow = $(".vendor-image-preview");
    imgval = el.val();
    $("#prev-img-btn").removeClass('btn-primary');
    if (imgval === '') {
      return hideshow.addClass('hide');
    } else {
      img = frame.find("img");
      img.attr("src", imgval);
      return hideshow.removeClass('hide');
    }
  };

  vendor_image_keydown = function() {
    if (event.which === 13) {
      update_vendor_image_preview();
      event.preventDefault();
      return false;
    } else {
      return $("#prev-img-btn").addClass('btn-primary');
    }
  };

  $(document).on("click", ".bid .unstar-button, .bid .star-button", function() {
    var action, bid;
    action = $(this).hasClass('unstar-button') ? "0" : "1";
    bid = $(this).closest(".bid");
    return $.ajax({
      url: "/contracts/" + bid.data('contract-id') + "/bids/" + bid.data('bid-id') + "/star",
      data: {
        starred: action
      },
      type: "GET",
      success: function(data) {
        if (data.starred === '0') {
          return bid.find(".star-td").removeClass("starred");
        } else {
          return bid.find(".star-td").addClass("starred");
        }
      }
    });
  });

  $(document).on("click", "a[data-confirm]", function(e) {
    var el;
    e.preventDefault();
    el = $(this);
    if (confirm(el.data('confirm'))) {
      return window.location = el.attr('href');
    }
  });

  $(document).on("click", "#add-deliverable-button", function() {
    return $(".deliverables-row:eq(0)").clone().appendTo(".prices-table tbody").find("input").val("");
  });

  $(document).on("click", ".remove-deliverable", function() {
    if ($(".deliverables-row").length === 1) {
      return $(this).closest('.deliverables-row').find(':input').val('');
    } else {
      return $(this).closest(".deliverables-row").remove();
    }
  });

  $(document).on("click", ".show-dismiss-modal", function() {
    var el, modal;
    el = $(this);
    modal = $("#dismiss-modal");
    modal.find(".company-name").text(el.data('vendor-company-name'));
    modal.find("textarea").val("");
    modal.find("button").button('reset');
    modal.modal('show');
    modal.off(".rfpez-dismiss");
    return modal.on("submit.rfpez-dismiss", "form", function(e) {
      e.preventDefault();
      $(this).find("button").button('loading');
      return $.ajax({
        url: "/contracts/" + el.data('contract-id') + "/bids/" + el.data('bid-id') + "/dismiss",
        data: {
          reason: modal.find("select[name=reason]").val(),
          explanation: modal.find("textarea[name=explanation]").val()
        },
        type: "GET",
        success: function(data) {
          if (data.status === "already dismissed" || "success") {
            modal.modal('hide');
            if (el.data('remove-from-list')) {
              return el.closest("." + el.data('remove-from-list')).remove();
            } else {
              return window.location.reload();
            }
          }
        }
      });
    });
  });

  $(document).on("submit", "#ask-question-form", function(e) {
    var button, el, question_text;
    e.preventDefault();
    el = $(this);
    question_text = el.find("textarea[name=question]").val();
    if (!question_text) {
      return;
    }
    button = el.find("button");
    button.button('loading');
    return $.ajax({
      url: "/questions",
      data: {
        contract_id: el.find("input[name=contract_id]").val(),
        question: question_text
      },
      type: "POST",
      success: function(data) {
        var new_question;
        button.button('reset');
        el.find("textarea[name=question]").val('');
        if (data.status === "success") {
          new_question = $(data.html);
          new_question.hide();
          $(".questions").append(new_question);
          return new_question.fadeIn(300);
        } else {
          return alert('error!');
        }
      }
    });
  });

  $(document).on("blur", ".vendor-image-url input", update_vendor_image_preview);

  $(document).on("keydown", ".vendor-image-url input", vendor_image_keydown);

  $(document).on("click", ".answer-question-toggle", function() {
    var el, form, question;
    el = $(this);
    question = $(this).closest(".question-wrapper");
    form = $("#answer-question-form");
    form.find("input[name=id]").val(question.data('id'));
    form.find("textarea[name=answer]").val('');
    form.appendTo(question);
    return form.show();
  });

  $(document).on("submit", "#new-contract-form", function(e) {
    if (!$(this).find('input[name=solnbr]').val()) {
      return e.preventDefault();
    }
    return $(this).find("button[type=submit]").button('loading');
  });

  $(document).on("submit", "#answer-question-form", function(e) {
    var answer_text, el, question;
    e.preventDefault();
    el = $(this);
    answer_text = el.find("textarea[name=answer]").val();
    if (!answer_text) {
      return;
    }
    el.find("button").button('loading');
    question = el.closest(".question-wrapper");
    return $.ajax({
      url: el.attr('action'),
      type: "post",
      data: {
        id: el.find("input[name=id]").val(),
        answer: answer_text
      },
      success: function(data) {
        var new_question;
        if (data.status === "success") {
          el.hide();
          el.find("button").button('reset');
          el.prependTo('body');
          question.find(".answer-question").remove();
          new_question = $(data.html);
          new_question.find(".answer").hide();
          question.replaceWith(new_question);
          return new_question.find(".answer").fadeIn(300);
        } else {
          return alert('error');
        }
      }
    });
  });

  $(function() {
    return update_vendor_image_preview();
  });

}).call(this);
