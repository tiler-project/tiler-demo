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
      query={
      'from examples.random-numbers\n' +
      'where time >= (now() - 5m) &&\n' +
      'name ~= /^One|Two|Three|Four$/\n' +
      'group name\n' +
      'aggregate interval(time, now() - 5m, 10s) as time\n' +
      'metric replace(name, /(One)/, "Hello $1") as label\n' +
      'sort name desc\n' +
      'point time, mean(value) as value\n' +
      'sort time'
      } />
    <NumberTile key={2} _grid={{x: 6, y: 0, w: 2, h: 6}}
      query={
      'from examples.random-numbers\n' +
      'where name == "One"\n' +
      'group name\n' +
      'aggregate all() as all\n' +
      'point last(name) as title, last(value) as value'
      }
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
      query={
      'from examples.random-numbers\n' +
      'where name ~= /^One|Two|Three|Four$/\n' +
      'aggregate name, all() as all\n' +
      'point name as label, last(value) as value\n' +
      'sort value desc'
      } />
  </Dashboard>,
  document.getElementById('content')
);
