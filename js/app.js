/*
 *	作者：431890663@qq.com
 *	时间：2016-09-14
 *	描述：淡轻语的一个F7小物件
 */
/*Framework7初始化相关*/
var myApp = new Framework7({
	uniqueHistory: true, //删除重复的浏览历史
	animatePages: true, //是否启用页面切换动画
	swipeBackPage: true, //滑动返回上一页
	swipeBackPageThreshold: 100, //滑动返回上一页距离需要滑动值
	swipeBackPageActiveArea: 500, //滑动返回上一页宽度范围
	swipeBackPageAnimateShadow: false, //滑动返回时候的 box-shadow 动画。关闭这个功能可以提高性能
	swipeBackPageAnimateOpacity: false, //打开/关闭 滑动返回时候的半透明效果。关闭这个功能可以提高性能。
	hideNavbarOnPageScroll: true, //设置为true，那么当页面向下滚动的时候，导航栏会自动隐藏；向上滚动的时候会自动出现。
	hideToolbarOnPageScroll: true, //设置为true，那么当页面向下滚动的时候，工具栏会自动隐藏；向上滚动的时候会自动出现。
	showBarsOnPageScrollEnd: true, //设置为true，那么当页面滚动到底部的时候会自动显示出被隐藏的导航栏和工具栏。
	precompileTemplates: false, //启用自动编译模板功能
	swipeBackPageAnimateShadow: false, //ios滑动返回上一页打开/关闭 滑动返回时候的 box-shadow 动画。关闭这个功能可以提高性能
	swipeBackPageAnimateOpacity: false //ios滑动返回上一页打开/关闭 滑动返回时候的半透明效果。关闭这个功能可以提高性能
});

// Export selectors engine
var $ = Dom7;
/*百度地图相关*/

// 百度地图API功能
var longitude = '116.404',
	latitude = '39.915',
	city = '北京市';

function initMap() {
	// 使用百度地图地位模块获取位置信息初始化地图
	plus.geolocation.getCurrentPosition(function(p) {
		longitude = p.coords.longitude;
		latitude = p.coords.latitude;
		city = p.address.city;
		baiduMap(longitude, latitude, city);
	}, function(e) {
		alert("Geolocation error: " + e.message);
	}, {
		provider: 'baidu'
	});
}
//百度初始化:当前位置,当前位置的搜索
function baiduMap(longitude, latitude, city) {
	var map = new BMap.Map("map");
	var point = new BMap.Point(longitude, latitude)
	map.centerAndZoom(point, 15);
	//创建当前位置
	var marker = new BMap.Marker(point);
	map.addOverlay(marker); //增加点
	/*缩放控件type有四种类型:BMAP_NAVIGATION_CONTROL_SMALL：
	 * 仅包含平移和缩放按钮；BMAP_NAVIGATION_CONTROL_PAN:仅包含平移按钮；
	 * BMAP_NAVIGATION_CONTROL_ZOOM：仅包含缩放按钮*/
	var top_left_control = new BMap.ScaleControl({
		anchor: BMAP_ANCHOR_BOTTOM_RIGHT
	}); // 左下角，添加比例尺
	var top_right_navigation = new BMap.NavigationControl({
		anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
		type: BMAP_NAVIGATION_CONTROL_SMALL
	});
	//右下角，缩放按钮
	map.addControl(top_left_control);
	map.addControl(top_right_navigation);
	var mapType = new BMap.MapTypeControl({
		mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP]
	});
	map.addControl(mapType); //左上角，默认地图控件

	//设施搜索相关
	var mapsearch = JSON.parse(localStorage.getItem("mapsearch"));
	if(mapsearch) {
		var radius = mapsearch.radius; //半径
		var fenlei = mapsearch.fenlei; //分类
		var circle = new BMap.Circle(point, radius, {
			fillColor: "blue",
			strokeWeight: 1,
			fillOpacity: 0.1,
			strokeOpacity: 0.3
		});
		map.addOverlay(circle);
		var local = new BMap.LocalSearch(map, {
			renderOptions: {
				map: map,
				autoViewport: false
			}
		});
		local.searchNearby(fenlei, point, radius);
		//删除搜索条件
		localStorage.removeItem('mapsearch');
		//添加百度地图自定义按钮
		$('#index-dingwei').click(function() {
			map.centerAndZoom(point, 15);
		})
	}
}
//设备搜索
function baiduMapShebei(mapsearch) {
	//获取缓存数据	
	mapsearch = JSON.parse(mapsearch);
	var longitude = mapsearch.longitude; //经度
	var latitude = mapsearch.latitude; //维度
	var shebei = mapsearch.shebei; //设备
	var map = new BMap.Map('map');
	var poi = new BMap.Point(longitude, latitude);
	map.centerAndZoom(poi, 15);
	map.enableScrollWheelZoom();
	//创建当前位置
	//创建检索信息窗口对象
	var searchInfoWindow = null;
	searchInfoWindow = new BMapLib.SearchInfoWindow(map, '', {
		title: shebei, //设备
		enableAutoPan: true, //自动平移
		searchTypes: [
			BMAPLIB_TAB_SEARCH, //周边检索
			BMAPLIB_TAB_TO_HERE, //到这里去
			BMAPLIB_TAB_FROM_HERE //从这里出发
		]
	});
	var marker = new BMap.Marker(poi); //创建marker对象
	searchInfoWindow.open(marker);
	map.addOverlay(marker); //在地图中添加marker
}
/*Framework7逻辑相关*/
// Add view
var mainView = myApp.addView('.view-main', {
	dynamicNavbar: true,
});
//一个蛋疼的现实是,首页的pageInit逻辑需要需要单独实现???
function indexPageInit() {
	$('#index-search').click(function() {
			mainView.router.loadPage("fujin.html");
		})
		//地图相关
		//获取页面高度设置地图高度
	var w_h = $(window).height() - 90;
	$('#map').css('height', w_h + 'px');
	//报告录入过来的地图,存在则运行它,否则运行初始化的地图
	var mapsearch = localStorage.getItem("shebeisearch");
	localStorage.removeItem("shebeisearch"); //清除报告录入进来的缓存
	if(mapsearch) {
		baiduMapShebei(mapsearch);
	} else {
		if(window.plus) {
			initMap();
		} else {
			document.addEventListener('plusready', initMap, false);
		}
	}
	var denglu=localStorage.getItem('denglu');
	if(!denglu){//没登录
		myApp.popup('.login-screen');//显示登录框
	}
	
	$('.login-screen').find('.login').on('click', function() {
		var username = $('.login-screen').find('input[name="username"]').val();
		var password = $('.login-screen').find('input[name="password"]').val();
		if(username == '') {
			myApp.toast('账号不能为空', '', {}).show();
			return false;
		}
		if(password == '') {
			myApp.toast('密码不能为空', '', {}).show();
			return false;
		}
		localStorage.setItem('denglu',"true");
		localStorage.setItem('user',username);
		myApp.closeModal('.login-screen');
	});
	toast = myApp.toast('轻语一现', '', {})
	$('#btnshow').click(function() {
		toast.show();
	});
}
indexPageInit();
//我他页面返回时初始化,避免indexPageInit()不执行
myApp.onPageInit('index', function(page) {
		indexPageInit();
	})
	//设备业务隐藏地图
