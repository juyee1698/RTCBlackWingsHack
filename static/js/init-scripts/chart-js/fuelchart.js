( function ( $ ) {
    "use strict";

    var fuel_type = null;
    var sector_id = null;
    var state_id = null;
    var yearly_statistics = null;
    var fuel_barchart = null;
    var pieChart;
    var lineChart;
    var doughnutChart;
    var multiLineChart;

    document.getElementById("fuel-type").addEventListener("change", function() {
        // Get the selected option from the dropdown
        fuel_type = this.value;
        //console.log(fuel_type);
        fetch(`http://127.0.0.1:5000/fuelemissions_calculation?fuel_type=${fuel_type}&sector_id=${sector_id}&state_id=${state_id}`)
            .then(response => response.json())
            .then(data => {
                // Use data to render the chart using Chart.js
                yearly_statistics = data.yearly_statistics;
                console.log(yearly_statistics)

                //Fuel, Sector, State Yearly Statistics Line chart
                if (lineChart) {
                    lineChart.destroy();
                }
                var ctx = document.getElementById( "fuel-yearly-stats" );
                ctx.height = 150;
                lineChart = new Chart( ctx, {
                    type: 'line',
                    data: {
                        labels: yearly_statistics.period,
                        type: 'line',
                        defaultFontFamily: 'Montserrat',
                        datasets: [ {
                            label: "CO2 Emissions",
                            data: yearly_statistics.total_emissions,
                            backgroundColor: 'transparent',
                            borderColor: 'rgba(49, 142, 33, 0.9)',
                            borderWidth: 3,
                            pointStyle: 'circle',
                            pointRadius: 5,
                            pointBorderColor: 'transparent',
                            pointBackgroundColor: 'rgba(49, 142, 33, 0.6)',
                                } ]
                    },
                    options: {
                        responsive: true,
                        tooltips: {
                            mode: 'index',
                            titleFontSize: 12,
                            titleFontColor: '#000',
                            bodyFontColor: '#000',
                            backgroundColor: '#fff',
                            titleFontFamily: 'Montserrat',
                            bodyFontFamily: 'Montserrat',
                            cornerRadius: 3,
                            intersect: false,
                        },
                        legend: {
                            display: false,
                            labels: {
                                usePointStyle: true,
                                fontFamily: 'Montserrat',
                            },
                        },
                        scales: {
                            xAxes: [ {
                                display: true,
                                gridLines: {
                                    display: false,
                                    drawBorder: false
                                },
                                scaleLabel: {
                                    display: false,
                                    labelString: 'Year'
                                }
                                    } ],
                            yAxes: [ {
                                display: true,
                                gridLines: {
                                    display: false,
                                    drawBorder: false
                                },
                                scaleLabel: {
                                    display: true,
                                    labelString: 'C02 Emissions (in million metric tons of CO2)'
                                }
                                    } ]
                        },
                        title: {
                            display: false,
                            text: 'Normal Legend'
                        }
                    }
                } );

                //Pie chart for region statistics
                if (pieChart) {
                    pieChart.destroy();
                }
                var ctx = document.getElementById( "pieChart" );
                ctx.height = 300;
                pieChart = new Chart( ctx, {
                    type: 'pie',
                    data: {
                        datasets: [ {
                            data: data.region_statistics[fuel_type],
                            backgroundColor: [
                                                "rgba(0,0,0,0.07)",
                                                "rgb(97, 130, 100)",
                                                "rgb(121, 172, 120)",
                                                "rgb(176, 217, 177)",
                                                "rgb(208, 231, 210)",
                                                "rgb(72, 181, 196)",
                                                "rgb(118, 198, 143)",
                                                "rgb(166, 215, 91)",
                                                "rgb(201, 229, 47)",
                                                "rgb(208, 238, 17)",
                                                "rgb(235, 220, 120)"
                                                
                                            ],
                            hoverBackgroundColor: [
                                                "rgba(0,0,0,0.07)",
                                                "rgb(97, 130, 100)",
                                                "rgb(121, 172, 120)",
                                                "rgb(176, 217, 177)",
                                                "rgb(208, 231, 210)",
                                                "rgb(72, 181, 196)",
                                                "rgb(118, 198, 143)",
                                                "rgb(166, 215, 91)",
                                                "rgb(201, 229, 47)",
                                                "rgb(208, 238, 17)",
                                                "rgb(235, 220, 120)"
                                            ]

                                        } ],
                        labels: data.region_statistics.region
                    },
                    options: {
                        responsive: true
                    }
                } );

                //Doughnut chart for sector statistics
                if (doughnutChart) {
                    doughnutChart.destroy();
                }

                var ctx = document.getElementById( "doughutChart" );
                ctx.height = 150;
                doughnutChart = new Chart( ctx, {
                    type: 'doughnut',
                    data: {
                        datasets: [ {
                            data: data.sector_statistics[fuel_type],
                            backgroundColor: [
                                                "rgb(115, 144, 114)",
                                                "rgb(79, 111, 82)",
                                                "rgb(58, 77, 57)"
                                            ],
                            hoverBackgroundColor: [
                                                "rgb(115, 144, 114)",
                                                "rgb(79, 111, 82)",
                                                "rgb(58, 77, 57)"
                                            ]

                                        } ],
                        labels: data.sector_statistics.sector_name
                    },
                    options: {
                        responsive: true
                    }
                } );


                //Multiple lines chart for comparing sectors
                var ctx = document.getElementById( "sector-comparison-chart" );
                ctx.height = 150;

                if (multiLineChart) {
                    multiLineChart.destroy();
                }

                console.log(data.sector_statistics_yearly);
                multiLineChart = new Chart( ctx, {
                    type: 'line',
                    data: {
                        labels: data.sector_statistics_yearly.period,
                        type: 'line',
                        defaultFontFamily: 'Montserrat',
                        datasets: [ {
                            label: "Industrial CO2 emissions",
                            data: data.sector_statistics_yearly['Industrial carbon dioxide emissions'],
                            backgroundColor: 'transparent',
                            borderColor: 'rgb(206, 206, 90)',
                            borderWidth: 3,
                            pointStyle: 'circle',
                            pointRadius: 5,
                            pointBorderColor: 'transparent',
                            pointBackgroundColor: 'rgb(206, 206, 90)',
                                },
                            
                            {
                            label: "Commercial CO2 Emissions",
                            data: data.sector_statistics_yearly['Commercial carbon dioxide emissions'],
                            backgroundColor: 'transparent',
                            borderColor: 'rgb(255, 225, 123)',
                            borderWidth: 3,
                            pointStyle: 'circle',
                            pointRadius: 5,
                            pointBorderColor: 'transparent',
                            pointBackgroundColor: 'rgb(255, 225, 123)',
                            },
                            {
                            label: "Residential CO2 Emissions",
                            data: data.sector_statistics_yearly['Residential carbon dioxide emissions'],
                            backgroundColor: 'transparent',
                            borderColor: 'rgb(253, 141, 20)',
                            borderWidth: 3,
                            pointStyle: 'circle',
                            pointRadius: 5,
                            pointBorderColor: 'transparent',
                            pointBackgroundColor: 'rgb(253, 141, 20)',
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        tooltips: {
                            mode: 'index',
                            titleFontSize: 12,
                            titleFontColor: '#000',
                            bodyFontColor: '#000',
                            backgroundColor: '#fff',
                            titleFontFamily: 'Montserrat',
                            bodyFontFamily: 'Montserrat',
                            cornerRadius: 3,
                            intersect: false,
                        },
                        legend: {
                            display: true,
                            labels: {
                                usePointStyle: true,
                                fontFamily: 'Montserrat',
                            },
                        },
                        scales: {
                            xAxes: [ {
                                display: true,
                                gridLines: {
                                    display: false,
                                    drawBorder: false
                                },
                                scaleLabel: {
                                    display: false,
                                    labelString: 'Year'
                                }
                                    } ],
                            yAxes: [ {
                                display: true,
                                gridLines: {
                                    display: false,
                                    drawBorder: false
                                },
                                scaleLabel: {
                                    display: true,
                                    labelString: 'C02 Emissions (in million metric tons of CO2)'
                                }
                                    } ]
                        },
                        title: {
                            display: false,
                            text: 'Normal Legend'
                        }
                    }
                } );

            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    
    });

    document.getElementById("sector-id").addEventListener("change", function() {
        sector_id = this.value;
        console.log(fuel_type)
        console.log(sector_id);
        fetch(`http://127.0.0.1:5000/fuelemissions_calculation?fuel_type=${fuel_type}&sector_id=${sector_id}&state_id=${state_id}`)
            .then(response => response.json())
            .then(data => {
                // Use data to render the chart using Chart.js
                //yearly_statistics = data;
                console.log(data)

                if (lineChart) {
                    lineChart.destroy();
                }

                var ctx = document.getElementById( "fuel-yearly-stats" );
                ctx.height = 150;
                lineChart = new Chart( ctx, {
                    type: 'line',
                    data: {
                        labels: data.yearly_statistics.period,
                        type: 'line',
                        defaultFontFamily: 'Montserrat',
                        datasets: [ {
                            label: "CO2 Emissions",
                            data: data.yearly_statistics.total_emissions,
                            backgroundColor: 'transparent',
                            borderColor: 'rgba(49, 142, 33, 0.9)',
                            borderWidth: 3,
                            pointStyle: 'circle',
                            pointRadius: 5,
                            pointBorderColor: 'transparent',
                            pointBackgroundColor: 'rgba(49, 142, 33, 0.6)',
                                } ]
                    },
                    options: {
                        responsive: true,
                        tooltips: {
                            mode: 'index',
                            titleFontSize: 12,
                            titleFontColor: '#000',
                            bodyFontColor: '#000',
                            backgroundColor: '#fff',
                            titleFontFamily: 'Montserrat',
                            bodyFontFamily: 'Montserrat',
                            cornerRadius: 3,
                            intersect: false,
                        },
                        legend: {
                            display: false,
                            labels: {
                                usePointStyle: true,
                                fontFamily: 'Montserrat',
                            },
                        },
                        scales: {
                            xAxes: [ {
                                display: true,
                                gridLines: {
                                    display: false,
                                    drawBorder: false
                                },
                                scaleLabel: {
                                    display: false,
                                    labelString: 'Year'
                                }
                                    } ],
                            yAxes: [ {
                                display: true,
                                gridLines: {
                                    display: false,
                                    drawBorder: false
                                },
                                scaleLabel: {
                                    display: true,
                                    labelString: 'C02 Emissions (in million metric tons of CO2)'
                                }
                                    } ]
                        },
                        title: {
                            display: false,
                            text: 'Normal Legend'
                        }
                    }
                } );
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    });

    document.getElementById("state-id").addEventListener("change", function() {
        state_id = this.value;
        console.log(fuel_type)
        console.log(state_id);
        fetch(`http://127.0.0.1:5000/fuelemissions_calculation?fuel_type=${fuel_type}&sector_id=${sector_id}&state_id=${state_id}`)
            .then(response => response.json())
            .then(data => {
                // Use data to render the chart using Chart.js
                //yearly_statistics = data;
                console.log(data)

                if (lineChart) {
                    lineChart.destroy();
                }

                var ctx = document.getElementById( "fuel-yearly-stats" );
                ctx.height = 150;
                lineChart = new Chart( ctx, {
                    type: 'line',
                    data: {
                        labels: data.yearly_statistics.period,
                        type: 'line',
                        defaultFontFamily: 'Montserrat',
                        datasets: [ {
                            label: "CO2 Emissions",
                            data: data.yearly_statistics.total_emissions,
                            backgroundColor: 'transparent',
                            borderColor: 'rgba(49, 142, 33, 0.9)',
                            borderWidth: 3,
                            pointStyle: 'circle',
                            pointRadius: 5,
                            pointBorderColor: 'transparent',
                            pointBackgroundColor: 'rgba(49, 142, 33, 0.6)',
                                } ]
                    },
                    options: {
                        responsive: true,
                        tooltips: {
                            mode: 'index',
                            titleFontSize: 12,
                            titleFontColor: '#000',
                            bodyFontColor: '#000',
                            backgroundColor: '#fff',
                            titleFontFamily: 'Montserrat',
                            bodyFontFamily: 'Montserrat',
                            cornerRadius: 3,
                            intersect: false,
                        },
                        legend: {
                            display: false,
                            labels: {
                                usePointStyle: true,
                                fontFamily: 'Montserrat',
                            },
                        },
                        scales: {
                            xAxes: [ {
                                display: true,
                                gridLines: {
                                    display: false,
                                    drawBorder: false
                                },
                                scaleLabel: {
                                    display: false,
                                    labelString: 'Year'
                                }
                                    } ],
                            yAxes: [ {
                                display: true,
                                gridLines: {
                                    display: false,
                                    drawBorder: false
                                },
                                scaleLabel: {
                                    display: true,
                                    labelString: 'C02 Emissions (in million metric tons of CO2)'
                                }
                                    } ]
                        },
                        title: {
                            display: false,
                            text: 'Normal Legend'
                        }
                    }
                } );
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    });

    document.addEventListener('DOMContentLoaded', function () {
        // Fetch data from the backend
        fetch('http://127.0.0.1:5000/sectorfuel_calculation')
            .then(response => response.json())
            .then(data => {
                // Use data to render the chart using Chart.js
                fuel_barchart = data.fuel_barchart;
                console.log(fuel_barchart);

                //multiple bar chart

                var ctx = document.getElementById( "barChart" );
                //    ctx.height = 200;
                var myChart = new Chart( ctx, {
                    type: 'bar',
                    data: {
                        labels: fuel_barchart.period,
                        datasets: [
                            {
                                label: "Coal",
                                data: fuel_barchart['Coal'],
                                borderColor: "rgb(95, 111, 82)",
                                borderWidth: "0",
                                backgroundColor: "rgb(95, 111, 82)"
                                        },
                            {
                                label: "Natural Gas",
                                data: fuel_barchart['Natural Gas'],
                                borderColor: "rgb(169, 179, 136)",
                                borderWidth: "0",
                                backgroundColor: "rgb(169, 179, 136)"
                                        },
                            {
                                label: "Petroleum",
                                data: fuel_barchart['Petroleum'],
                                borderColor: "rgb(254, 250, 224)",
                                borderWidth: "0",
                                backgroundColor: "rgb(254, 250, 224))"
                                        }
                                    ]
                    },
                    options: {
                        scales: {
                            yAxes: [ {
                                ticks: {
                                    beginAtZero: true
                                },
                                scaleLabel: {
                                    display: true,
                                    labelString: 'C02 Emissions (in million metric tons of CO2)'
                                }
                                            } ]
                        }
                    }
                } );
                

            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    });



    

    //radar chart
    var ctx = document.getElementById( "radarChart" );
    ctx.height = 160;
    var myChart = new Chart( ctx, {
        type: 'radar',
        data: {
            labels: [ [ "Eating", "Dinner" ], [ "Drinking", "Water" ], "Sleeping", [ "Designing", "Graphics" ], "Coding", "Cycling", "Running" ],
            datasets: [
                {
                    label: "My First dataset",
                    data: [ 65, 59, 66, 45, 56, 55, 40 ],
                    borderColor: "rgba(0, 123, 255, 0.6)",
                    borderWidth: "1",
                    backgroundColor: "rgba(0, 123, 255, 0.4)"
                            },
                {
                    label: "My Second dataset",
                    data: [ 28, 12, 40, 19, 63, 27, 87 ],
                    borderColor: "rgba(0, 123, 255, 0.7",
                    borderWidth: "1",
                    backgroundColor: "rgba(0, 123, 255, 0.5)"
                            }
                        ]
        },
        options: {
            legend: {
                position: 'top'
            },
            scale: {
                ticks: {
                    beginAtZero: true
                }
            }
        }
    } );

    
    

    //Sales chart
    var ctx = document.getElementById( "sales-chart" );
    ctx.height = 150;
    var myChart = new Chart( ctx, {
        type: 'line',
        data: {
            labels: [ "2010", "2011", "2012", "2013", "2014", "2015", "2016" ],
            type: 'line',
            defaultFontFamily: 'Montserrat',
            datasets: [ {
                label: "Foods",
                data: [ 0, 30, 10, 120, 50, 63, 10 ],
                backgroundColor: 'transparent',
                borderColor: 'rgba(220,53,69,0.75)',
                borderWidth: 3,
                pointStyle: 'circle',
                pointRadius: 5,
                pointBorderColor: 'transparent',
                pointBackgroundColor: 'rgba(220,53,69,0.75)',
                    }, {
                label: "Electronics",
                data: [ 0, 50, 40, 80, 40, 79, 120 ],
                backgroundColor: 'transparent',
                borderColor: 'rgba(40,167,69,0.75)',
                borderWidth: 3,
                pointStyle: 'circle',
                pointRadius: 5,
                pointBorderColor: 'transparent',
                pointBackgroundColor: 'rgba(40,167,69,0.75)',
                    } ]
        },
        options: {
            responsive: true,

            tooltips: {
                mode: 'index',
                titleFontSize: 12,
                titleFontColor: '#000',
                bodyFontColor: '#000',
                backgroundColor: '#fff',
                titleFontFamily: 'Montserrat',
                bodyFontFamily: 'Montserrat',
                cornerRadius: 3,
                intersect: false,
            },
            legend: {
                display: false,
                labels: {
                    usePointStyle: true,
                    fontFamily: 'Montserrat',
                },
            },
            scales: {
                xAxes: [ {
                    display: true,
                    gridLines: {
                        display: false,
                        drawBorder: false
                    },
                    scaleLabel: {
                        display: false,
                        labelString: 'Month'
                    }
                        } ],
                yAxes: [ {
                    display: true,
                    gridLines: {
                        display: false,
                        drawBorder: false
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Value'
                    }
                        } ]
            },
            title: {
                display: false,
                text: 'Normal Legend'
            }
        }
    } );

    //doughut chart
    var ctx = document.getElementById( "doughutChart" );
    ctx.height = 150;
    var myChart = new Chart( ctx, {
        type: 'doughnut',
        data: {
            datasets: [ {
                data: [ 45, 25, 20, 10 ],
                backgroundColor: [
                                    "rgba(0, 123, 255,0.9)",
                                    "rgba(0, 123, 255,0.7)",
                                    "rgba(0, 123, 255,0.5)",
                                    "rgba(0,0,0,0.07)"
                                ],
                hoverBackgroundColor: [
                                    "rgba(0, 123, 255,0.9)",
                                    "rgba(0, 123, 255,0.7)",
                                    "rgba(0, 123, 255,0.5)",
                                    "rgba(0,0,0,0.07)"
                                ]

                            } ],
            labels: [
                            "green",
                            "green",
                            "green",
                            "green"
                        ]
        },
        options: {
            responsive: true
        }
    } );

    //polar chart
    var ctx = document.getElementById( "polarChart" );
    ctx.height = 150;
    var myChart = new Chart( ctx, {
        type: 'polarArea',
        data: {
            datasets: [ {
                data: [ 15, 18, 9, 6, 19 ],
                backgroundColor: [
                                    "rgba(0, 123, 255,0.9)",
                                    "rgba(0, 123, 255,0.8)",
                                    "rgba(0, 123, 255,0.7)",
                                    "rgba(0,0,0,0.2)",
                                    "rgba(0, 123, 255,0.5)"
                                ]

                            } ],
            labels: [
                            "green",
                            "green",
                            "green",
                            "green"
                        ]
        },
        options: {
            responsive: true
        }
    } );

    


    


} )( jQuery );