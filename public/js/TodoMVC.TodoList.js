/*global Backbone */
'use strict';

MyApp.module('TodoList', function(TodoList, App, Backbone){
	// создаем обьект роут
	TodoList.Router = Marionette.AppRouter.extend({
		// задали роут
		appRoutes: {
			// *route - любое значение роута. Вычисление представления будет происходить в указанной функцие
			'*route': 'LoadApp'
		},
	});

	// создаем контроллер для нашего роута
	TodoList.Controller = Marionette.Controller.extend({
		// создаем коллекцию для наших вьюх
		initialize: function(){
			this.TodoCollection = App.TodoCollection;
		},

		// что будет выполняться при старте
		start: function(){
			// КОСТЫЛЬ
			this.LoadAppFirst();
			// \Костыль

			var self = this;
			// запускаем функцию представления значка загрузки покуда коллекция фетчится
			App.TodoCollection.on('request', function(){
				// console.log('request is happened');				
				self.showLoading();
			});
			// когда все модели удачно синхронизированны с сервером, можно показывать
			App.TodoCollection.on('sync', function(){
				// console.log('sync is happened');
				// псевдо-время загрузки с сервера
				_.delay(function(){
					App.root.getRegion('popup').empty();					
				}, 1000);
			});
			// фетчим нашу коллекцию с сервера
			
			self.TodoCollection.fetch();
		},

		// для самой первой загрузки приложения
		LoadAppFirst: function(){			
			var route = window.location.pathname;			
			// alert(route);
			if(route === '/author_page'){				
				Backbone.history.navigate('/', {replace: false, trigger: false});
				Backbone.history.navigate(route, {replace: false, trigger: true});
			} else{
				if(route === '/' || route === '/all' || route === '/done' || route === '/have_done'){
					Backbone.history.navigate('/', {replace: false, trigger: false});
					Backbone.history.navigate(route, {replace: false, trigger: true});
					this.showAll();
				} else{
					var authorPage = new App.AppStaticLayout.AuthorPage({
						template: '#layout-404'
					});
					this.hideAll();
					App.root.getRegion('header').show(authorPage);
				}
			}			
		},

		showLoading: function(TodoCollection){
			// создали экземпляр загрузки
			var loading = new Backbone.Marionette.ItemView({
				className: 'please-waite',
				template: '#loading-circle',
			});
			// Вставляем наш экземпляр представления loading в регион под названием popup
			App.root.showChildView('popup', loading);
		},

		showHeader: function(TodoCollection){
			// создали экземпляр представления хедера и передали ему коллекцию
			var header = new App.AppStaticLayout.Header({
				collection: TodoCollection,
			});
			// Вставляем наш экземпляр представления header в регион под названием header
			App.root.showChildView('header', header);
		},

		showMain: function(TodoCollection){
			// создали экземпляр представления main и передали ему коллекцию
			var main = new App.TodoList.Views.ListVews({
				collection: TodoCollection,
			});
			// Вставляем наш экземпляр представления main в регион под названием main
			App.root.showChildView('main', main);					
		},

		showFooter: function(TodoCollection){
			// создали экземпляр представления footer и передали ему коллекцию
			var footer = new App.AppStaticLayout.Footer({
				collection: TodoCollection,
			});
			// Вставляем наш экземпляр представления footer в регион под названием footer
			App.root.showChildView('footer', footer);
		},

		// очистка регионов
		hideAll: function(){
			App.root.getRegion('header').empty();
			App.root.getRegion('main').empty();
			App.root.getRegion('footer').empty();
		},

		//general show
		showAll: function(){
			this.showHeader(this.TodoCollection);
			this.showMain(this.TodoCollection);
			this.showFooter(this.TodoCollection);
		},

		// Функция обработки значения роута
		LoadApp: function(route){
			// alert('i am route '+route);
			// изменяем значение фильтра
			MyApp.request('filterState').set('filter', route);
			if(route === 'author_page'){
				var authorPage = new App.AppStaticLayout.AuthorPage();
				this.hideAll();
				App.root.getRegion('header').show(authorPage);
			} else{				
				if(route === 'all') {
					MyApp.request('filterState').set('generalInput', true);
					this.showAll();					
				} else if(route === 'done' || route === 'have_done'){
					MyApp.request('filterState').set('generalInput', false);
				}			
			}
		}
	});


	// Одна из самых главных частей всего приложения - общий старт
	MyApp.on('start', function(){
		// создаем экземпляр контроллера
		var controller = new TodoList.Controller();
		//указываем экземпляр роутера
		var router = new TodoList.Router({
			// указали контроллер который относится к этому роуту
			controller : controller,
		});

		// стартовали контроллер
		controller.start();
	});
});