// Delvelop.v.0.0.1 2012.04.18
// Delveloper Info Name.�ѿ��� Phone.010-9771-8915 E-mail.kllliv@naver.com
(function($){
	$.fn.multiSelect_SortTable = function(o){
		var opts = $.extend({}, $.fn.multiSelect_SortTable.defaults, o);
		var event_cd = "";
		var selectedClass = 'ui-state-highlight',
			clickDelay = 600,
			// click time (milliseconds)
			lastClick, diffClick; // timestamps
		
		
		$( this ).sortable();//sortable ����
		$( this ).disableSelection();
		$( this ).sortable({
			start : function(){//sortable ���۽� ���� �̺�Ʈ
				$(this).find('li').each(function(){//��� ����Ʈ ����ŭ �ݺ�
					if(event_cd == $(this).attr('event_cd')){//���õǰ� �̵��� ��ü Ȯ�� 
						$(this).addClass(selectedClass);
					}	
				});
				$('.'+selectedClass).each(function(){//���õ� ��ü ����ŭ �ݺ�
					if(event_cd == $(this).attr('event_cd')){//���õǾ� �̵��ϰ� �ִ� ��ü�� ��� Ȱ��
						$(this).css('opacity',opts.sort_opa);
					}else{//���� �Ǿ����� �̵��� ���� �ʴ� ��ü ��Ȱ��
						$(this).css('opacity',opts.multi_opa);
					}
				});
			},
			stop: function(){//�ణ�� drag�̺�Ʈ�� �߻��ϴ� ��ҵȰ�� ��Ȱ��ȭ�� ������ ��Ȱ��
				$(this).find('li').css('opacity','1');
				$(this).find('li').each(function(){//��� ����Ʈ ����ŭ �ݺ�
					if(event_cd == $(this).attr('event_cd')){//���õǰ� �̵��� ��ü Ȯ�� 
						$(this).addClass(selectedClass);
					}	
				});
			},
			update : function() {//�̺�Ʈ �Ϸ�� ����
				$('.'+selectedClass).css('opacity','1');//������ ��Ȱ��
				$(this).find('li').each(function(){//��� ����Ʈ ����ŭ �ݺ�
					if(event_cd == $(this).attr('event_cd')){//���õǰ� �̵��� ��ü Ȯ�� 
						if($(this).hasClass(selectedClass)){//�̵��� ��ü�� ���õ� ��ü�̸� �����ʱ�ȭ
							$(this).removeClass(selectedClass);
						}
						$('.'+selectedClass).insertAfter($(this));//�̵��� ��ü �ڷ� �ٸ� ���� ��ü �̵�
						$(this).addClass(selectedClass);
						//$('.'+selectedClass).removeClass(selectedClass);//���ð�ü �����ʱ�ȭ
					}	
				});
				
					event_go = setInterval(function(){
						$(this).find('li').each(function(){
							sort_num = Number($(this).find('li').index(this)+1);
						});
						clearInterval(event_go);
						},200);
			}
		}).css('cursor','pointer');

		$(this).find('li')//Ŭ�� �� ���� ���� ó��
		// Script to deferentiate a click from a mousedown for drag event
		.bind('mousedown mouseup', function(e) {
			if (e.type == "mousedown") {
				event_cd = $(this).attr('event_cd');
				lastClick = e.timeStamp; // get mousedown time
			} else {
				diffClick = e.timeStamp - lastClick;
				if (diffClick < clickDelay) {
					// add selected class to group draggable objects
					$(this).toggleClass(selectedClass);
				}
			}
		})
	};

	$.fn.multiSelect_SortTable.defaults = {
		'sort_opa' : '0.5',
		'multi_opa' : '0.1'
	};
})(jQuery)