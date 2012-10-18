Backbone.Django = {};
Backbone.Django.Utils = {};

Backbone.Django.Utils.json_to_bb_json = function (json){
    var final = [];
    _.each(json, function(item){
        var data = item.fields;
        if (item['pk']){
            data['id'] = item.pk;
        }
        final.push(data);
    });
    return final;
}

Backbone.Django.RestModel = Backbone.Model.extend({
    url: function() {
        var base = Backbone.Model.prototype.url.call( this );
        if (this.id !== undefined){
            base += '/';
        }
        return base;
    }
});

Backbone.Django.RestCollection = Backbone.Collection.extend({
    reset : function(attrs, options){
        var final = Backbone.Django.Utils.json_to_bb_json(attrs);
        return Backbone.Collection.prototype.reset.apply(this, [final, options]);
    }
});

Backbone.Django.RestFormView =  Backbone.View.extend({
    /*
    item es un Model y form_wrapper un div que contenga un form con los campos
    */
    itemToForm : function(item, form_wrapper){
        var rendered = $(form_wrapper);
        _(item.toJSON()).each(function(value, field){
            var input = rendered.find('input[name='+field+'],select[name='+field+']');
            if (input.length > 0){
                input.val(value);
            }else if (field == "id"){
                rendered.find('form').append('<input type="hidden" name="id" value="'+value+'"></input>');
            }
        });
        return rendered;
    },
    jsonErrorsToForm: function(json){
        _.each(json, function(v,k){
            var input = this.$('input[name="'+k+'"]');
            input.next('.help-inline').remove();
            input.after('<span class="help-inline">'+v+'</span>');
        });
    }
    
});
