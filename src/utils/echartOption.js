import * as echarts from 'echarts';
export default {
  // 单柱状图
  barOption({ data = [], extOption = {} }) {
    const {
      title = {},
      tooltip = {},
      dataZoom = [],
      legend = {},
      grid = {},
      xAxis = {},
      yAxis = {},
      itemStyle = {},
      xType = 'category',
      yType = 'value',
      barWidth = 24
    } = extOption;
    const defaultOption = {
      title: {
        left: 'left',
        textStyle: {
          color: '#fff'
        },
        ...title
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(50,50,50,0.8)',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        },
        textStyle: {
          color: '#fff'
        },
        ...tooltip
      },
      legend: {
        left: 'center',
        bottom: 'bottom',
        textStyle: {
          color: '#fff'
        },
        ...legend
      },
      grid: {
        containLabel: true,
        ...grid
      },
      dataZoom: [...dataZoom],
      xAxis: [
        {
          type: xType,
          axisTick: {
            show: false
          },
          axisLine: {
            show: true
          },
          splitLine: {
            show: true
          },
          axisLabel: {
            textStyle: {
              color: '#fff', //更改坐标轴文字颜色
              fontSize: 12 //更改坐标轴文字大小
            }
          },
          ...xAxis
        }
      ],
      yAxis: [
        {
          type: yType,
          axisLine: {
            show: true
          },
          yxisTick: {
            alignWithLabel: false
          },
          splitLine: {
            show: false,
            lineStyle: {
              type: 'dashed',
              show: true
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#fff', //更改坐标轴文字颜色
              fontSize: 12 //更改坐标轴文字大小
            }
          },
          ...yAxis
        }
      ],
      series: [
        {
          type: 'bar',
          barWidth: barWidth,
          z: 2,
          data,
          label: {
            show: false
          },
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: '#25A6FF' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(37, 166, 255, 0)' // 100% 处的颜色
                }
              ]
            },
            ...itemStyle
          }
        }
      ]
    };
    return defaultOption;
  },
  // 环形
  ringOption({ data = [], extOption = {} }) {
    const {
      color = ['#008fbb', '#1acbdb', '#f7a900', '#ded802', '#34cc99', '#8dbc00'],
      title = {},
      tooltip = {},
      dataZoom = [],
      legend = {},
      grid = {},
      center = ['50%', '50%'],
      firstLabel = {} //第一组label显示数据
    } = extOption;

    const defaultOption = {
      color,
      title: {
        left: 'left',
        textStyle: {
          color: '#fff'
        },
        subtextStyle: {
          color: '#fff'
        },
        ...title
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(50,50,50,0.8)',
        textStyle: {
          color: '#fff'
        },
        ...tooltip
      },
      legend: {
        left: 'center',
        bottom: 'bottom',
        textStyle: {
          color: '#fff'
        },
        ...legend
      },
      grid: {
        containLabel: true,
        ...grid
      },
      dataZoom: [...dataZoom],

      series: [
        {
          name: '',
          type: 'pie',
          center,
          radius: ['65%', '90%'],
          avoidLabelOverlap: false,
          label: {
            show: false
          },
          data: data,
          hoverAnimation: false,
          ...firstLabel
        },
        {
          name: '',
          type: 'pie',
          radius: [0, '56%'],
          center,
          label: {
            show: false
          },
          animation: false,
          tooltip: {
            show: false
          },
          itemStyle: {
            normal: {
              color: new echarts.graphic.RadialGradient(
                0.5,
                0.5,
                0.7,
                [
                  {
                    offset: 0.5,
                    color: 'rgba(165, 218, 255, 0)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(165, 218, 255, 1)'
                  }
                ],
                false
              )
            }
          },
          hoverAnimation: false,
          data: [100]
        }
      ]
    };
    return defaultOption;
  },
  //环形单簇
  onePie({ extOption = {} }) {
    const {
      color = ['#008fbb', '#1acbdb', '#f7a900', '#ded802', '#34cc99', '#8dbc00'],
      title = {},
      tooltip = {},
      dataZoom = [],
      legend = {},
      grid = {},
      center = ['50%', '50%'],
      itemStyle
    } = extOption;
    const defaultOption = {
      color,
      title: {
        left: 'left',
        textStyle: {
          color: '#fff'
        },
        subtextStyle: {
          color: '#fff'
        },
        ...title
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(50,50,50,0.8)',
        textStyle: {
          color: '#fff'
        },
        ...tooltip
      },
      legend: {
        left: 'center',
        bottom: 'bottom',
        textStyle: {
          color: '#f00'
        },
        ...legend
      },
      grid: {
        containLabel: true,
        ...grid
      },
      dataZoom: [...dataZoom],
      series: [
        {
          type: 'pie',
          radius: ['59%', '70%'],
          label: {
            normal: {
              position: 'center'
            }
          },
          hoverAnimation: false,
          data: [
            {
              value: 100,
              itemStyle: {
                normal: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: 'rgba(255, 185, 2, 0)' // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: 'rgba(255, 185, 2, 1) ' // 100% 处的颜色
                      }
                    ],
                    globalCoord: false // 缺省为 false
                  }
                },
                ...itemStyle
              },
              label: false
            },
            {
              value: 0,
              name: '占位',
              label: false
            }
          ]
        },
        {
          name: '',
          type: 'pie',
          radius: [0, '56%'],
          center,
          label: {
            show: false
          },
          animation: false,
          itemStyle: {
            normal: {
              color: new echarts.graphic.RadialGradient(
                0.5,
                0.5,
                0.7,
                [
                  {
                    offset: 0.5,
                    color: 'rgba(165, 218, 255, 0)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(165, 218, 255, 1)'
                  }
                ],
                false
              )
            }
          },
          hoverAnimation: false,
          data: [100]
        },
        {
          type: 'gauge',
          startAngle: -269,
          endAngle: 333,
          center: ['50%', '52%'],
          progress: {
            show: true,
            itemStyle: {
              color: color[0]
            },
            width: 10
          },
          axisLine: {
            show: false
          },

          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          anchor: {
            show: false
          },
          detail: {
            show: false
          },
          pointer: {
            show: false
          },
          data: [
            {
              value: 1
            }
          ]
        }
      ]
    };
    return defaultOption;
  },
  // 单柱状多组数据
  barMajority({ extOption = {} }) {
    const { dataZoom = [], yAxis = {}, xAxis = {}, series = [], lengend } = extOption;
    const defaultOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '2%',
        right: '4%',
        bottom: '14%',
        top: '16%',
        containLabel: true
      },
      legend: {
        data: lengend,
        right: 'center',
        top: 6,
        textStyle: {
          color: '#fff'
        },
        itemWidth: 12,
        itemHeight: 10
      },
      xAxis: {
        type: 'category',
        axisTick: {
          show: false
        },
        axisLabel: {
          textStyle: {
            color: '#fff' //更改坐标轴文字颜色
          },
          formatter: function (params) {
            //超过五个字换行
            let newParamsName = '';
            const paramsNameNumber = params.length;
            const provideNumber = 8; //一行显示几个字
            const rowNumber = Math.ceil(paramsNameNumber / provideNumber);
            if (paramsNameNumber > provideNumber) {
              for (let p = 0; p < rowNumber; p++) {
                let tempStr = '';
                const start = p * provideNumber;
                const end = start + provideNumber;
                if (p === rowNumber - 1) {
                  tempStr = params.substring(start, paramsNameNumber);
                } else {
                  tempStr = params.substring(start, end) + '\n';
                }
                newParamsName += tempStr;
              }
            } else {
              newParamsName = params;
            }
            return newParamsName;
          }
        },
        axisLine: {
          show: true
        },
        ...xAxis
      },

      yAxis: {
        type: 'value',
        axisLine: {
          show: true
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#979797',
            type: [10, 15],
            dashOffset: 0
          }
        },
        axisLabel: {
          textStyle: {
            color: '#fff', //更改坐标轴文字颜色
            fontSize: 12 //更改坐标轴文字大小
          }
        },
        ...yAxis
      },
      dataZoom: [...dataZoom],
      series: [
        // 示例：自行配置数组图形
        // {
        //   name: '1月',
        //   type: 'bar',
        //   barWidth: '10%',
        //   stack: '产量',
        //   itemStyle: {
        //     normal: {
        //       color: '#3399FF'
        //     }
        //   },
        //   data: ['100', '200']
        // },
        ...series
      ]
    };

    return defaultOption;
  }
};
