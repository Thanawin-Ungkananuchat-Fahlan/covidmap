var map;
var xhttp;
var obj = [];
let data = [];
let sen;
let sen1;
let sen2;
let country;
let var1;
let var2;
var countryList = [];
var countries = '';
var testData;
var markercluster;
var heatmapLayer;
var cfg = {
    'radius': 25,
    "maxOpacity": .5,
    "scaleRadius": false,
    "useLocalExtrema": true 
};

function init() {
    map = new longdo.Map({
        placeholder: document.getElementById('map'),
        language: 'en',
        location: {lat:13.689128, lon:100.491781},
        zoom: 5
        });
    markercluster = new lmc.MarkerCluster(map,{minClusterSize:2});
    heatmapLayer = new HeatmapOverlay(cfg);    
    loadphp();
    map.Event.bind('layerChange', function(Layers){
        map.Layers.add(heatmapLayer);
    });
}

function loadphp() {
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        console.log(xhttp.readyState);
        if (this.readyState == 4 && this.status == 200) {
            var line = this.responseText.split('\n');
            var linelength = line.length;
            let i = 0;
            while (i < linelength) {
                sen = line[i].split(',');
                sen1 = parseFloat(sen[1]); sen2 = parseFloat(sen[2]);
                country = sen[0];
                i++;                
                if (isNaN(sen1) || isNaN(sen2)) {
                    continue;
                }
                sen1 = sen1.toFixed(4); sen2 = sen2.toFixed(4);
                obj.push([country, parseFloat(sen1), parseFloat(sen2)]);
            }
            line = '';
            obj.sort(function(a, b) {
                var numA = a[1];
                var numB = b[1];
                if (numA < numB) {
                  return -1;
                }
                if (numA > numB) {
                  return 1;
                }
                return 0;
            });
            console.log(obj)
            document.getElementById("text").value = 'Thailand';
            let index = obj.length - 1;
            let redundant = 1;
            while (index >= 0) {
                var1 = obj[index][1]; var2 = obj[index][2];
                if (index%1000 == 0) {
                    //console.log(index);
                }
                index--;
                if (index < 0){
                    dataArray(var1, var2, redundant);
                    break;
                }
                try {
                    if (var1 == obj[index][1] && var2 == obj[index][2]) {
                        redundant += 0.0001;
                    }
                    else {
                        dataArray(var1, var2, redundant); 
                        redundant = 1;           
                    }
                } catch (error) {console.error(error)}
            }
            console.log(data);
            testData = {
                max: 10,
                data: data
            };
            data = [];
            heatmapLayer.setData(testData);
            map.Layers.add(heatmapLayer);
            obj.sort(function(a, b) {
                var numA = a[0];
                var numB = b[0];
                if (numA < numB) {
                return -1;
                }
                if (numA > numB) {
                return 1;
                }
                return 0;
            });
            index = obj.length - 1;
            while (index >= 0) {
                let countryMem = obj[index][0]; 
                if (index%1000 == 0) {
                    //console.log(index);
                }
                index--;
                if (index < 0){
                    break;
                }
                try {
                    if (countryMem == obj[index][0]) {}
                    else {countryList.push(countryMem);}
                } catch (error) {console.error(error)}
            }
            console.log(countryList);
            for (let index = countryList.length - 1; index >= 0; index--) {
                countries += '<option value="' + countryList[index] + '"></option>\n';
            }
            console.log(countries);
            document.getElementById("country").innerHTML = countries;
            findCountry(document.getElementById("text").value);
        }
    };
    xhttp.open("GET", "outputfile.csv", true);
    xhttp.send();   
}

function addMarker(loc){  
    marker = new longdo.Marker(loc);								  
    markercluster.addMarkers(marker);
}

function dataArray(lat, lon, value) { 
    data.push({
        lat: lat, lon: lon, value: value
    });
}

function findCountry(place) {
    markercluster.clearMarkers();
    console.log('search: '+place);
    let index = obj.length - 1;
    while (index >= 0) {
        var1 = obj[index][1]; var2 = obj[index][2];
        if (index%1000 == 0) {
            //console.log(index);
        }
        if (obj[index][0] == place) {
            addMarker({lat: var1, lon: var2}); 
        } 
        index--;
    }
    markercluster.render();
}
