( function ( $ ) {
    "use strict";

    var monthly_emissions = null;
    var airport_statistics = null;

    document.addEventListener('DOMContentLoaded', function () {
        // Fetch data from the backend
        fetch('http://127.0.0.1:5000/data')
            .then(response => response.json())
            .then(data => {
                // Use data to render the chart using Chart.js
                monthly_emissions = data.monthly_statistics;
                console.log(monthly_emissions);
                // single bar chart
                var ctx = document.getElementById( "singelBarChart" );
                ctx.height = 150;
                var myChart = new Chart( ctx, {
                    type: 'bar',
                    data: {
                        labels: [ "May","Jun","Jul","Aug","Sept","Oct","Nov" ],
                        datasets: [
                            {
                                label: "Carbon Emissions (Million Metric Tonnes)",
                                data: monthly_emissions.total_emissions.map(value => value/1000000),
                                borderColor: "rgba(49, 142, 33, 0.9)",
                                borderWidth: "0",
                                backgroundColor: "rgba(49, 142, 33, 0.6)"
                                        }
                                    ]
                    },
                    options: {
                        scales: {
                            yAxes: [ {
                                ticks: {
                                    beginAtZero: true
                                }
                                            } ]
                        }
                    }
                } );


                //line chart
                var ctx = document.getElementById( "lineChart" );
                ctx.height = 150;
                var myChart = new Chart( ctx, {
                    type: 'line',
                    data: {
                        labels: [ "May", "June", "July", "Aug", "Sept","Oct","Nov" ],
                        datasets: [
                            {
                                label: "Max CO2 Emissions",
                                borderColor: "rgba(0,0,0,.09)",
                                borderWidth: "1",
                                backgroundColor: "rgba(0,0,0,.07)",
                                data: monthly_emissions.max_emissions
                                        },
                            {
                                label: "Avg CO2 Emissions (Metric Tonnes)",
                                borderColor: "rgba(49, 142, 33, 0.8)",
                                borderWidth: "1",
                                backgroundColor: "rgba(49, 142, 33, 0.4)",
                                pointHighlightStroke: "rgba(26,179,148,1)",
                                data: monthly_emissions.avg_emissions
                                        }
                                    ]
                    },
                    options: {
                        responsive: true,
                        tooltips: {
                            mode: 'index',
                            intersect: false
                        },
                        hover: {
                            mode: 'nearest',
                            intersect: true
                        }

                    }
                } );

                airport_statistics = data.airport_statistics;
                console.log(airport_statistics);

                // Weekly total emissions
                var ctx = document.getElementById( "weekly-emissions-chart" );
                ctx.height = 150;
                console.log(data.weekly_statistics);
                var myChart = new Chart( ctx, {
                    type: 'line',
                    data: {
                        labels: data.weekly_statistics.week,
                        type: 'line',
                        defaultFontFamily: 'Montserrat',
                        datasets: [ {
                            data: data.weekly_statistics.total_emissions.map(value => value/1000000),
                            label: "CO2 Emissions",
                            backgroundColor: 'rgba(49, 142, 33, 0.16)',
                            borderColor: 'rgba(49, 142, 33, 0.8)',
                            borderWidth: 3.5,
                            pointStyle: 'circle',
                            pointRadius: 5,
                            pointBorderColor: 'transparent',
                            pointBackgroundColor: 'rgba(49, 142, 33, 0.8)',
                                }, ]
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
                            position: 'top',
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
                                    labelString: 'Week'
                                },
                                
                                    } ],
                            yAxes: [ {
                                display: true,
                                gridLines: {
                                    display: false,
                                    drawBorder: false
                                },
                                scaleLabel: {
                                    display: true,
                                    labelString: 'C02 Emissions (Million Metric tonnes)'
                                }
                                    } ]
                        },
                        title: {
                            display: false,
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
                            data: data.airport_emissions_percent.total_emissions.map(value => value/1000000),
                            backgroundColor: [
                                                "rgb(97, 130, 100)",
                                                "rgb(121, 172, 120)",
                                                "rgb(176, 217, 177)",
                                                "rgb(208, 231, 210)",
                                                "rgb(236, 244, 214)",
                                                "rgb(154, 208, 194)",
                                                "rgb(45, 149, 150)",
                                                "rgb(38, 80, 115)",
                                                "rgba(0, 123, 255,0.5)",
                                                "rgba(177, 237, 157, 0.61)"
                                                // "rgba(242, 236, 56, 0.8)",
                                                // "rgba(228, 88, 0, 0.8)",
                                                // "rgba(241, 26, 169, 0.8)",
                                                // "rgba(18, 65, 87, 0.7)",
                                                
                                                
                                            ],
                            hoverBackgroundColor: [
                                                "rgb(97, 130, 100)",
                                                "rgb(121, 172, 120)",
                                                "rgb(176, 217, 177)",
                                                "rgb(208, 231, 210)",
                                                "rgb(236, 244, 214)",
                                                "rgb(154, 208, 194)",
                                                "rgb(45, 149, 150)",
                                                "rgb(38, 80, 115)",
                                                "rgba(0, 123, 255,0.5)",
                                                "rgba(177, 237, 157, 0.61)"
                                            ]

                                        } ],
                        labels: data.airport_emissions_percent.departureAirportName
                    },
                    options: {
                        responsive: true
                    }
                } );

                //Airport Emission comparison line chart
                console.log(data.airport_comparison_stats);
                var ctx = document.getElementById( "airport-comparison-chart" );
                ctx.height = 150;
                var multiLineChart = new Chart( ctx, {
                    type: 'line',
                    data: {
                        labels: data.airport_comparison_stats.month,
                        type: 'line',
                        defaultFontFamily: 'Montserrat',
                        datasets: [ {
                            label: "Los Angeles International Airport",
                            data: data.airport_comparison_stats["Los Angeles International Airport"].map(value => value/1000000),
                            backgroundColor: 'transparent',
                            borderColor: 'rgba(220,53,69,0.75)',
                            borderWidth: 3,
                            pointStyle: 'circle',
                            pointRadius: 5,
                            pointBorderColor: 'transparent',
                            pointBackgroundColor: 'rgba(220,53,69,0.75)',
                                }, {
                            label: "John F Kennedy International Airport",
                            data: data.airport_comparison_stats["John F Kennedy International Airport"].map(value => value/1000000),
                            backgroundColor: 'transparent',
                            borderColor: 'rgba(40,167,69,0.75)',
                            borderWidth: 3,
                            pointStyle: 'circle',
                            pointRadius: 5,
                            pointBorderColor: 'transparent',
                            pointBackgroundColor: 'rgba(40,167,69,0.75)',
                                },
                                {
                            label: "Chicago O'Hare International Airport",
                            data: data.airport_comparison_stats["Chicago O'Hare International Airport"].map(value => value/1000000),
                            backgroundColor: 'transparent',
                            borderColor: 'rgb(237, 225, 91)',
                            borderWidth: 3,
                            pointStyle: 'circle',
                            pointRadius: 5,
                            pointBorderColor: 'transparent',
                            pointBackgroundColor: 'rgb(237, 225, 91)',
                            }]
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
                                    labelString: 'CO2 Emissions (Million Metric tonnes)'
                                }
                                    } ]
                        },
                        title: {
                            display: false,
                            text: 'Normal Legend'
                        }
                    }
                } );

                //Monthly Distance
                var ctx = document.getElementById( "distance-chart" );
                ctx.height = 150;
                var myChart = new Chart( ctx, {
                    type: 'bar',
                    data: {
                        labels: [ "May","Jun","Jul","Aug","Sept","Oct","Nov" ],
                        datasets: [
                            {
                                label: "Distance Covered (KM)",
                                data: data.distance_statistics.total_distance,
                                borderColor: "rgba(49, 142, 33, 0.9)",
                                borderWidth: "0",
                                backgroundColor: "rgba(49, 142, 33, 0.6)"
                                        }
                                    ]
                    },
                    options: {
                        scales: {
                            yAxes: [ {
                                ticks: {
                                    beginAtZero: true
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
    
    //console.log(monthly_emissions);

    //bar chart
    var ctx = document.getElementById( "barChart" );
    //    ctx.height = 200;
    var myChart = new Chart( ctx, {
        type: 'bar',
        data: {
            labels: [ "January", "February", "March", "April", "May", "June", "July" ],
            datasets: [
                {
                    label: "My First dataset",
                    data: [ 65, 59, 80, 81, 56, 55, 40 ],
                    borderColor: "rgba(0, 123, 255, 0.9)",
                    borderWidth: "0",
                    backgroundColor: "rgba(0, 123, 255, 0.5)"
                            },
                {
                    label: "My Second dataset",
                    data: [ 28, 48, 40, 19, 86, 27, 90 ],
                    borderColor: "rgba(0,0,0,0.09)",
                    borderWidth: "0",
                    backgroundColor: "rgba(0,0,0,0.07)"
                            }
                        ]
        },
        options: {
            scales: {
                yAxes: [ {
                    ticks: {
                        beginAtZero: true
                    }
                                } ]
            }
        }
    } );

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


    //pie chart
    var ctx = document.getElementById( "pieChart" );
    ctx.height = 300;
    var myChart = new Chart( ctx, {
        type: 'pie',
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