'use strict';

var React = require('react');
var Dashboard = require('tiler').Dashboard;
var NumberTile = require('tiler-contrib-number-tile');
var ListTile = require('tiler-contrib-list-tile');
var LineChartTile = require('tiler-contrib-line-chart-tile');

var breakpoints = {lg: 1200, md: 996, sm: 768, xs: 480};
var cols = {lg: 12, md: 10, sm: 8, xs: 4};

React.render(
  <Dashboard breakpoints={breakpoints} cols={cols} rowHeight={30}>
    <LineChartTile key={1} _grid={{x: 0, y: 0, w: 6, h: 20}}
      title={'Line Chart'}
      query={{
        metric: {label: {'name': {$replace: {$pattern: '(One)', $replacement: 'Hello $1'}}}},
        point: {time: 'time', value: {value: '$mean'}},
        from: 'examples.random-numbers',
        where: {time: {$gte: {$minus: ['$now', '5m']}}, name: {$regex: {$pattern: '^One|Two|Three|Four$'}}},
        group: ['name'],
        aggregate: {time: {$intervals: {$size: '10s', $offset: {$minus: ['$now', '5m']}}}}
      }} />
    <NumberTile key={2} _grid={{x: 6, y: 0, w: 2, h: 6}}
      query={{
        point: {title: {name: '$last'}, value: {value: '$last'}},
        from: 'examples.random-numbers',
        where: {name: 'One'},
        group: ['name'],
        aggregate: {time: '$all'}
      }}
      suffix={'%'} />
    <ListTile key={3} _grid={{x: 6, y: 6, w: 2, h: 14}} title={'List'} ordered={false}
      bands={[
        {
          min: 80,
          styles: {
            item: {
              backgroundColor: '#33a02c'
            }
          }
        },
        {
          max: 80,
          maxExclusive: true,
          min: 70,
          styles: {
            item: {
              backgroundColor: '#ff7f00'
            }
          }
        },
        {
          max: 70,
          maxExclusive: true,
          styles: {
            item: {
              backgroundColor: '#e31a1c'
            }
          }
        }
      ]}
      query={{
        point: {label: {name: '$last'}, value: {value: '$last'}},
        from: 'examples.random-numbers',
        where: {name: {$regex: {$pattern: '^One|Two|Three|Four$'}}},
        group: ['name'],
        aggregate: {time: '$all'}
      }} />
  </Dashboard>,
  document.getElementById('content')
);
