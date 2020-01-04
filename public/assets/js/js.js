// When you click on the comment button
$(document).on("click", ".articleComments", function() {
  // Capture our article ID
  let articleID = $(this).attr("data-id");
  console.log(articleID);
  // Apply ID to our comment submit button
  $("button.comment-submit").attr("data-id", articleID);

  // Show the modal
  $("#commentModal").addClass("show");

  $.ajax({
    method: "GET",
    url: "/comments/" + articleID
  }).then(function(data) {
    // Set title for modal
    $("#commentHeader").text("Comments for " + data.title);

    // Fill with comments
    if (data.comments) {
      $("#commentsModalBody").empty();

      data.comments.forEach(function(comment) {
        let newRow = `<tr data-rowid="${comment._id}"><th class="comment-text comment-name">${comment.commentName}</th><td class="comment-text comment-body">${comment.commentBody}</td><td class="comment-text"><button class="delete-button" data-commentid="${comment._id}"><b>X</b></button></td></tr>`;

        $("#commentsModalBody").prepend(newRow);
      });
    }
  });
});

// When you click the delete button
$(document).on("click", ".delete-button", function() {
  // Get the unique comment ID
  let commentID = $(this).data("commentid");

  $.ajax({
    method: "DELETE",
    url: "/comments/" + commentID
  });

  $(this)
    .parent()
    .parent()
    .remove();
});

// When you click to submit a comment
$(document).on("click", ".comment-submit", function() {
  // Capture our article ID
  let articleID = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/comments/" + articleID,
    data: {
      commentName: $("#nameField")
        .val()
        .trim(),
      commentBody: $("#bodyField")
        .val()
        .trim(),
      article: articleID
    }
  })
    .then(function() {
      $("#commentName").val("");
      $("#commentBody").val("");
      $("#commentModal").modal("hide");
      location.reload();
    })
    .catch(function(err) {
      console.log(err);
    });
});

// When you click on the comment-view button
$(document).on("click", ".comment-view", function() {
  // Capture our article ID
  let articleID = $(this).attr("data-id");
  console.log(articleID);
  // Apply ID to our comment submit button
  $(".comment-view-close").attr("data-id", articleID);

  // Show the comment view modal
  $("#modal-comment-view").addClass("show");

  $.ajax({
    method: "GET",
    url: "/comments/" + articleID
  }).then(function(data) {
    // Set title for modal
    $("#modal-comment-view-head").text("Comments for " + data.title);

    // Fill with comments
    if (data.comments) {
      $("#modal-comment-view-body").empty();

      data.comments.forEach(function(comment) {
        let newRow = `<tr data-rowid="${comment._id}"><th class="comment-text comment-name">${comment.commentName}</th><td class="comment-text comment-body">${comment.commentBody}</td><td class="comment-text"><button class="delete-button" data-commentid="${comment._id}"><b>X</b></button></td></tr>`;

        $("#modal-comment-view-body").prepend(newRow);
      });
    }
  });
});

//close the comments view
$(document).on("click", ".comment-view-close", function() {
  // $("button.comment-view-close").removeAttr("data-id", articleID);
  $("#modal-comment-view").removeClass("show");
});

// When you click the delete button
$(document).on("click", ".delete-button", function() {
  // Get the unique comment ID
  let commentID = $(this).data("commentid");

  $.ajax({
    method: "DELETE",
    url: "/comments/" + commentID
  });

  $(this)
    .parent()
    .parent()
    .remove();
});

// When you click the update button
$(document).on("click", ".updateButton", function() {
  $.ajax({
    method: "GET",
    url: "/scrape"
  }).then(function() {
    setTimeout(function() {
      location.reload();
    }, 2000);
  });
});

