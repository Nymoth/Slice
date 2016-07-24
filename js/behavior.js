$(function() {

  // Advanced filter

  var columns = {
    _default: {
      name: 'Choose a filter'
    },
    comments: {
      type: 'number',
      name: 'Comments'
    },
    usergroup: {
      type: 'list',
      values: [{
        name: 'ACL',
        options: ['Registered user', 'Moderator', 'Super-user']
      }, {
        name: 'Secondary',
        options: ['Alea', 'Iacta', 'Est']
      }],
      name: 'Usergroup'
    },
    registration_date: {
      type: 'date',
      name: 'Registration date'
    },
    last_login: {
      type: 'date',
      name: 'Last login'
    },
    last_comment: {
      type: 'date',
      name: 'Last comment'
    },
  };


  function choose_filter() {
    var $this = $(this),
        column = $this.val(),
        row = $this.parent().data('row');

    $this.parent().children().not('.filter, .current, .options').remove();

    if (columns.hasOwnProperty(column)) {
      render_filter_row($this, columns[column], row);
    } else {
      remove_filter(row, true);
    }
  }

  function render_filter_row(seed_select, column, row) {
    switch (column.type) {
      case 'number':

        var comparator = $('<select class="comparator">');
        comparator.append('<option value="gt">is greater than</option>')
                  .append('<option value="eq">is equal to</option>')
                  .append('<option value="lt">is lower than</option>')
                  .insertAfter(seed_select.parent().find('.cool'));

        comparator.makeCool();

        var number = $('<input type="number">');
        number.insertAfter(comparator.parent().find('.cool.comparator'))
              .change(function() { render_filter_tag(column.name, row); });

        break;
      case 'list':

        var multiple = $('<select multiple class="multiple">');

        column.values.map(function(value) {
          var group = $('<optgroup label="' + value.name + '">');
          value.options.map(function(option) {
            group.append('<option value="' + option.toLowerCase().replace(/ /, '-') + '">' + option + '</option>');
          });
          multiple.append(group);
        });

        multiple.insertAfter(seed_select.parent().find('.cool'))
                .change(function() { render_filter_tag(column.name, row); })
                .makeCool();

        break;
      case 'date':

        var comparator = $('<select class="comparator">');
        comparator.append('<option value="before">before</option>')
                  .append('<option value="after">after</option>')
                  .append('<option value="on">on</option>')
                  .insertAfter(seed_select.parent().find('.cool'))
                  .makeCool();

        var date = $('<input type="date">');
        date.insertAfter(comparator.parent().find('.cool.comparator'))
            .val(new Date().toISOString().substr(0, 10))
            .change(function() { render_filter_tag(column.name, row); })
            .makeCool();

        break;
    }
  }

  function add_filter() {

    var row = $('#filters').children().length;

    var filter_row = $('<div data-row="' + row + '" class="filter-row">');
    filter_row.appendTo('#filters');

    var filter = $('<select class="filter">');
    Object.keys(columns).map(function(column_name) {
      var column = columns[column_name],
          value = (column.hasOwnProperty('type') ? column_name : '0');

      filter.append('<option value="' + value + '">' + column.name + '</option>');
    });

    filter.change(choose_filter)
          .appendTo(filter_row)
          .makeCool();
  }

  function render_filter_tag(name, row) {

    $('#filter-tag-' + row).remove();

    var tag = $('<div>')
        .addClass('tag')
        .attr('id', 'filter-tag-' + row)
        .data('row', row)
        .append(
          $('<div>')
            .append(name)
            .click(function() { remove_filter(row) })
        );

    if (row > 0 && $('.filter-row[data-row="' + row + '"] .close').length === 0) {
      var red_cross = $('<button class="close">')
          .click(function() { remove_filter(row) });

      $('.filter-row[data-row="' + row + '"]').append(red_cross);
    }

    $('#tags').append(tag);
    $('#clear-tags').show();
  }

  function remove_filter(row, _only_tag) {
    var only_tag = _only_tag || false;

    if (!only_tag) {
      if (row > 0) {
        $('.filter-row[data-row="' + row + '"]').remove();
      } else {
        $('.filter-row[data-row="' + row + '"]').find('.filter').val(0).change();
      }
    }

    $('#filter-tag-' + row).remove();
    if ($('#tags').children().length === 0) {
      $('#clear-tags').hide();
    }
  }

  function remove_all_filters() {
    $('#tags').children().map(function() {
      remove_filter($(this).data('row'));
    });
  }

  // Table
  $('#results table thead input[type="checkbox"]').change(function() {
    if ($(this).prop('checked')) {
      $('#results table tbody tr')
        .addClass('selected')
        .find('input[type="checkbox"]').prop('checked', true);
      $('#table-controls').show();
    } else {
      $('table tbody tr')
        .removeClass('selected')
        .find('input[type="checkbox"]').prop('checked', false);
      $('#table-controls').hide();
    }
  });

  $('#results table tbody tr').click(function() {
    var $this = $(this);
    $this
      .toggleClass('selected')
      .find('input[type="checkbox"]').prop('checked', $this.hasClass('selected'));

    var selected_rows = $('#results table .selected').length;
    if (selected_rows > 0) {
      $('#table-controls').show();
    } else {
      $('#table-controls').hide();
    }

    $('#results table thead input[type="checkbox"]').prop('checked', selected_rows === $('#results table tbody tr').length);
  });

  // onload

  $('select').each(function() {
    $(this).makeCool(/*!$(this).hasClass('filter')*/);
  });
  $('.filter').change(choose_filter);
  $('#add-filter').click(add_filter);
  $('#clear-tags').click(remove_all_filters);
  $('html').click(function() {
    $('.cool').removeClass('open');
  });
});
