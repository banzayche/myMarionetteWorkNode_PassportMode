/*global Backbone */
'use strict';

MyApp.module('AppStaticLayout', function(AppStaticLayout, App, Backbone){
	// наше главное представление с регионами
	AppStaticLayout.GeneralView = Backbone.Marionette.LayoutView.extend({
		el: '#root-template',
		// добавили регионы
		regions: {
			header: '#header',
			main: '#main',
			footer: '#footer',
			popup: '#popup'
		},
	});

	// header view
	AppStaticLayout.Header = Backbone.Marionette.LayoutView.extend({
		id: 'header-element',

		className: 'ovf-a',

		template: '#header-template',

		regions: {
			inputarea: '#input-area',
		},

		fetchTestGo: function(){
			this.collection.fetch().done(function(){console.log('fetch done')});
		},		

		initialize: function(){
			// Слушаем filterState и если модель изменится то проверяем, правильно ли отображен инпут
			this.listenTo(App.request('filterState'), 'change', this.hideInput, this);
		},
		onShow: function(){
			this.hideInput();
			this.ui.goRoute.removeClass('active');
			var route = MyApp.request('filterState').get('filter');
			$('#'+route).addClass('active');			
			// alert('onShow header '+route);
		},
		// єлементы управления
		ui: {
			sort1 : '.firs-sort',
			sort2 : '.second-sort',
			sort3 : '.third-sort',
			goRoute : '.go-route',
			fetchTest : '#fetch',
			all: '#all',
			done: '#done',
			have_done: '#have_done',
			author_page: '#author_page'
		},

		// события для ui
		events: {
			'click @ui.sort1' : 'sortBegin',
			'click @ui.sort2' : 'sortBegin',
			'click @ui.sort3' : 'sortBegin',
			'click @ui.goRoute' : 'changeButtonClass',
			'click @ui.fetchTest' : 'fetchTestGo',
			'click @ui.all' : 'choiseRouter',
			'click @ui.done' : 'choiseRouter',
			'click @ui.have_done' : 'choiseRouter',
			'click @ui.author_page' : 'choiseRouter',
		},
		// onShow: function(){
			
		// },
		choiseRouter: function(e){
			Backbone.history.navigate(e.target.id, {trigger: true});
		},
		// функция обработки значения сортировки
		sortBegin:function(e){
			var parameter = $(e.target).attr('sortby');
			var direction = $(e.target).attr('gosort');			
			direction = this.sortToggle(e, direction);

			this.collection.goSort(parameter, direction);
		},
		
		// Проверка атрибута sort-dirrect
		sortToggle: function(e, direction) {			
			if(direction) {
				$(e.target).removeAttr('gosort', false);
				return true;
			} else {
				$(e.target).attr('gosort', true);
				return false;
			}
		},

		// коррекция отображения главного поля ввода
		hideInput: function(){
			// создали переменную для input template
			var inputTemplate,
				// взяли родительскую коллекцию 
				collection = this.collection,
				// смотрим состояние спец атрибута
				inputCondition = MyApp.request('filterState').get('generalInput');

			// проверяем какое значение имеет атрибут спец модели,
			// и в зависимости от этого изменяем шаблон представления
			if (inputCondition === true) {
				inputTemplate = '#input-area-layout';
			} else{
				inputTemplate = '#input-area-empty-layout';
			}

			// создаем вью для отображении в регионе
			var inputView = Backbone.Marionette.ItemView.extend({
				template: inputTemplate,
				collection: collection,
				ui: {
					input : '#add-new-todo',
				},
				events: {
					'keypress @ui.input' : 'addNewTodo',
				},

				onShow: function(){
					this.ui.input.focus();
				},
				
				// добавление новой модели
				addNewTodo: function(e){
					// создаем переменную со значением кей-кода энтера
					var Enter_key = 13,
					// запоминаем в переменную значение нашего инпута
					todoTitle = this.ui.input.val().trim();

					// теперь ставим условие, если две вышепредставленные переменные имеют какие то значение значит создаем модель
					if(e.which === Enter_key && todoTitle){
						this.collection.create({
							title: todoTitle
						});
						// очищаем поле ввода
						this.ui.input.val('');
					}
				},
			});

			var newInputView = new inputView();
			// показываем регион
			this.getRegion('inputarea').show(newInputView);			
		},

		changeButtonClass: function(e){
			this.ui.goRoute.removeClass('active');
			$(e.target).addClass('active');
		},

		// тепер будет нижеприведенная конструкция будет отдавать вьюхе модель с необходимыми атрибутами
		serializeData: function(){
			// отдаем данные, необходимые представлению
			return {
				"firstSort": 'title',
				"secondSort" : 'id',
				"thirdSort" : 'date'
			}
		}
	});

	//footer view
	AppStaticLayout.Footer = Backbone.Marionette.ItemView.extend({
		template: '#footer-template',

		ui: {
			remove : '.remove-done'
		},

		events: {
			'click @ui.remove' : 'removeDone'
		},

		collectionEvents: {
			'change' : 'render',
			'destroy' : 'render'
		},

		removeDone: function(){
			var complited = this.collection.getCompleted();
			complited.forEach(function (model) {
				model.destroy({success: function(model, response) {
					// тригерим sync при положительном ответе с сервера
					MyApp.TodoCollection.trigger('sync');
				}});
			});			
		},
		
		// тепер будет нижеприведенная конструкция будет отдавать вьюхе модель с необходимыми атрибутами
		serializeData: function(){
			// получаем массив из значений ключа done
			var haveDo = _.pluck(this.collection.toJSON(), 'done');
			// получаем длинну нашего массива
			var done = this.collection.length;
			// исключаем все значения true в массиве
			haveDo = _.difference(haveDo, [true]);
			// узнаем длинну массива
			haveDo = haveDo.length;
			// узнаем количество выполненных дел
			done = done - haveDo;
			// отдаем данные, которые необходимо будет вывести в представлении
			return {
				"haveDo": haveDo,
				"done" : done
			}
		}
	});

	//author view
	AppStaticLayout.AuthorPage = Backbone.Marionette.ItemView.extend({
		id: 'author-page',
		className: 'ovf-a',
		template: '#author-page-layout',
		ui: {
			all: '#all'
		},
		events: {
			'click @ui.all': 'choiseRouter'
		},
		choiseRouter: function(e){
			Backbone.history.navigate(e.target.id, {replace: true, trigger: true});
		},
	});

});