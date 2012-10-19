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

/*Requiere bootbox para el renderizado*/
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
    /*Errores que devuelve django en formato json, los asignamos a los campos*/
    jsonErrorsToForm: function(json){
        _.each(json, function(v,k){
            var input = this.$('input[name="'+k+'"]');
            input.next('.help-inline').remove();
            input.after('<span class="help-inline">'+v+'</span>');
        });
    },
    render : function(item) {
        var self = this;
        this.item = item;
        var rendered = this.template(item);
        if (item !== undefined){
            rendered = this.itemToForm(item, rendered);
        }
        this.box = bootbox.dialog(rendered, [{
            "Cancelar": function() {
                return true;
            },
        }, {
            "Guardar": function() {
                //Tenemos que poner el elemento de la vista aquí porque
                //hasta ahora no existe el elemento
                self.setElement($('.modal-body').children(":first"));
                self.save();
                return false;
            }
        }]);
    },
    save: function(){
        var self = this;
        var data = Backbone.Syphon.serialize(this);
        options = {
            wait: true,
            error: function(model, response){
                if (response.status == 400){
                    var json = $.parseJSON(response.responseText);
                    self.jsonErrorsToForm(json);
                }else{
                    bootbox.alert("Error "+response.status);
                    self.box.modal('hide');
                }
            },
            success: function(model, response){

                if (response && response[0]){
                    model.set("id", response[0].pk);
                }
                //TODO Hay que coger el id del objeto creado
                self.box.modal('hide');
            }
        };
        
        if (!this.item){
            this.collection.create(data, options);
        }else{
            this.item.save(data, options);
        }
    }
});
