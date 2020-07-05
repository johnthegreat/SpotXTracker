/*
 * SpotXTracker - Upload and track your Spot X coordinates
 * Copyright (c) 2020 John Nahlen
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/* eslint-disable */
function CreateEditDeviceModal(opts) {
	'use strict';

	opts = _.extend({
		mode: 'Create',
		object: null,
		title: 'Create Device',
		saveBtnText: 'Create',
		saveCallback: _.noop
	},opts);
	this.element = null;
	let $errorContainer;

	this.load = function() {
		return new Promise(function(resolve, reject) {
			if (CreateEditDeviceModal.modalHtml === null) {
				$.ajax({
					method: 'get',
					url: '/modals/CreateEditDeviceModal.html',
					success: function(modalHtml) {
						CreateEditDeviceModal.modalHtml = modalHtml;
						this.element = $(_.clone(modalHtml));
						this.init();
						resolve();
					}.bind(this),
					error: function() {
						reject.apply(this,arguments);
					}.bind(this)
				});
			} else {
				this.element = $(_.clone(CreateEditDeviceModal.modalHtml));
				this.init();
				resolve();
			}
		}.bind(this));
	}.bind(this);

	this.init = function() {
		this.element.on('hidden.bs.modal',function() {
			this.element.remove();
		}.bind(this));

		this.element.on('shown.bs.modal',function() {
			this.element.find('input:eq(0)').focus();
		}.bind(this));

		this.element.find('[data-dismiss="modal"]').on('click',function() {
			this.hide();
		}.bind(this));

		this.element.find('#createBtn').on('click',function() {
			if (_.isFunction(opts.saveCallback)) {
				clearHighlightFromField('input, textarea');
				clearErrors();
				let object = getObject();
				let errors = validate(object);
				if (errors.length > 0) {
					_.each(errors,function(err) {
						addError(err.msg);
						addHighlightToField(err.sel,'has-error');
					}.bind(this));

					let firstErr = _.first(errors);
					this.element.find(firstErr.sel).get(0).focus();
				} else {
					this.hide();
					opts.saveCallback(object);
				}
			}
		}.bind(this));

		this.element.find('.modal-title').text(opts.title);
		this.element.find('#createBtn').text(opts.saveBtnText);

		if (opts.mode === 'Edit' && !_.isEmpty(opts.object)) {
			setObject(opts.object);
		}

		$errorContainer = this.element.find('#errorContainer');

		const onDescriptionCountable = function(counter) {
			this.element.find('#descriptionCharCountContainer').find('.charsUsed').text(counter.all);
		}.bind(this);
		// Set maximum number of characters for Description field
		this.element.find('#descriptionCharCountContainer').find('.charsMax').text(500);
		// Update chars used count for Description field on input
		Countable.on(this.element.find('#description').get(0),onDescriptionCountable);
		if (opts.mode === 'Edit') {
			Countable.count(this.element.find('#description').get(0),onDescriptionCountable);
		}

		new Cleave(this.element.find('#phoneNumber').get(0), {
			numericOnly: true,
			blocks: [0, 3, 0, 3, 4],
			delimiters: ["(", ")", " ", "-"],
		});
	}.bind(this);

	this.show = function() {
		this.element.modal();
	}.bind(this);

	this.hide = function() {
		this.element.modal('hide');
	}.bind(this);

	let getObject = function() {
		let device = opts.object || {};
		device['name'] = this.element.find('#name').val();
		device['description'] = this.element.find('#description').val();
		device['phoneNumber'] = this.element.find('#phoneNumber').val();
		return device;
	}.bind(this);

	let setObject = function(object) {
		this.element.find('#name').val(object['name']);
		this.element.find('#description').val(object['description']);
		this.element.find('#phoneNumber').val(convertPhoneNumberToE164(object['phoneNumber']).replace('+1',''));
	}.bind(this);

	let validate = function(object) {
		let errors = [];
		if (_.trim(object['name']).length === 0) {
			errors.push({ msg: 'Name is required.', sel: '#name' });
		}
		if (_.trim(object['phoneNumber']).length === 0) {
			errors.push({ msg: 'Phone number is required.', sel: '#phoneNumber' });
		}
		return errors;
	};

	let addError = function(errMsg) {
		$errorContainer.removeClass('hide');
		$errorContainer.find('ul').append($("<li>").text(errMsg));
	}.bind(this);

	let clearErrors = function() {
		$errorContainer.addClass('hide');
		$errorContainer.find('ul > li').remove();
	}.bind(this);

	let addHighlightToField = function(selector,_class) {
		this.element.find(selector).closest('.form-group').addClass(_class);
	}.bind(this);

	let clearHighlightFromField = function(selector) {
		this.element.find(selector).closest('.form-group').removeClass('has-warning has-success has-error');
	}.bind(this);
}
CreateEditDeviceModal.modalHtml = null;
