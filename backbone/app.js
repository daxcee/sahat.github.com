var Todo = Backbone.Model.extend({
  defaults: {
    title: 'empty title',
    completed: false
  },
  initialize: function () {
    this.on('change', function () {
       console.log('model has been changed!');
    });
    this.on('change:title', function () {
      console.log('title has been changed!');
    });

    this.on('error', function (model, error) {
       console.log(error);
    });

    console.log('The model has been initialized');

  },
  validate: function (attrs) {
    if (attrs.title === undefined) {
      return 'Title must be set first.'
    }
  },
  setTitle: function (new_title) {
    this.set({ title: new_title })
  }
});