(function() {

    // map state
    var mapState = 'close',
        currentBubble = null;
    
    // sidebar
    var sidebar = d3.select('#story');

    // main map object
    var map = new Datamap({
        element: document.getElementById('container'),
        scope: 'world',
        setProjection: function(element) {
        var projection = d3.geo.equirectangular()
            .center([-90, 30])
            .rotate([0, 0])
            .scale(900)
            .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
            var path = d3.geo.path()
            .projection(projection);
            return {
                path: path,
                projection: projection
            };
        },
        bubbleClick: onBubbleClick,
        geographyConfig: {
            highlightOnHover: false,
            popupOnHover: false
        },
        fills: {
            defaultFill: '#1CACB9'
        },
    });

    d3.json('data/points.json', function(data) {

        var options = {
            borderWidth: 0,
            popupOnHover: true,
            popupTemplate: function(geography, data) {
              return '<div class="hoverinfo"><strong>' + data.name + '</strong></div>';
            },
            fillOpacity: 0.75,
            highlightOnHover: true,
            highlightFillColor: '#FC8D59'
        };
        map.bubbles(data, options);

        onBubbleClick(data[0]);

    });

    function onBubbleClick(d) {

        if(mapState === 'open' && d === currentBubble) {
            return;
        }

        currentBubble = d;

        mapState = 'open';

        sidebar.select('h1 span').text(d.quote);
        sidebar.select('.body b').text(d.body);

        sidebar.style('visibility', 'visible')
            .transition()
            .duration(250)
            .style('opacity', 1);

        var options = {
            strokeColor: '#1CACB9',
            strokeWidth: 2,
            arcSharpness: 0.1,
            animationSpeed: 250
        };

        if(!d.jumps) {
            map.arc([], options);
            return;
        }
        var jumps = d.jumps;
        var tmp = [];

        for(var i = 0; i < jumps.length; i++) {

            setTimeout(function(item) {

                tmp.push(item);
                map.arc(tmp, options);

            }, i*options.animationSpeed, jumps[i]);

        }

    }

    // click on iframe
    $(function() {

        $('iframe').load(function(){
            $(this).contents().find("body").on('click', function(event) {
                $('#charts_frame').hide();
                $('#charts_modal').css('visibility', 'visible');
            });
        });

        $('#charts_modal').on('click', function() {
            $('#charts_frame').show();
            $('#charts_modal').css('visibility', 'hidden');
        });

    });

    window.map = map;

}).apply(this);