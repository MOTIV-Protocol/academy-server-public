//= require active_admin/base
//= require active_material
$(document).ready(function () {
  if ($(".inputs.has_many_fields").length >= 0) {
    $(".inputs.has_many_fields input").on('change', function () {
      readImage(this)
    })
  }
  
  // 생성, 수정때 값 대체해줌
  $("input[name=commit]").on('click', function(){
    $("#event_content[name='event[content]']").val(
      $("iframe").contents().find(".note-editable").html()
    );
  });

  // $("#edit_machine").on('submit', function(e){
  //   if(confirm()){
  //     console.log("--")
  //   }else{
  //     e.preventDefault();
  //   }
  // });
  // $("#edit_machine #machine_submit_action input").off('submit').on('click', function(){
  //   console.log("submit 꺼져라")
  // })
});

function readImage(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $(input).next().children().attr('src', e.target.result)//("<img src='" + e.target.result + "' style='width: 50%;'>");
    };
    reader.readAsDataURL(input.files[0]);
  }
}
