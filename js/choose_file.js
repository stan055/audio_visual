// Choose file
(() => {
  var $fileInput = $('.file-input');
  var $droparea = $('.file-drop-area');

  // highlight drag area
  $fileInput.on('dragenter focus click', function() {
    $droparea.addClass('is-active');
  });
  
  // back to normal state
  $fileInput.on('dragleave blur drop', function() {
    $droparea.removeClass('is-active');
  });
  
  // change inner text
  $fileInput.on('change', function() {
    var $textContainer = $(this).prev();
  
    var fileName = $(this).val().split('\\').pop();
    $textContainer.text(fileName);
  });
});

