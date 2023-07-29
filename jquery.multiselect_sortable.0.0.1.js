// Delvelop.v.0.0.1 2012.04.18
// Delveloper Info Name.한영민 Phone.010-9771-8915 E-mail.kllliv@naver.com
(function($){
	$.fn.multiSelect_SortTable = function(o){
		var opts = $.extend({}, $.fn.multiSelect_SortTable.defaults, o);
		var event_cd = "";
		var selectedClass = 'ui-state-highlight',
			clickDelay = 600,
			// click time (milliseconds)
			lastClick, diffClick; // timestamps
		
		
		$( this ).sortable();//sortable 선언
		$( this ).disableSelection();
		$( this ).sortable({
			start : function(){//sortable 시작시 실행 이벤트
				$(this).find('li').each(function(){//목록 리스트 수만큼 반복
					if(event_cd == $(this).attr('event_cd')){//선택되고 이동한 개체 확인 
						$(this).addClass(selectedClass);
					}	
				});
				$('.'+selectedClass).each(function(){//선택된 객체 수만큼 반복
					if(event_cd == $(this).attr('event_cd')){//선택되어 이동하고 있는 개체의 경우 활성
						$(this).css('opacity',opts.sort_opa);
					}else{//선택 되었지만 이동이 되지 않는 개체 비활성
						$(this).css('opacity',opts.multi_opa);
					}
				});
			},
			stop: function(){//약간의 drag이벤트가 발생하다 취소된경우 비활성화된 선택자 재활성
				$(this).find('li').css('opacity','1');
				$(this).find('li').each(function(){//목록 리스트 수만큼 반복
					if(event_cd == $(this).attr('event_cd')){//선택되고 이동한 개체 확인 
						$(this).addClass(selectedClass);
					}	
				});
			},
			update : function() {//이벤트 완료시 실행
				$('.'+selectedClass).css('opacity','1');//선택자 재활성
				$(this).find('li').each(function(){//목록 리스트 수만큼 반복
					if(event_cd == $(this).attr('event_cd')){//선택되고 이동한 개체 확인 
						if($(this).hasClass(selectedClass)){//이동한 개체가 선택된 개체이면 선택초기화
							$(this).removeClass(selectedClass);
						}
						$('.'+selectedClass).insertAfter($(this));//이동한 개체 뒤로 다른 선택 개체 이동
						$(this).addClass(selectedClass);
						//$('.'+selectedClass).removeClass(selectedClass);//선택개체 선택초기화
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

		$(this).find('li')//클릭 시 선택 비선택 처리
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