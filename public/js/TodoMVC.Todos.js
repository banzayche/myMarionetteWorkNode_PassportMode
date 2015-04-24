/*global Backbone */
'use strict';

// Создали модуль с конструктором модели и колекцией
MyApp.module("Todos", function(Todos, App, Backbone){
	// конструктор модели
	Todos.TodoModel = Backbone.Model.extend({
		// указали все предпологаемые атрибуты модели
		defaults: {
			title: undefined,
			done: false,
			id: undefined,
			date: undefined
		},

		// при инициализации присваеваем текущую дату создания
		initialize: function(){
			// если модель новая - присваеваем текущую дату
			if(this.isNew()){
				this.set('date', Date.now());
			}
		},

		// функция смены аттрибута done
		toggleDone: function(){
			return this.set('done', !this.get('done'));
		},

		// функция, возвращающая текущее значение атрибута для текущей модели
		isCompleted: function () {
			return this.get('completed');
		},

		accordance: function(filterVal){
			// если роут ровняется all - то вернет "правда" для всех моделей
			if(filterVal === 'all'){
				return true;
			} else if( filterVal === 'done'){
				return this.get('done');
			} else if( filterVal === 'have_done' ){
				return !this.get('done');
			}
		},
		urlRoot: '/api/todos'
	});



	// Создаем конструктор коллекции
	Todos.TodoCollection = Backbone.Collection.extend({
		// указали на основе какого конструктора будут модели в коллекции
		model: Todos.TodoModel,

		// создаем связь с локальным хранилищем, вместо сервера
		// localStorage: new Backbone.LocalStorage('Marionette-Todo-List'),

		// функция отмечаниявыполненных дел
		done: function(someValue){
			this.each(function(model){
				// проходим всю коллекцию и меняем атрибут done
				model.save('done', someValue);
			});
		},

		checkAll: function(){
			// делаем вычесления для вывода, какой атрибут done присваивать при нажатии на checkAll
			var setPluck = _.pluck(this.toJSON(), 'done');
			setPluck = _.difference(setPluck, [true]);
			// если массив пуст, то все задания выполненны
			if (!setPluck.length) return true
			else return false			
		},

		// фильтрация коллекции по выполненным
		getCompleted: function () {
			return this.filter(function(model){return model.get('done') && true});
		},

		// атрибут сортировки по умолчанию
		sortAttribute: 'date',
		sortDirection: 'true',
		// функция смены атрибута сортировки(вызывается при нажатии на соответствующий элемент ui)
		goSort: function(someValue, someDirection){
			this.sortAttribute = someValue;
			this.sortDirection = someDirection;
			if(this.sortAttribute === 'title'){
				this.sortDirection = true;
			}
			this.sort();
		},

		// параметры сортировки
		comparator: function(model){
			if(this.sortDirection === true){
				return model.get(this.sortAttribute);
			} else{
				return -model.get(this.sortAttribute);
			}
			
		},
		url: '/api/todos'
	});
});