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
            "url" : ,
            "dataType" : 'json',
            'type' : '',
            'data' : {
               
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
 listDatatable.filter({
     name :  val,
 });
```
