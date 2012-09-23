backbone.utils
==============

Libraries with helpers and plugins to use with backbone.js


backbone-cascade.js
-------------------

Library to link multiple select box

```javascript
this.collectionLigas = new Backbone.Cascade.Collection.Select({
    urlRoot: '...'
});
this.collectionDivisiones = new Backbone.Cascade.Collection.Select({
    urlRoot: '...'
});
this.collectionGrupos = new Backbone.Cascade.Collection.Select({
    urlRoot: '...'
});
this.selectLigas = new Backbone.Cascade.View.Select({
    el: $('select[name="liga"]'),
    collection: this.collectionLigas
});
this.selectDivision = new Backbone.Cascade.View.Select({
    el: $('select[name="division"]'),
    collection: this.collectionDivisiones,
    parentSelectView: this.selectLigas
});
this.selectGrupo = new Backbone.Cascade.View.Select({
    el: $('select[name="grupo"]'),
    collection: this.collectionGrupos,
    parentSelectView: this.selectDivision
});
this.collectionLigas.fetch();
```
