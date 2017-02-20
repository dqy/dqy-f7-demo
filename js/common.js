/*
 *	作者：431890663@qq.com
 *	时间：2016-09-14
 *	描述：淡轻语的一个F7小物件
*/
(function(w) {
	// H5 plus事件处理
	var ws = null,
		as = 'pop-in';

	function plusReady() {
		ws = plus.webview.currentWebview();
		// Android处理返回键
		plus.key.addEventListener('backbutton', function() {
			back();
		}, false);
	}
	if (w.plus) {
		plusReady();
	} else {
		document.addEventListener('plusready', plusReady, false);
	}
	// 处理返回事件
	//安卓后退:backButtonPress
	var backButtonPress = 0;
	window.back = function(hide) {
		if (w.plus) {
			//处理弹出框的安卓返回键
			if($('.modal').length>0){//Alert, Prompt and Confirm modals:警告框,确认框
				myApp.closeModal('.modal');
				return false;
			}
			if($('.popup').length>0&&$('.popup').hasClass('modal-in')){//popup:全窗口弹出
				myApp.closeModal('.popup');
				return false;
			}
			if($('.actions-modal').length>0){//actions:底部弹出带遮罩
				myApp.closeModal('.actions-modal');
				return false;
			}
			if($('.picker-modal').length>0&&$('.picker-modal').hasClass('modal-in')){//picker:底部弹出不带遮罩
				myApp.closeModal('.picker-modal');
				return false;
			}
			if($('.panel').length>0&&($('.panel.panel-left').hasClass('active')||$('.panel.panel-right').hasClass('active'))){//panel:左右菜单
				myApp.closePanel();
				return false;
			}
			if (mainView.history.toString().indexOf(',') > -1) {
				mainView.router.back();
			} else {
				backButtonPress++;
				if (backButtonPress > 1) {
					plus.runtime.quit();
				} else {
					plus.nativeUI.toast('再按一次退出应用');
				}
				setTimeout(function() {
					backButtonPress = 0;
				}, 1000);
				return false;
			}

		} 
	};
})(window);