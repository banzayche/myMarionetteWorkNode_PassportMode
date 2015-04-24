/*global Backbone */
'use strict';

MyApp.module('PopUp', function(PopUp, App, Backbone){
	// Создаем вью для нашего попапа
	PopUp.PopUpView = Backbone.Marionette.ItemView.extend({
		id: 'dialog',
		className: 'ui-widget-content',
		template: '#popup-template',
		ui: {
			accept: '#send',
			close: '#close',
			title: '#title',
			done: '#done',
		},
		events: {
			'click @ui.accept': 'changeAttr',
			'click @ui.close' : 'closePopUp',
		},

		// реализация изменения атрибута
		changeAttr: function(){
			var title = this.ui.title.val().trim();
			var done = this.ui.done.prop("checked");
			
			if(!!title){	
				this.model.save({title: title, done: done});
			}
		},
		// закрытие попапа - региона
		closePopUp: function(){
			App.root.getRegion('popup').empty();
		},
		// при показе привязываем метод jquerry ui
		onShow: function(){
			$( "#dialog" ).draggable({cursor: "move", cursorAt: { top: 25, left: 125 }});
		}
	});
});