//ng-ah-amap

var ngAHMap = angular.module('ngAHAmap',[]).service('$amap',[function(){
    this.map = function(scope,mapContainer,options){
        //2015.9.9 James Liu Wrote:
        //no network we should do nothing for AMap.
        //why no AMAP? which only happens on localhost, the developer no internet connection.
        //Don't care it too much.
        //var AMap = AMap||undefined;
        if (typeof AMap === "undefined")return;
        //todo refactoring the following code
        //hard to determine how to extract and design the interface.
        
        scope.setMarker = function(lng,lat){
            if(scope.marker){
                scope.marker.setMap(null);  //在地图上添加点
            }
            scope.marker = new AMap.Marker({
                icon:"http://webapi.amap.com/images/marker_sprite.png",
                position:new AMap.LngLat(lng,lat)
            });

            scope.marker.setMap(scope.map);  //在地图上添加点
        };

        scope.map = new AMap.Map(mapContainer, {
            //resizeEnable: true,
            //rotateEnable: true,
            //dragEnable: true,
            //zoomEnable: true,
            //设置可缩放的级别
            //zooms: [3,18],
            //传入2D视图，设置中心点和缩放级别
            view: new AMap.View2D({
                //center: new AMap.LngLat(scope.hotel.longitude, scope.hotel.latitude),
                zoom: 12
            })
        });
        scope.onLocationDone = (options&&options.onAmapLocationDone)||function(obj){
            console.log('on location complete...');
            console.log(obj);
        };
        scope.onLocationError  = function(error){
            console.log(error);
        };
        

        scope.map.plugin(["AMap.OverView"],function(){
            view = new AMap.OverView();
            scope.map.addControl(view);
        });
        
        scope.map.plugin(["AMap.ToolBar"],function(){
            //加载工具条
            var tool = new AMap.ToolBar({autoPosition:true});
            //tool.doLocation();
            scope.map.addControl(tool);
            AMap.event.addListener(tool,'location',scope.onLocationDone);
            AMap.event.addListener(tool,'error',scope.onLocationError);
            
        });

        scope.reGeocoder = function(lng,lat){
            
            var lnglatXY = new AMap.LngLat(lng,lat);
            var geocoder;
            AMap.service(["AMap.Geocoder"], function() {       
                geocoder = new AMap.Geocoder({
                    radius: 1000,
                    extensions: "all"
                });
                //逆地理编码
                geocoder.getAddress(lnglatXY, function(status, result){
                    //取回逆地理编码结果
                    if(status === 'complete' && result.info === 'OK'){
                        scope.reGeocoder_CallBack(result);
                    }
                });
            });

        };

        var clickEventListener=AMap.event.addListener(scope.map,'click',function(e){
            
            scope.setMarker(e.lnglat.getLng(),e.lnglat.getLat());
            scope.$apply(function() {
                scope.longitude = e.lnglat.getLng();
                scope.latitude = e.lnglat.getLat();
                if(options&&options.onMapReLocation)options.onMapReLocation(scope.longitude,scope.latitude);
                scope.reGeocoder(scope.longitude,scope.latitude);
            });

            
        });
        scope.reGeocoder_CallBack  = function(result){
           
            if(result&&result.regeocode&&result.regeocode.addressComponent){
                
                scope.$apply(function(){
                    //直辖市没有city
                    scope.city= result.regeocode.addressComponent.city||result.regeocode.addressComponent.province;
                });
            }
                
        };
        scope.geocoder_CallBack=function(result){
        
            if(result.geocodes.length)
            {
                geocode = result.geocodes[0];
                scope.setMarker(geocode.location.getLng(),geocode.location.getLat());

                scope.map.setZoomAndCenter(14, new AMap.LngLat(geocode.location.getLng(), geocode.location.getLat()));
                scope.$apply(function() {
                    
                        scope.longitude = geocode.location.getLng();
                        scope.latitude = geocode.location.getLat();

                });
            }
        };
        scope.locateAddress=function(address){
            var MGeocoder;
            //加载地理编码插件
            AMap.service(["AMap.Geocoder"], function() {
                MGeocoder = new AMap.Geocoder({
                    //city:"010", //城市，默认：“全国”
                    //city:'0539',
                    radius:1000 //范围，默认：500
                });
                //返回地理编码结果
                //地理编码
                MGeocoder.getLocation(address, function(status, result){
                    if(status === 'complete' && result.info === 'OK'){
                        scope.geocoder_CallBack(result);
                    }
                });
            });
        };
    };
}]);

