$(document).ready(function() {
  let items = [];
  let itemsRaw = [];

  $.getJSON("/api/books", function(data) {
    //let  items = [];
    itemsRaw = data;
    $.each(data, function(i, val) {
      items.push(
        '<li class="bookItem" style="margin: 5px 0;" id="' +
        i +
        '">' +
        val.title +
        " - " +
        val.commentcount +
        " comments</li>"
      );
      return i !== 14;
    });
    if (items.length >= 15) {
      items.push("<p>...and " + (data.length - 15) + " more!</p>");
    }
    $("<ul/>", {
      class: "listWrapper",
      html: items.join(""),
    }).appendTo("#display");
  });

  let comments = [];
  $("#display").on("click", "li.bookItem", function() {
    $("#detailTitle").html(
      "<b>All comments for " +
      itemsRaw[this.id].title +
      "</b><br> (id: " +
      itemsRaw[this.id]._id +
      ")"
    );
    $.getJSON("/api/books/" + itemsRaw[this.id]._id, function(data) {
      comments = [];
      comments.push("<br>");
      $.each(data.comments, function(i, val) {
        comments.push('<li style="margin: 5px 0;">' + val + "</li>");
      });
      comments.push(
        '<form  class="flex" id="newCommentForm">' +
        '<input type="text" id="commentToAdd" name="comment" placeholder="New Comment">' +
        '<button class="addComment" style="margin: 5px 0; width: 100%;" id="' +
        data._id +
        '">Add Comment</button>' +
        "</form>"
      );
      comments.push(
        '<button class="deleteBook" style="margin: 5px 0; width: 100%;" id="' +
        data._id +
        '">Delete Book</button>'
      );
      $("#detailComments").html(comments.join(""));
    });
  });

  $("#bookDetail").on("click", "button.deleteBook", function() {
    $.ajax({
      url: "/api/books/" + this.id,
      type: "delete",
      success: function(data) {
        //update list
        $("#detailComments").html(
          '<p style="margin: 5px 0;">' + data + "<p><p>Refresh the page</p>"
        );
      },
    });
  });

  $("#bookDetail").on("click", "button.addComment", function() {
    let newComment = $("#commentToAdd").val();
    $.ajax({
      url: "/api/books/" + this.id,
      type: "post",
      dataType: "json",
      data: $("#newCommentForm").serialize(),
      success: function(data) {
        comments.unshift(newComment); //adds new comment to top of list
        $("#detailComments").html(comments.join(""));
      },
    });
  });

  $("#newBook").click(function() {
    $.ajax({
      url: "/api/books",
      type: "post",
      dataType: "json",
      data: $("#newBookForm").serialize(),
      success: function(data) {
        //update list
      },
    });
  });

  $("#deleteAllBooks").click(function() {
    $.ajax({
      url: "/api/books",
      type: "delete",
      dataType: "json",
      data: $("#newBookForm").serialize(),
      success: function(data) {
        //update list
      },
    });
  });
});