myApp.onPageBeforeInit("shebei", function() {
	//	map.hide();
})
myApp.onPageInit('shebei', function(page) {
	//模板测试
	//	var html = template('template', {firstName:"淡",lastName:"轻语"});
	//	$('#contents').html(html);
	$('.create-page').on('click', function() {
		createContentPage();
	});
	if(!page.query.id) return;
	//  alert('上一个页面传的参数:id='+page.query.id)
});
myApp.onPageBack('shebei', function(page) {
	//	alert('返回上一页')
	//	setTimeout(function(){map.show();},300);

});
myApp.onPageInit('fujin', function(page) {
	$('#fujin .col-20').on('click', function() {
		if($(this).attr("data-shebei")) {
			alert("要跟后台要列表")
			return;
		}
		//分类放入缓存,首页地图用
		var radius = $('#fujin').find('.radius').val();
		radius = (isNaN(parseInt(radius)) ? 500 : radius);
		var fenlei = $(this).find('.icon-name').text();
		var obj = {
			'fenlei': fenlei,
			'radius': radius
		}
		localStorage.setItem("mapsearch", JSON.stringify(obj));
		//跳转到首页
		mainView.router.loadPage("index.html");
	});
	if(!page.query.id) return;
	//  alert('上一个页面传的参数:id='+page.query.id)
});
myApp.onPageInit('mubanluru', function(page) {
	var lei = [{
		"电梯": ["自动扶梯与自动人行道监督检验", "曳引驱动电梯定期检验"]
	}, {
		"起重机": ["桥门式起重机和门式起重机定期检验", "机械式起重机定期检验"]
	}, {
		"压力容器": ["年度压力容器定期检验", "压力容器定期检验"]
	}, {
		"锅炉": ["工业锅炉内部定期检验", "工业锅炉外部定期检验"]
	}, {
		"厂内机动车": ["厂内机动车监督检验原始记录"]
	}]
	fenlei('电梯');
	$('#lei').change(function() {
		fenlei($(this).val());
	})

	function fenlei(val) {
		var html1 = "",
			html2 = "";
		for(var i = 0; i < lei.length; i++) {
			for(var j in lei[i]) {

				if(val == j) {
					html1 += '<option selected="selected">' + j + '</option>';
					for(var k = 0; k < lei[i][j].length; k++) {
						html2 += "<option>" + lei[i][j][k] + "</option>";
					}
				} else {
					html1 += "<option>" + j + "</option>";
				}
			}
			$('#lei').html(html1);
			$('#zilei').html(html2);
		}
	}

})
myApp.onPageInit('baogaoluru', function(page) {
	$(window).on('click','#baogaoluru .ditu',function() {
		var longitude = $(this).attr('data-jing');
		var latitude = $(this).attr('data-wei');
		var shebei = $(this).attr('data-shebei');
		var obj = {
			longitude: longitude,
			latitude: latitude,
			shebei: shebei
		}
		localStorage.setItem("shebeisearch", JSON.stringify(obj));
		//跳转到首页
		mainView.router.loadPage("index.html");
	})
	var user=localStorage.getItem('user');
	$.post('http://125.93.93.173:8044/Gis/List?user=lzh',function(data){
		var newdata=JSON.parse(data);
		if(newdata){
			var couponListHtml = template('baogaoluru-tem', newdata);
			$('#baogaoluru-list').html(couponListHtml);
		}
	})
})
myApp.onPageInit('shangchuanbaogao', function(page) {
	$('#shangchuanbaogao .ditu').click(function() {
		var longitude = $(this).attr('data-jing');
		var latitude = $(this).attr('data-wei');
		var shebei = $(this).attr('data-shebei');
		var obj = {
			longitude: longitude,
			latitude: latitude,
			shebei: shebei
		}
		localStorage.setItem("shebeisearch", JSON.stringify(obj));
		//跳转到首页
		mainView.router.loadPage("index.html");
	})
})