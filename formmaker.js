(function($) {
	$.fn.formmaker = function(o){
		var obj = $(this);

		var opts = $.extend({}, $.fn.formmaker.defaults, o);

		var noCheckHtml = new Array;

		var rowSetter = {
			obj : new Object,
			midDescInfo : new Array,
			formType : new Array,
			formAttr : new Array,
			formEvent : new Array,
			formSetName : '',
			formSetValue : new Array,
			fieldName : '',

			repNumber : function() {
				this.formSetName = 'rep_' + this.fieldName + 'Cnt';

				//repNumberCheck = obj.attr('repCheck').split('_');
				this.obj.find('div.repNumber > div > label').attr('for', this.formSetName),
				this.obj.find('div.repNumber > input.replaceCount').attr({
					'id': this.formSetName,
					'name': this.formSetName,
					'repName': this.fieldName,
					'value': this.formSetValue[1],
					'onlyNumber': this.formSetValue[1] + ',' + this.formSetValue[2]
				});

				replaceCntChangeSet(this.obj.find('div.repNumber >  input.replaceCount'));
			},

			inputGroup : function() {
				this.formSetName = this.fieldName + 'IG';
				this.obj.find('div.inputGroup').append(opts.formHtml.input);
				this.obj.find('div.inputGroup > input').attr({"name" : this.formSetName, "id" : this.formSetName}).val(this.formSetValue[2]);
				this.obj.find('div.inputGroup > div > label').attr('for', this.formSetName).text(this.formSetValue[1]);
			},

			guideInput : function() {
				this.formSetName = this.fieldName + 'IC';
				guideText = this.obj.attr('guideText').split('_');
				guideValue = (guideText[0]) ? guideText[0] : "가이드";
				guideComment = (guideText[1] == 'guideText') ? opts.guideText[guideText[2]] : guideText[1];
				this.obj.find('div.guideInput > input').attr({"name" : this.formSetName, "id" : this.formSetName, "inputComment" : guideComment.replace(/\n/g, '<br />')}).val(guideValue);
			},

			fieldCntSet : function() {
				this.formSetName = this.fieldName + 'Cnt';

				this.obj.find('div.fieldCntSet > div > label').attr('for', this.formSetName);
				this.obj.find('div.fieldCntSet > input.fieldCnt').attr({
					'id': this.formSetName,
					'name': this.formSetName,
					'value': this.formSetValue[1],
					'onlyNumber': this.formSetValue[1] + ',' + this.formSetValue[2]
				});
				$('#' + this.fieldName).attr('name', this.fieldName + '[]');
			},

			selectBox : function() {
				this.formSetName = this.fieldName + 'Type';

				var optionHtml = getOptionHtml(this.obj.attr('flagSelectOption'));

				this.obj.find('div.selectBox > div > label').attr('for', this.formSetName);
				this.obj.find('div.selectBox > select').attr({
					'id': this.formSetName,
					'name': this.formSetName
				}).html(optionHtml);

			},

			flagSet : function() {
				this.formSetName = this.fieldName + 'Type';

				this.obj.find('div.flagSet > div > label').attr('for', this.formSetName);
				this.obj.find('div.flagSet > input').attr({
					'id': this.formSetName,
					'name': this.formSetName
				}).val(this.formSetValue[2]);
				//alert($(obj).attr('flagComment'));
				this.obj.find('div.flagSet').css('width', this.formSetValue[1] + 'px');
				this.obj.find('div.flagSet > div:last-child > label').text(this.obj.attr('flagComment'));
			},

			flagSelectSet : function() {
				this.formSetName = this.fieldName + 'Type';

				var optionHtml = getOptionHtml(this.obj.attr('flagSelectOption'));

				this.obj.find('div.flagSelectSet > div > label').attr('for', this.formSetName);
				this.obj.find('div.flagSelectSet > select').attr({
					'id': this.formSetName,
					'name': this.formSetName
				}).html(optionHtml);

				this.obj.find('div.flagSelectSet > div:last-child > label').text(this.obj.attr('flagComment'));
			},

			midSet : function() {

				this.midDescInfo = this.obj.attr('fieldMidDesc').split('_');

				if (this.midDescInfo[0] == 'form') {
					this.formType = this.obj.attr('midFormType').split('|');
					var midFormCnt = 0;
					this.formType.forEach(function (element) {
						rowSetter.formSetValue = element.split('_');

						eval('rowSetter.obj.find(\'td:eq(1)\').append(opts.formHtml.' + rowSetter.formSetValue[0] + ' + \'<div class="float-left">&nbsp;</div>\');');
						eval('rowSetter.' + rowSetter.formSetValue[0]  + '()');
						if (rowSetter.formAttr[midFormCnt]) {
							var arrayAttr = new Object;
							attributeList = rowSetter.formAttr[midFormCnt].split('_');
							attributeList.forEach(function (element) {
								attrSet = element.split('.');
								if(attrSet[0].match(/class/gi)) {
									$('#' + rowSetter.formSetName).addClass(attrSet[1]);
									return;
								}

								if (attrSet[1].match(/(true|false)/gi)) {
									attrSet[1] = Boolean(attrSet[1].replace(/false/gi,''));
								}

								arrayAttr[attrSet[0]] = attrSet[1];
							});

							$('#' + rowSetter.formSetName).attr(arrayAttr);
						}

						if (rowSetter.formEvent[midFormCnt]) {
							var formEventList = rowSetter.formEvent[midFormCnt].split('_');
							$('#' + rowSetter.formSetName).on(formEventList[0], function(){
								eval(formEventList[1] + ';');
							});
						}

						midFormCnt++;
					});
				}
				else {
					this.commentSet();
				}
			},

			commentSet : function() {
				this.midDescInfo[1] = (this.midDescInfo[1]) ? this.midDescInfo[1] : 0;

				this.obj.find('td:eq(1)').css(opts.formStyle.midDescPoint[this.midDescInfo[1]]).text(this.midDescInfo[0]);
			},

			set : function(obj) {
				this.obj = obj;
				this.formAttr = new Array;
				this.formEvent = new Array;

				this.fieldName = this.obj.attr('fieldName');
				if (this.obj.attr('midFormAttrSet')) {
					this.formAttr = this.obj.attr('midFormAttrSet').split('|');
				}

				if (this.obj.attr('midEventFuncSet')) {
					this.formEvent = this.obj.attr('midEventFuncSet').split('|');
				}

				this.obj.html('<td><label for=""></label></td><td></td><td></td>');
				this.obj.find('td:first-child').find('label:first-child').html(this.obj.attr('fieldNameKr'))
					.attr('for', this.fieldName);
				this.obj.find('td:last-child').html(opts.formHtml.input)
					.find('input').attr('id', this.fieldName).attr('name', this.fieldName);

				if (this.obj.attr('fieldMidDesc')) {
					this.midSet();
				}
			},
		}

		var getOptionHtml = function(setData) {
			var arrayOption = setData.split("|");
			var optionHtml = '';
			arrayOption.forEach(function (optionData) {
				var settingOptionValue = optionData.split('_');
				var selected = (settingOptionValue[2]) ? 'selected' : '';
				optionHtml += '<option value="' + settingOptionValue[1] + '" ' + selected + ' >' + settingOptionValue[0] + '</option>';
			});

			return optionHtml;
		}

		if (obj.children('tr').length) {
			obj.children('tr').each(function(){
				if ($(this).attr('noCheck') != 'on') {
					rowSetter.set($(this));
				}
				else {
					noCheckHtml.push($(this).html());
					$(this).remove();
				}
			});
		}

		if (Object.keys(opts.formSet).length) {
			for (const [key, value] of Object.entries(opts.formSet)) {
				obj.append("<tr></tr>");
				targetObj = obj.find('tr:eq(' + (obj.find('tr').length - 1) + ')');
				targetObj.attr(value);
				rowSetter.set(targetObj);
			};
		}

		noCheckHtml.forEach(function (value) {
			obj.append("<tr></tr>");
			targetObj = obj.find('tr:eq(' + (obj.find('tr').length - 1) + ')');
			targetObj.html(value);
		});
	};

	$.fn.formmaker.defaults = {
		formHtml : {
			'input' : '<input type="text" class="form-control form-control-sm" id="" name="" />',
			'inputGroup' : '<div class="input-group input-group-sm float-left inputGroup" id="" style="width:auto;"><div class="input-group-prepend" style=""><label class="input-group-text inputGroupLabel" for=""></label></div></div>',
			'selectBox' : '<div class="input-group input-group-sm float-left selectBox" style="width:auto;"><div class="input-group-prepend"><label class="input-group-text" for="">선택</label></div><select class="form-control" id="" name=""></select></div>',
			'number' : '<input type="number" onlyNumber="" value="" class="form-control fieldCnt" id="" name="" />',
			'repNumber' : '<div class="input-group input-group-sm float-left repNumber" style="width:150px;"><div class="input-group-prepend"><label class="input-group-text" for="">변경 갯수</label></div><input type="number" onlyNumber="" value="" class="form-control replaceCount" repName="" id="" name="" /></div><div class="float-right replaceArea" ></div>',
			'fieldCntSet' : '<div class="input-group input-group-sm float-left fieldCntSet" style="width:150px;"><div class="input-group-prepend"><label class="input-group-text" for="">필드 갯수</label></div><input type="number" onlyNumber="1,10" value="1" class="form-control fieldCnt" id="" name="" /></div>',
			'flagSet' : '<div class="input-group input-group-sm float-left flagSet" style="width:300px;"><div class="input-group-prepend"><label class="input-group-text" for="">조건</label></div><input type="text" class="form-control" id="" name="" /><div class="input-group-append"><label class="input-group-text" style="background-color:#fff;" for=""></label></div></div>',
			'flagSelectSet' : '<div class="input-group input-group-sm float-left flagSelectSet" style="width:auto;"><div class="input-group-prepend"><label class="input-group-text" for="">강제</label></div><select class="form-control" id="" name=""></select><div class="input-group-append"><label class="input-group-text" style="background-color:#fff;" for=""></label></div></div>',
			'guideInput' : '<div class="float-left guideInput"><input type="button" inputComment="" class="form-control form-control-sm" id="" value="가이드" name="" readonly style="width:auto;background-color:#e9ecef;" /></div>'
		},

		formSet : {},

		formStyle : {
			'midDescPoint' : {
				0 : {},
				1 : {'color':'red','font-weight':'bold'}
			}
		},

		guideText : {},
	}

})(jQuery);