```html
<div class="data-list">
   <div class="list"></div>
</div>
```

```javascript
var listDatatable = $('.data-list').DataTableToList({
        length: 10,
        search: true,
        container: '.list',
        ajax: {
            "url" : "{{ route('guru.pengajuan_bantuan.data_index') }}",
            "dataType" : 'json',
            'type' : 'POST',
            'data' : {
            _token : '{{ csrf_token() }}',
            tahun :  $('#tahun_mobile').val(),
            kategori_bantuan : $('#kategori_bantuan_mobile').val(),
        }
        },
        columns: [
                //columns datatable
            ],
        templateHtml: function (response) {
            let html = '';
            $.map(response.data, function (v, i) {
                //template list
                html += `
                `;
            });
            html += ``;
            return html;
        },
        debug: false,
    });

//filter
$('#cari-filter-mobile').click(function () {
    listDatatable.filter({
        name :  val,
    });
});
```
