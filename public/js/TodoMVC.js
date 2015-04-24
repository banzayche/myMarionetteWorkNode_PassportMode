/*global Backbone */
'use strict';

// Создаем конструктор нашего проложения
var App = Backbone.Marionette.Application.extend({
  // приложение должно иметь рутовый шаблон
  setRootLayout: function(){
    // Основе созданного нами конструктора рутового представления в файле MyApp.Layout.js
    // создаем рутовое (главное) представление для нашего приложения 
    this.root = new MyApp.AppStaticLayout.GeneralView();
  },

  onStart: function(){
    // прорисовываем главныое рутовое представление
    MyApp.setRootLayout();
    // стартуем бекбон хистори для роутов
    Backbone.history.start({pushState: true});
    this.TodoCollection = new MyApp.Todos.TodoCollection();
  },
});
// Сделали наше приложение глобальным
window.MyApp = new App();

// создаем анонимную функцию, в которой укажем:
// обработчик для спец запроса и модель, содержащую значение для фильтрации коллекции
(function(){
  // модель со значением фильтрации
  var filterState = new Backbone.Model({
    filter: 'all',
    generalInput: true
  });

  // обработчик запроса 
  MyApp.reqres.setHandler('filterState', function(){
    return filterState;
  });
})();

