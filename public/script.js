$(document).ready(function() {
  $("#btn1").click(function() {
    $.get("/form1", function(data) {
      $("#conteudo").replaceWith(data);
    });
  });

  $("#btn2").click(function() {
    $.get("/form2", function(data) {
      $("#conteudo").replaceWith(data);
    });
  });

  $("#btn3").click(function() {
    $.get("/retirada", function(data) {
      $("#conteudo").replaceWith(data);
    });
  });
});
