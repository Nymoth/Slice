(function ($) {

  $.fn.makeCool = function(/*_wrapper*/) {

    var _this = this
        //wrapper = _wrapper || false,
        type = _this[0].type,
        className = _this[0].className,
        currentValue = _this.val(),
        $sb = $('<div class="cool ' + type + '">')
          .addClass(className)
          .click(function(evt) {
            evt.stopPropagation();
            $(this).toggleClass('open');
          });

    if (type === 'select-one') {

      var caption = '';

      var current = $('<div class="current">');

      var options = $('<div class="options">');

      _this.find('option').map(function() {
        var value = $(this).attr('value'),
            name = $(this).text();

        if (value !== '0') {
          var option = $('<div class="option">')
              .append(name)
              .click(function() {
                _this.val(value).change();
              });
        }

        if (currentValue === value) {
          caption = '<span' + (value === '0' ? ' class="default"' : '') + '>' + name + '</span>';
        }

        options.append(option);
      });

      current.append(caption);

      _this.change(function() {
        var value = _this.val(),
            name = _this.find('option[value=' + value + ']').text();

        _this.next('.cool').find('.current').html('<span' + (value === '0' ? ' class="default"' : '') + '>' + name + '</span>');
      });
    }

    if (type === 'select-multiple') {

      var default_value = '<span class="default">Select one or more options</span>';

      var current = $('<div class="current">')
        .append(default_value);

      var options = $('<div class="options">')
        .append(
          $('<div class="select-controls">')
            .append(
              $('<span class="link">')
                .append('Check all')
                .click(function(evt) {
                  evt.stopPropagation();
                  $(this).parent().parent().find('input')
                    .prop('checked', true).change();
                }),
              $('<span class="link">')
                .append('Uncheck all')
                .click(function(evt) {
                  evt.stopPropagation();
                  $(this).parent().parent().find('input')
                    .prop('checked', false).change();
                })
            )
        );

      var groups = _this.find('optgroup').map(function() {
        var group = $('<div class="group">')
          .append($(this).attr('label'));

        $(this).find('option').map(function() {
          var original_opt = $(this),
              option = $('<label class="option">')
                .append(
                  $('<input type="checkbox">')
                    .change(function() {
                      if ($(this).prop('checked')) {
                        $(this).parent().addClass('selected');
                        original_opt.prop('selected', true);
                      } else {
                        $(this).parent().removeClass('selected');
                        original_opt.prop('selected', false);
                      }
                      original_opt.parent().change();
                    }),
                  $(this).text()
                );

            group.append(option);
        });

        options.append(group);
      });

      _this.change(function() {
        var value = $(this).val(),
            placeholder = default_value;

        if (value.length > 0) {
          placeholder = '<span>' + value.map(function(val) {
            return _this.find('option[value="' + val + '"]').text()
          }).join(', ') + '</span>';
        }

        _this.next('.cool').find('.current').html(placeholder);
      });
    }

    if (type === 'date') {

      var current = $('<div class="current">')
        .append('<span class="default">Select a date</span>');

      var options = $('<div class="options">')
        .append('<div id="datepicker">')
        .datepicker({
          showOtherMonths: true,
          selectOtherMonths: true,
          altField: _this,
          altFormat: 'yy-mm-dd',
          dateFormat: 'dd-M-y',
          dayNamesMin: [ 'S', 'M', 'T', 'W', 'T', 'F', 'S' ],
          onSelect: function(date) {
            current.text(date);
            _this.change();
          }
        });

      var afterRender = function() {
        $('.ui-datepicker').click(function(evt) {
          evt.stopPropagation();
        });
      }
    }

    $sb.append(current, options);

    /*
    if (wrapper) {
      var $wrapper = $wrapper = $('<div class="cool-wrapper">').css({
        width: _this.width(),
        height: 30,
        display: 'inline-block',
        position: 'relative'
      });

      $sb.appendTo($wrapper);
      $wrapper.insertAfter(_this);//.prepend(_this);
    } else {
    */
      $sb.insertAfter(_this);
    //}

    typeof afterRender === 'function' && afterRender();

    return _this.hide();
  }

})(jQuery);
