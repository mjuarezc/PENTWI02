$(document).ready(function() {
    var apiURL = 'https://api.fixer.io/';
    var date = '2017-12-30';
    var base = 'USD';
    var date_input = $('#currency-date');
    date_input.val(date);
    var options={
        format: 'yyyy-mm-dd',
        todayHighlight: true,
        autoclose: true,
    };
    date_input.datepicker(options);
    $('#example').DataTable({
        "columnDefs": [ {
            "targets": -1,
            "data": null,
            "render": function ( data, type, row, meta ) {
                return '<button type="button" name="edit" class="btn btn-default" > <span class="glyphicon glyphicon-pencil"></span> </button>'+
                    '<button type="button" name="delete" class="btn btn-danger" > <span class="glyphicon glyphicon-trash"></span> </button>'
                    ;
            }
        } ]
    });
    createTable(apiURL, date, base);

    $('#currency-base, #currency-date').change(function (event) {
        console.log(event);
        var base = $('#currency-base').val();
        var date = $('#currency-date').val();
        if(base && date) {
            createTable(apiURL,date,base)
        } else {
            alert('Verify input data');
        }
    });
} );

function createTable(url, date, base) {
    var table = $('#example').DataTable();
    table.clear();
    $.get(url + date,{base : base })
        .done(function (data) {
            for(var rate in data.rates) {
                table.row.add( [
                    data.date,
                    data.base,
                    rate,
                    data.rates[rate],
                    ''
                ] ).draw( false );
            }
            $(':button[name="delete"]').click(function() {
                table.row( $(this).parents('tr') ).remove().draw();
            } );

            $(':button[name="edit"]').click(function() {
                var row = table.row( $(this).parents('tr') );
                console.log(row);
                var data = row.data();
                $('#date-form').val(data[0]);
                $('#base-form').val(data[1]);
                $('#currency-form').val(data[2]);
                $('#value-form').val(data[3]);
                $('#modal').modal('show').submit(function (event) {
                    event.preventDefault();
                    data[0]=$('#date-form').val();
                    data[1]=$('#base-form').val();
                    data[2]=$('#currency-form').val();
                    data[3]=$('#value-form').val();
                    console.log(data);
                    row.data(data).draw();
                    $('#modal').modal('hide');
                });
            } );

        }).fail(function (err) {
        console.log(err);
    });
}