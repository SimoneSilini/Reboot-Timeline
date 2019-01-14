// Hacked together aimlessly by Kai Hilton-Jones
// Improved by Tim Payne
// Improved by Vojta Plzak 3.2.2018
// Improved by Simone Silini 11.01.2019

require.config({
	paths : {
		//create alias to plugins
		async : '/extensions/googtimeline/async',
		goog : '/extensions/googtimeline/goog',
		propertyParser : '/extensions/googtimeline/propertyParser',
	}
});
define(["jquery", 'goog!visualization,1,packages:[corechart,table,timeline]'], function($) {'use strict';
	return {
		initialProperties : {
			version : 1.0,
			qHyperCubeDef : {
				qDimensions : [],
				qMeasures : [],
				qInitialDataFetch : [{
					qWidth : 20,
					qHeight : 400
				}]
			},
			chartType : "timeline",
			showRowLabels : true,
			groupByRowLabel : false,
            singleColor: false,
			singleColorExpression: "",
			colorByRowLabel : false,
			colorsExpression: "",
            backgroundColorExpression: "",
			dateFormat: "d/M/yy",
            thirdDimension: "t"
		},
		//property panel
		definition : {
			type : "items",
			component : "accordion",
			items : {
				dimensions : {
					uses : "dimensions",
					min : 3,
					max : 6
				},
				sorting : {
					uses : "sorting"
				},
				settings : {
					uses : "settings",
					items : 
					{
						selection1 : 
						{
							type : "boolean",
							component : "switch",
							label : "Show Row Labels",
							ref : "showRowLabels",
							options : [{
								value : true,
								label : "On"
							},{
								value : false,
								label : "Off"
							}]
						},
						selection2 : 
						{
							type : "boolean",
							component : "switch",
							label : "Group Row Label",
							ref : "groupByRowLabel",
							options : [{
								value : true,
								label : "On"
							},{
								value : false,
								label : "Off"
							}]
						},
                        selection3 :
                            {
                            	type : "items",
								label: "Colors",
								items:
                                    {
                                        SingleColor:
                                            {
                                                type: "items",
                                                label: "Single Color",
                                                items:
                                                    {
                                                        singleColor:
                                                            {
                                                                type: "boolean",
                                                                component: "switch",
                                                                label: "Use Single Color",
                                                                ref: "singleColor",
                                                                options: [{
                                                                    value: true,
                                                                    label: "On"
                                                                }, {
                                                                    value: false,
                                                                    label: "Off"
                                                                }]
                                                            },
                                                        singleColorExpression:
                                                            {
                                                                type: "string",
                                                                label: "Single Color expression",
                                                                ref: "singleColorExpression",
                                                                expression: "optional"
                                                            }
                                                    }
                                            },
                                        colorByRowLabel:
                                            {
                                                type: "items",
                                                label: "Color by Row Label",
                                                items:
                                                    {
                                                        ColorByRowLabel:
                                                            {

                                                                type : "boolean",
                                                                component : "switch",
                                                                label : "Color by Row Label",
                                                                ref : "colorByRowLabel",
                                                                options : [{
                                                                    value : true,
                                                                    label : "On"
                                                                },{
                                                                    value : false,
                                                                    label : "Off"
                                                                }]
                                                            }
                                                    }
                                            },
										backroundColor:
											{
													type: "string",
													label: "Background Color",
													ref: "backgroundColorExpression",
													expression: "optional"
											}
                                    }

                            },
                        selection5 :
                            {
                                type : "string",
                                label : "Date format",
                                ref : "dateFormat",
                                expression:"optional"
                            },
                        selection6: {
                            type: "string",
                            component: "buttongroup",
                            label: "Colors or Tooltip",
                            ref: "thirdDimension",
                            options: [{
                                value: "c",
                                label: "Colors",
                                tooltip: "Select to use third dimension for coloring"
                            }, {
                                value: "t",
                                label: "Tooltip",
                                tooltip: "Select to use third dimension for tooltip"
                            }],
                            defaultValue: "c"
                        }

					}
				}
			}
		},
		snapshot : {
			canTakeSnapshot : true
		},

		paint : function($element, layout) {

			var self = this, elemNos = [], dimCount = this.backendApi.getDimensionInfos().length;
			var data = new google.visualization.DataTable();

			data.addColumn({ type: 'string', id: 'Campaign' });

			if(dimCount == 6) {
                data.addColumn({ type: 'string', id: 'Name' });
                data.addColumn({ type: 'string', role: 'style' });
                data.addColumn({ type: 'string', role: 'tooltip'});

			}else if(dimCount==5) {
                data.addColumn({ type: 'string', id: 'Name' });
                if(layout.thirdDimension == 'c') {
                    data.addColumn({ type: 'string', role: 'style' });
				} else {
                    data.addColumn({ type: 'string', role: 'tooltip'});
				}
			} else if(dimCount==4) {
                data.addColumn({ type: 'string', id: 'Name' });
            }
        	data.addColumn({ type: 'date', id: 'Start' });
        	data.addColumn({ type: 'date', id: 'End' });

			this.backendApi.eachDataRow(function(key, row) {
				var values = [];
				row.forEach(function(cell, col) {
					
					//values.push(cell.qText);
					if(dimCount==6) {
                        if(col<4)
                        {
                            values.push(cell.qText);
                        } else {
                            var myDate = new Date(cell.qText);
                            values.push(myDate);
                        }
					}else if(dimCount==5) {
                        if(col<3)
                        {
                            values.push(cell.qText);
                        } else {
                            var myDate = new Date(cell.qText);
                            values.push(myDate);
                        }
					} else if(dimCount==4) {
						if(col<2)
						{
							values.push(cell.qText);
						} else {
							var myDate = new Date(cell.qText);
							values.push(myDate);
						}
					} else {
						if(col<1)
						{
							values.push(cell.qText);
						} else {
							var myDate = new Date(cell.qText);
							values.push(myDate);
						}
					}
					
				});
				data.addRows([values]);
				//selections will always be on first dimension
				elemNos.push(row[0].qElemNumber);
			});
			
			var chart = new google.visualization.Timeline($element[0]);

			//Instantiating and drawing the chart
			//var chart = new google.visualization[layout.chartType]($element[0]);
			var options;
			if(layout.singleColor === true)
			{
				options =
                    {
                        chartArea : {
                            left : 20,
                            top : 20,
                            width : "100%",
                            height : "100%"
                        },
                        timeline: { showRowLabels : layout.showRowLabels,
                            groupByRowLabel : layout.groupByRowLabel,
                            singleColor: layout.singleColorExpression ,
                            //colorByRowLabel: layout.colorByRowLabel,
							backgroundColor: layout.backgroundColorExpression,
                            rowLabelStyle: {fontName: 'Arial', fontSize: 15 },
                            barLabelStyle: { fontName: 'Verdana', fontSize: 13 }
                        },
                        hAxis: {
                            format: layout.dateFormat
                        }
                    }
			} else if(layout.colorByRowLabel === true) {
                options =
				{
                    chartArea : {
                        left : 20,
                            top : 20,
                            width : "100%",
                            height : "100%"
                    },
                    timeline: { showRowLabels : layout.showRowLabels,
                        groupByRowLabel : layout.groupByRowLabel,
                        colorByRowLabel: layout.colorByRowLabel,
                        backgroundColor: layout.backgroundColorExpression,
                        rowLabelStyle: {fontName: 'Arial', fontSize: 15 },
                        barLabelStyle: { fontName: 'Verdana', fontSize: 13 }
                    },
                    hAxis: {
                        format: layout.dateFormat.replace("'", "")
                    }
                }
			} else {
                options =
                    {
                        chartArea : {
                            left : 20,
                            top : 20,
                            width : "100%",
                            height : "100%"
                        },
                        timeline: { showRowLabels : layout.showRowLabels,
                            groupByRowLabel : layout.groupByRowLabel,
                            colorByRowLabel : false,
                            backgroundColor : layout.backgroundColorExpression,
                            rowLabelStyle: {fontName: 'Arial', fontSize: 15 },
                            barLabelStyle: { fontName: 'Verdana', fontSize: 13 }
                        },
                        hAxis: {
                            format: layout.dateFormat.replace("'", "")
                        }
                    }
			}


                chart.draw(data, options );
			//selections
			var selections = [];
			var tim= [];
			google.visualization.events.addListener(chart, 'select', function(e) {
				var sel = chart.getSelection();
				
				tim=sel;
				//sel.forEach(function(val) {
					
					selections[0]=elemNos[sel[0].row]
					self.selectValues(0, selections, true);
				//});
				//chart.setSelection(tim);
				//selections = selections.concat(sel);
			});
			//chart.setSelection([]);
			//chart.setSelection(tim);

		}
	};

});
