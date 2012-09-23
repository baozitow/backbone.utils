Backbone.Cascade = {};
Backbone.Cascade.Model = {}
Backbone.Cascade.Collection = {}
Backbone.Cascade.View = {}
Backbone.Cascade.Model.Option = Backbone.Model.extend({
});
Backbone.Cascade.Collection.Select = Backbone.Collection.extend({
    model: Backbone.Cascade.Model.Option,
    url: function(){
        var fin = this.urlRoot
        if (this.parentId){
            fin = fin + this.parentId + '/';
        }
        return fin;
    },
    initialize: function(options){
        this.urlRoot = options.urlRoot;
        if (options.urlRoot.match(/0\/$/)){
            var u = options.urlRoot;
            this.urlRoot = u.substring(0,u.length -2);
        }
    },
    setParentId: function(id){
        this.parentId = id
    }
});
Backbone.Cascade.View.Select = Backbone.View.extend({
    events: {
        'change': 'comboChanged'
    },
    initialize: function(){
        this.collection.on('reset', this.render, this);
        if (this.options.parentSelectView){
            this.options.parentSelectView.on('change', this.update, this);
        }
    },
    comboChanged: function(e){
        this.trigger('change', this);
    },
    update: function(){
        var parentId = this.options.parentSelectView.$el.val();
        if (parentId){
            this.collection.setParentId(this.options.parentSelectView.$el.val());
            this.collection.fetch();
        }else{
            this.collection.reset();
        }
    },
    render: function(){
        var rendered = ''
        this.collection.each(function(item){
            rendered += '<option value="'+item.get('id')+'">'+item.get('nombre')+'</option>';
        });
        this.$el.html(rendered);
        this.comboChanged();
    }
});
