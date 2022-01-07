import { Component, OnInit, TemplateRef, ElementRef, ViewChild } from '@angular/core';
import { OnDestroy } from '@angular/cli'
import { Routes, RouterModule } from '@angular/router';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { credentials } from '../../credentials';
import { CookieService } from 'ngx-cookie-service';
//authService
import { AuthServiceService } from '../../auth-service.service';
import { GetItemService } from '../../get-item.service';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { isEmpty } from 'rxjs/operator/isEmpty';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  navigationSubscription;
  @ViewChild('openModal') openModal: ElementRef;

  constructor(
    private router: Router, private activeroute: ActivatedRoute, private http: Http, private cookieService: CookieService, private authService: AuthServiceService, private GetItemService: GetItemService, private modalService: BsModalService
  ) { }
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  public doughnutChartLabels: string[] = [];
  public doughnutChartData: number[] = [];
  public doughnutChartType: string = 'doughnut';

  public doughnutChartOptions: any = {
    legend: { position: 'left' },
    boxWidth: 100,
    tooltipEvents: [],
    showTooltips: false,
    tooltipCaretSize: 0,
    pieceLabel: {
      render: function (args) {
        //
        const percentage = args.percentage,
          value = args.value;

        // return label + ': ' + value;
        return value;
        // return percentage + '%';
      }
      // position: 'outside',
      // fontStyle: 'bold',
    }


  }


  public validityLabels: string[] = [];
  public validityData: number[] = [];
  public validityType: string = 'doughnut';

  public validityOptions: any = {
    legend: { position: 'left' },
    boxWidth: 100,
    tooltipEvents: [],
    showTooltips: false,
    tooltipCaretSize: 0,
    pieceLabel: {
      render: function (args) {
        //
        const percentage = args.percentage,
          value = args.value;

        // return label + ': ' + value;
        return value;
        // return percentage + '%';
      }
    }


  }


  public testInstanceLabels: string[] = [];
  public testInstanceData: number[] = [];
  public testInstanceType: string = 'doughnut';

  // events
  public chartClicked(e: any): void {

  }

  public chartHovered(e: any): void {

  }




  // **********************************************************
  public curLabel;

  public barChartOptions1: any = {

    scaleShowVerticalLines: false,
    responsive: true,
    legend: { position: 'left' },
    FontSize: 40,
    tooltips: {
      callbacks: {
        label: tooltipItem => `${tooltipItem.yLabel}: ${tooltipItem.xLabel}`,
        title: () => null,
      }
    },

    onAnimationComplete: function () {
      this.showTooltip(this.segments, true);
    },
    scales: {
      xAxes: [
        {
          stacked: true
        }
      ],
      yAxes: [
        {
          stacked: true
        }
      ]
    }
  };
  public barChartLabels1: string[] = [];
  public barChartType1: string = 'bar';
  public barChartLegend1: boolean = true;

  public barChartData1: any[];

  // **************************************************************
  public barChartOptions2: any = {

    scaleShowVerticalLines: false,
    responsive: true,
    legend: { position: 'left' },
    FontSize: 40,
    tooltips: {
      callbacks: {
        label: tooltipItem => `${tooltipItem.yLabel}: ${tooltipItem.xLabel}`,
        title: () => null,
      }
    },

    onAnimationComplete: function () {
      this.showTooltip(this.segments, true);
    },
    pieceLabel: {
      render: function (args) {

        const percentage = args.percentage,
          value = args.value;

        // return label + ': ' + value;
        return value;
        // return percentage + '%';
      },
      overlap: true,
      // position: 'outside',
      // fontStyle: 'bold',
    }
  };;
  public barChartLabels2: string[];
  public barChartType2: string = 'bar';
  public barChartLegend2: boolean = true;

  public barChartData2: any[];

  isEmptyObject(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }
    return true;
  }

  // **************************************************************
  public barChartOptions3: any = {
    isStacked: 'percent',
    type: "stackedBar100",
    scaleShowVerticalLines: false,
    responsive: true,
    legend: { position: 'left' },
    FontSize: 40,
    tooltips: {
      callbacks: {
        label: tooltipItem => `${tooltipItem.yLabel}: ${tooltipItem.xLabel}`,
        title: () => null,
      }
    },
    plugins: {
      stacked100: { enable: true }
    },
    pieceLabel: {
      render: function (args) {

        const percentage = args.percentage,
          value = args.value;

        // return label + ': ' + value;
        return value;
        // return percentage + '%';
      },
      overlap: true,
      // position: 'outside',
      // fontStyle: 'bold',
    },

    onAnimationComplete: function () {
      this.showTooltip(this.segments, true);
    },
    scales: {
      xAxes: [
        {
          stacked: true,
          // type: "stackedBar100",
        }
      ],
      yAxes: [
        {
          stacked: true,
          // type: "stackedBar100",
        }
      ]
    }
  };
  public barChartLabels3: string[] = [];
  public barChartType3: string = 'horizontalBar';
  public barChartLegend3: boolean = true;

  public barChartData3: any[] = [];

  // **************************************************************
  public barChartOptionsTab2: any = {
    legend: { position: 'bottom',
    labels: {
      usePointStyle: true
    } },
    boxWidth: 100,
    tooltipEvents: [],
    showTooltips: false,
    tooltipCaretSize: 0,
    pieceLabel: {
      render: function (args) {
        const percentage = args.percentage,
          value = args.value;
        return value;
      }
    }
  };

  public barChartLabelsTab2: string[] = [];
  public barChartTypeTab2: string = 'bar';
  public barChartLegendTab2: boolean = true;

  public barChartDataTab2: any[] = [];

  // **************************************************************

  public tvaOptions: any;
  public tvaLabels: string[] = [];
  public tvaType: string = 'bar';
  public tvaLegend: boolean = true;

  public tvaData: any[] = [];

  // **************************************************************

  public barChartOptionsTab2One: any = {

    scaleShowVerticalLines: false,
    responsive: true,
    legend: { position: 'left' },
    FontSize: 40,
    tooltips: {
      callbacks: {
        label: tooltipItem => `${tooltipItem.yLabel}: ${tooltipItem.xLabel}`,
        title: () => null,
      }
    },

    onAnimationComplete: function () {
      this.showTooltip(this.segments, true);
    }, pieceLabel: {
      render: function (args) {

        const percentage = args.percentage,
          value = args.value;

        // return label + ': ' + value;
        return value;
        // return percentage + '%';
      },
      overlap: true,
      // position: 'outside',
      // fontStyle: 'bold',
    }
  };;
  public barChartLabelsTab2One: string[] = [];
  public barChartTypeTab2One: string = 'bar';
  public barChartLegendTab2One: boolean = true;

  public barChartDataTab2One: any[] = [];

  // **************************************************************

  public barChartOptionsTab2Two: any = {

    scaleShowVerticalLines: false,
    responsive: true,
    legend: { position: 'left' },
    FontSize: 40,
    tooltips: {
      callbacks: {
        label: tooltipItem => `${tooltipItem.yLabel}: ${tooltipItem.xLabel}`,
        title: () => null,
      }
    },
    pieceLabel: {
      render: function (args) {
        const percentage = args.percentage,
          value = args.value;
        return value;
      },
      overlap: true,
    },

    onAnimationComplete: function () {
      this.showTooltip(this.segments, true);
    }
  };
  public barChartLabelsTab2Two: string[] = [];
  public barChartTypeTab2Two: string = 'bar';
  public barChartLegendTab2Two: boolean = true;
  public barChartDataTab2Two: any[] = [];

  // **************************************************************

  public radioChartOptions: any = {

    scaleShowVerticalLines: false,
    responsive: true,
    legend: { position: 'left' },
    FontSize: 40,
    tooltips: {
      callbacks: {
        label: tooltipItem => `${tooltipItem.yLabel}: ${tooltipItem.xLabel}`,
        title: () => null,
      }
    },
    // pieceLabel: {
    //   render: function (args) {

    //   const percentage = args.percentage,
    //   value = args.value;

    //   // return label + ': ' + value;
    //   return value;
    //   // return percentage + '%';
    //   },
    //   overlap:true,
    //   // position: 'outside',
    //   // fontStyle: 'bold',
    //   },

    onAnimationComplete: function () {
      this.showTooltip(this.segments, true);
    }
  };
  public diffLevelLabels: string[] = [];
  public diffLevelType: string = 'bar';
  public diffLevelLegend: boolean = true;

  public diffLevelData: any[] = [];

  // **************************************************************

  public radioChartScoreOptions: any = {

    scaleShowVerticalLines: false,
    responsive: true,
    legend: { position: 'left' },
    FontSize: 40,
    tooltips: {
      callbacks: {
        label: tooltipItem => `${tooltipItem.yLabel}: ${tooltipItem.xLabel}`,
        title: () => null,
      }
    },
    // pieceLabel: {
    //   render: function (args) {

    //   const percentage = args.percentage,
    //   value = args.value;

    //   // return label + ': ' + value;
    //   return value;
    //   // return percentage + '%';
    //   },
    //   overlap:true,
    //   // position: 'outside',
    //   // fontStyle: 'bold',
    //   },

    onAnimationComplete: function () {
      this.showTooltip(this.segments, true);
    }

  };
  public diffLevelScoreLabels: string[] = [];
  public diffLevelScoreType: string = 'bar';
  public diffLevelScoreLegend: boolean = true;

  public diffLevelScoreData: any[] = [];

  // **************************************************************
  // public TaxonomyOptions:any;
  public TaxonomyLabels: string[] = [];
  public TaxonomyType: string = 'bar';
  public TaxonomyLegend: boolean = true;

  public TaxonomyData: any[] = [];

  // **************************************************************

  // public TaxonomyOptions:any;
  public TaxonomyScoreLabels: string[] = [];
  public TaxonomyScoreType: string = 'bar';
  public TaxonomyScoreLegend: boolean = true;

  public TaxonomyScoreData: any[] = [];

  // **************************************************************

  // public TopicOptions:any;
  public TopicLabels: string[] = [];
  public TopicType: string = 'bar';
  public TopicLegend: boolean = true;

  public TopicData: any[] = [];

  // **************************************************************

  // public TopicOptions:any;
  public TopicScoreLabels: string[] = [];
  public TopicScoreType: string = 'bar';
  public TopicScoreLegend: boolean = true;

  public TopicScoreData: any[] = [];

  // **************************************************************

  public lineChartData: Array<any> = [];
  public lineChartLabels: Array<any> = [];
  public lineChartOptions: any = {
    responsive: true,
    legend: { position: 'left' },
  };
  public lineChartColors: Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';

  // **************************************************************

  public barToBarOptions: any = {

    scaleShowVerticalLines: false,
    responsive: true,
    legend: { position: 'left' },
    FontSize: 40,
    tooltips: {
      callbacks: {
        label: tooltipItem => `${tooltipItem.yLabel}: ${tooltipItem.xLabel}`,
        title: () => null,
      }
    },

    onAnimationComplete: function () {
      this.showTooltip(this.segments, true);
    }

  };
  public barToBarLabels: string[] = [];
  public barToBarType: string = 'line';
  public barToBarLegend: boolean = true;

  public barToBarData: any[] = [];

  // **************************************************************

  public lineToBarOptions: any = {

    scaleShowVerticalLines: false,
    responsive: true,
    legend: { position: 'left' },
    FontSize: 40,
    tooltips: {
      callbacks: {
        label: tooltipItem => `${tooltipItem.yLabel}: ${tooltipItem.xLabel}`,
        title: () => null,
      }
    },

    onAnimationComplete: function () {
      this.showTooltip(this.segments, true);
    }

  };
  public lineToBarLabels: string[] = [];
  public lineToBarType: string = 'bar';
  public lineToBarLegend: boolean = true;

  public lineToBarData: any[] = [];

  // **************************************************************
  public leftOneChartLabels: string[] = [];
  public leftOneChartData: number[] = [];
  public leftOneChartType: string = 'doughnut';

  public leftOneChartOptions: any = {
    legend: { position: 'left' },
    boxWidth: 100,
    tooltipEvents: [],
    showTooltips: false,
    tooltipCaretSize: 0,
    pieceLabel: {
      render: function (args) {
        //
        const percentage = args.percentage,
          value = args.value;

        // return label + ': ' + value;
        return value;
        // return percentage + '%';
      }
      // position: 'outside',
      // fontStyle: 'bold',
    }
  }

  public rightOneChartLabels: string[] = [];
  public rightOneChartData: number[] = [];
  public rightOneChartType: string = 'doughnut';

  public rightOneChartOptions: any = {
    legend: { position: 'left' },
    boxWidth: 100,
    tooltipEvents: [],
    showTooltips: false,
    tooltipCaretSize: 0,
    pieceLabel: {
      render: function (args) {
        //
        const percentage = args.percentage,
          value = args.value;

        // return label + ': ' + value;
        return value;
        // return percentage + '%';
      }
      // position: 'outside',
      // fontStyle: 'bold',
    }
  }

  public leftTwoChartLabels: string[] = [];
  public leftTwoChartData: number[] = [];
  public leftTwoChartType: string = 'doughnut';

  public leftTwoChartOptions: any = {
    legend: { position: 'left' },
    boxWidth: 100,
    tooltipEvents: [],
    showTooltips: false,
    tooltipCaretSize: 0,
    pieceLabel: {
      render: function (args) {
        //
        const percentage = args.percentage,
          value = args.value;

        // return label + ': ' + value;
        return value;
        // return percentage + '%';
      }
      // position: 'outside',
      // fontStyle: 'bold',
    }
  }

  public rightTwoChartLabels: string[] = [];
  public rightTwoChartData: number[] = [];
  public rightTwoChartType: string = 'doughnut';

  public rightTwoChartOptions: any = {
    legend: { position: 'left' },
    boxWidth: 100,
    tooltipEvents: [],
    showTooltips: false,
    tooltipCaretSize: 0,
    pieceLabel: {
      render: function (args) {
        //
        const percentage = args.percentage,
          value = args.value;

        // return label + ': ' + value;
        return value;
        // return percentage + '%';
      }
      // position: 'outside',
      // fontStyle: 'bold',
    }
  }

  public leftThreeChartOptions: any;
  public leftThreeChartLabels: string[] = [];
  public leftThreeChartType: string = 'bar';
  public leftThreeChartLegend: boolean = true;
  public leftThreeChartData: any[] = [];

  public rightThreeChartOptions: any;
  public rightThreeChartLabels: string[] = [];
  public rightThreeChartType: string = 'bar';
  public rightThreeChartLegend: boolean = true;
  public rightThreeChartData: any[] = [];

  public leftFourChartOptions: any;
  public leftFourChartLabels: string[] = [];
  public leftFourChartType: string = 'bar';
  public leftFourChartLegend: boolean = true;
  public leftFourChartData: any[] = [];

  public rightFourChartOptions: any;
  public rightFourChartLabels: string[] = [];
  public rightFourChartType: string = 'bar';
  public rightFourChartLegend: boolean = true;
  public rightFourChartData: any[] = [];

  public ScheduledOptions: any;
  public ScheduledLabels: string[] = [];
  public ScheduledType: string = 'horizontalBar';
  public ScheduledLegend: boolean = true;

  public ScheduledData: any[] = [];

  public userByChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    legend: { position: 'left' },
    FontSize: 40,
    tooltips: {
      callbacks: {
        label: tooltipItem => `${tooltipItem.yLabel}: ${tooltipItem.xLabel}`,
        title: () => null,
      }
    },

    onAnimationComplete: function () {
      this.showTooltip(this.segments, true);
    },
    pieceLabel: {
      render: function (args) {

        const percentage = args.percentage,
          value = args.value;

        // return label + ': ' + value;
        return value;
        // return percentage + '%';
      },
      overlap: true,
      // position: 'outside',
      // fontStyle: 'bold',
    }
  }
  public userByChartLabels: string[] = [];
  public userByChartType: string = 'horizontalBar';
  public userByChartLegend: boolean = true;

  public userByChartData: any[] = [];

  public CommonBarChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    legend: { position: 'left' },
    FontSize: 40,
    tooltips: {
      callbacks: {
        label: tooltipItem => `${tooltipItem.yLabel}: ${tooltipItem.xLabel}`,
        title: () => null,
      }
    },

    onAnimationComplete: function () {
      this.showTooltip(this.segments, true);
    },

    pieceLabel: {
      render: function (args) {

        const percentage = args.percentage,
          value = args.value;

        // return label + ': ' + value;
        return value;
        // return percentage + '%';
      },
      overlap: true,
      // position: 'outside',
      // fontStyle: 'bold',
    }
  };

  public itemSetBySubjectOptions: any;
  public itemSetBySubjectLabels: string[] = [];
  public itemSetBySubjectType: string = 'bar';
  public itemSetBySubjectLegend: boolean = true;
  public itemSetBySubjectData: any[] = [];

  public itemSetBySubjectDrillOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    legend: { position: 'left' },
    FontSize: 40,
    tooltips: {
      callbacks: {
        label: tooltipItem => `${tooltipItem.yLabel}: ${tooltipItem.xLabel}`,
        title: () => null,
      }
    },

    onAnimationComplete: function () {
      this.showTooltip(this.segments, true);
    }
  }
  public itemSetBySubjectDrillLabels: string[] = [];
  public itemSetBySubjectDrillType: string = 'bar';
  public itemSetBySubjectDrillLegend: boolean = true;
  public itemSetBySubjectDrillData: any[] = [];


  public itemSetByAuthorDrillLabels: string[] = [];
  public itemSetByAuthorDrillType: string = 'horizontalBar';
  public itemSetByAuthorDrillLegend: boolean = true;
  public itemSetByAuthorDrillData: any[] = [];


  public itemSetByAuthorOptions: any;
  public itemSetByAuthorLabels: string[] = [];
  public itemSetByAuthorType: string = 'pie';
  // public itemSetByAuthorLegend:boolean = true;
  public itemSetByAuthorData: any[] = [];


  public itemsByAuthorLabels: string[] = [];
  public itemsByAuthorData: number[] = [];
  public itemsByAuthorType: string = 'doughnut';

  public itemsByAuthorOptions: any = {
    legend: { position: 'left' },
    boxWidth: 100,
    tooltipEvents: [],
    showTooltips: false,
    tooltipCaretSize: 0,
    pieceLabel: {
      render: function (args) {
        const percentage = args.percentage,
          value = args.value;
        return value;
      }
    }
  }

  public itemsByItemTypeLabels: string[] = [];
  public itemsByItemTypeData: number[] = [];
  public itemsByItemTypeType: string = 'doughnut';

  public itemsByItemTypeOptions: any = {
    legend: { position: 'left' },
    boxWidth: 100,
    tooltipEvents: [],
    showTooltips: false,
    tooltipCaretSize: 0,
    pieceLabel: {
      render: function (args) {
        const percentage = args.percentage,
          value = args.value;
        return value;
      }
    }
  }

  public itemsByItemTypeDrillLabels: string[] = [];
  public itemsByItemTypeDrillData: number[] = [];
  public itemsByItemTypeDrillType: string = 'doughnut';

  public itemsByItemTypeDrillOptions: any = {
    legend: { position: 'left' },
    boxWidth: 100,
    tooltipEvents: [],
    showTooltips: false,
    tooltipCaretSize: 0,
    pieceLabel: {
      render: function (args) {
        const percentage = args.percentage,
          value = args.value;
        return value;
      }
    }
  }


  public itemsByAuthorDrillOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    legend: { position: 'left' },
    FontSize: 40,
    tooltips: {
      callbacks: {
        label: tooltipItem => `${tooltipItem.yLabel}: ${tooltipItem.xLabel}`,
        title: () => null,
      }
    },

    onAnimationComplete: function () {
      this.showTooltip(this.segments, true);
    }
  }
  public itemsByAuthorDrillLabels: string[] = [];
  public itemsByAuthorDrillType: string = 'bar';
  public itemsByAuthorDrillLegend: boolean = true;
  public itemsByAuthorDrillData: any[] = [];



  public itemsByTopicLabels: string[] = [];
  public itemsByTopicType: string = 'horizontalBar';
  public itemsByTopicLegend: boolean = true;
  public itemsByTopicData: any[] = [];

  //Avila ?*****************************************************************
  public userStatusLabels: string[] = [];
  public userStatusType: string = 'horizontalBar';
  public userStatusLegend: boolean = true;
  public userStatusData: any[] = [];
  public chartColors: any[] = [
    { backgroundColor: ["#000A5A", "#000A5A", "#000A5A"] },
    { backgroundColor: ["#2F77B1", "#2F77B1", "#2F77B1"] },
    { backgroundColor: ["#4DB2D4", "#4DB2D4", "#4DB2D4"] },

  ];
  ///////////////////////////////////////////////////////////////
  public participantStatusLabels: string[] = [];
  public participantStatusType: string = 'horizontalBar';
  public participantStatusLegend: boolean = true;
  public participantStatusData: any[] = [];
  public chartColors1: any[] = [
    { backgroundColor: ["#000A5A", "#000A5A", "#000A5A"] },
    { backgroundColor: ["#2F77B1", "#2F77B1", "#2F77B1"] },
    { backgroundColor: ["#4DB2D4", "#4DB2D4", "#4DB2D4"] },

  ];
////////////////////////////////////////////////////////////
  public itemsByAuthorsLabels: string[] = [];
  public itemsByAuthorsType: string = 'pie';
  public itemsByAuthorsLegend: boolean = true;
  public itemsByAuthorsData: any[] = [];
  public barchartAuthorcolors: any[] = [
    { backgroundColor: ["#000A5A", "#2F77B1", "#4DB2D4","#89DAF0", "#507796","#5E69C2"] },
  ]
  /////////////////////////////////////////////////////

   public itemBankbarChartOptionsTab2Two: any = {

    scaleShowVerticalLines: false,
    responsive: true,
    legend: { position: 'left' },
    FontSize: 40,
    tooltips: {
      callbacks: {
        label: tooltipItem => `${tooltipItem.yLabel}: ${tooltipItem.xLabel}`,
        title: () => null,
      }
    },
    pieceLabel: {
      render: function (args) {
        const percentage = args.percentage,
          value = args.value;
        return value;
      },
      overlap: true,
    },

    onAnimationComplete: function () {
      this.showTooltip(this.segments, true);
    }
  };
  public itemBankbarChartLabelsTab2Two: string[] = [];
  public itemBankbarChartTypeTab2Two: string = 'bar';
  public itemBankbarChartLegendTab2Two: boolean = false;
  public itemBankbarChartData: any[] = [];
  public barchartcolor: any[] = [
    { backgroundColor: ["#000A5A", "#2F77B1", "#4DB2D4","#89DAF0", "#507796","#5E69C2"] },

  ];

  //////////////////////////////////////////////////////////////
  public testdeliveredbarChartOptions: any = {

    scaleShowVerticalLines: false,
    responsive: true,
    legend: { position: 'left' },
    FontSize: 40,
    tooltips: {
      callbacks: {
        label: tooltipItem => `${tooltipItem.yLabel}: ${tooltipItem.xLabel}`,
        title: () => null,
      }
    },
    pieceLabel: {
      render: function (args) {
        const percentage = args.percentage,
          value = args.value;
        return value;
      },
      overlap: true,
    },

    onAnimationComplete: function () {
      this.showTooltip(this.segments, true);
    }
  };
  public testdeliveredbarChartLabels: string[] = [];
  public testdeliveredbarChartType: string = 'bar';
  public testdeliveredbarChartLegend: boolean = false;
  public testdeliveredbarChartData: any[] = [];
   
  //////////////////////////////////////////////////////////////
  public upcomingtestbarChartOptions: any = {

    scaleShowVerticalLines: false,
    responsive: true,
    legend: { position: 'bottom' },
    FontSize: 40,
    tooltips: {
      callbacks: {
        label: tooltipItem => `${tooltipItem.yLabel}: ${tooltipItem.xLabel}`,
        title: () => null,
      }
    },
    pieceLabel: {
      render: function (args) {
        const percentage = args.percentage,
          value = args.value;
        return value;
      },
      overlap: true,
    },

    onAnimationComplete: function () {
      this.showTooltip(this.segments, true);
    }
  };
  public upcomingtestbarChartLabels: string[] = [];
  public upcomingtestbarChartType: string = 'bar';
  public upcomingtestbarChartLegend: boolean = false;
  public upcomingtestbarChartData: any[] = [];
 
  ///////////************************* */


  public itemsBySubTopicLabels: string[] = [];
  public itemsBySubTopicType: string = 'pie';
  public itemsBySubTopicLegend: boolean = true;
  public itemsBySubTopicData: any[] = [];

  public itemsByDiffLevelLabels: string[] = [];
  public itemsByDiffLevelData: number[] = [];
  public itemsByDiffLevelType: string = 'doughnut';

  public itemsByDiffLevelOptions: any = {
    legend: { position: 'left' },
    boxWidth: 100,
    tooltipEvents: [],
    showTooltips: false,
    tooltipCaretSize: 0,
    pieceLabel: {
      render: function (args) {
        const percentage = args.percentage,
          value = args.value;
        return value;
      }
    }
  }

  public itemsByTaxonomyLabels: string[] = [];
  public itemsByTaxonomyData: number[] = [];
  public itemsByTaxonomyType: string = 'doughnut';

  public itemsByTaxonomyOptions: any = {
    legend: { position: 'left' },
    boxWidth: 100,
    tooltipEvents: [],
    showTooltips: false,
    tooltipCaretSize: 0,
    pieceLabel: {
      render: function (args) {
        const percentage = args.percentage,
          value = args.value;
        return value;
      }
    }
  }



  public userDetailsLabels: string[] = [];
  public userDetailsType: string = 'bar';
  public userDetailsLegend: boolean = true;
  public userDetailsData: any[] = [];

  public usageDetailsLabels: string[] = [];
  public usageDetailsType: string = 'bar';
  public usageDetailsLegend: boolean = true;
  public usageDetailsData: any[] = [];

  public userDetailsOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    legend: { position: 'left' },
    FontSize: 40,
    tooltips: {
      callbacks: {
        label: tooltipItem => `${tooltipItem.yLabel}: ${tooltipItem.xLabel}`,
        title: () => null,
      }
    },

    onAnimationComplete: function () {
      this.showTooltip(this.segments, true);
    }
  }

  public itemBankDet;
  public showItembankchartDiv;
  public getItemBankChartDetails;
  public getSubjectDrillResponse;
  public getAuthorDrillResponse;
  public subjectDrill;
  public authorDrill;
  public itemsByAuthorAndItemTypeResponse;
  public itemsByAuthorDrill;
  public itemsByItemTypeDrill;
  public subjectWiseItemDetailsData;
  public TabSixDetailsTopic;
  public TabSixDetailsSubTopic;
  public TabSixDetailsDiffLevel;
  public TabSixDetailsTaxonomy;

  //Avila
  public TabUserStatus;
  public userStatusDetailsData = [];
  public authorUserStatusDetailsData;
  public testAdminUserStatusDetailsData;
  public examinerUserStatusDetailsData;
  public TabParticipantStatus;
  public participantStatusDetailsData = [];
  public participantStatusGraphDetailsData;

  public TabOneItemByAuthor;
  public itemByAuthorsDetailsData;
  public itemByAuthorDrill;

  public noData;
  public chartsDisplay;
  public dataAssigning;
  public token;
  public activeTab;
  public Tab2ChartOne;
  public dummyText;
  public radioSelect;
  public dashBtoB;
  public dashLtoB;
  public testVsAvg;
  public skillGrp;
  public perAnalyse;
  public taxAnalyse;
  public topAnalyse;
  public tempTestId;
  public getSubjectDropdownValues;
  public getSubjectValue;
  public textValue;
  public getItemSetDropdownValues;
  public tableDataBinding;
  public getLeftSideChartData;
  public getRightSideChartData;
  public leftSideChartDisplay;
  public leftSideChartDisplay2 = false;
  public rightSideChartDisplay2 = false;
  public leftSideChartDisplay3 = false;
  public rightSideChartDisplay3 = false;
  public leftSideChartDisplay4 = false;
  public rightSideChartDisplay4 = false;
  public rightSideChartDisplay;
  public itemset1;
  public itemset2;
  public itemSetIdOne;
  public itemSetIdTwo;
  public itemsetAnalysisToggle = 1;
  public skillGroupAnalysisTableData;
  public scheduledSummaryDrill;
  public userByTestGroupDrill;
  public testTakenVsTestScheduledDrillData;
  //Avila***********
  public showload;

  public authorVsSubjectwiseDrillData;
  
  public itembankdetails;
  public itembnk;
  public itemBankdetailsDrillTableData;
  /////
  public barChart2 = false;
  public testdelivereddetails = [];
  public testdlvr;
  public testdelivereddetailsDrillTableData;
  //
  public barChart1 = false;
  public upcomingtestdetails = [];
  public upcmgtst;
  public upcomingtestdetailsDrillTableData;
  /////////************ */
  public itemsetSubjectId;
  public reportSubId;
  public PerformanceSummaryTab2;
  public skillGrpTab2;
  public pa_diffLevel;
  public pa_taxonomydata;
  public pa_topicData;
  public overAllTabTwoData;
  public organisationRoles;
  public hideTwoTabs = false;
  public errMsgChart;
  public paChart1 = false;
  public paChart2 = false;
  public paChart3 = false;
  public paChart4Tax = false;
  public paChart5Top = false;
  public IBRChart1 = false;
  public IBRChart2 = false;
  public IBRChart3 = false;
  public SRChart = false;
  //Avila
  public IAChart = false;
  public ISCChartLeft = false;
  public ISCChartRight = false;
  public ExpireAlert;
  public meteringValidity;
  public meteringTestInstDet;
  public metringUserDet;
  public meteringContentDet;
  public displayMetering;
  public tenantPlanDetails;
  public tenantPlanNotification;
  public chartTitle;


  ngOnInit() {
    this.displayMetering = false;
    this.organisationRoles = this.GetItemService.sendOrganisationRoles();

    if (this.organisationRoles != undefined) {
      if (this.organisationRoles.includes('Super Admin')) {
        this.hideTwoTabs = false;
        this.activeTab = 1;
      } else if (this.organisationRoles.includes('Test Admin')) {
        this.hideTwoTabs = false;
        this.activeTab = 1;
      } else if (this.organisationRoles.includes('Author')) {
        this.hideTwoTabs = true;
        this.activeTab = 4;
      }
    } else {
      if (this.authService.canActivate()) {
        this.cookieService.delete('_TEM');
        this.cookieService.delete('_TON');
        this.showload = true;
        var headers = new Headers();
        headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
        this.http.get(credentials.accountHost + '/user_details', { headers: headers })
          .map(res => res.json())
          .catch((e: any) => {
            return Observable.throw(e)
          })
          .subscribe(
            data => {

              var tempOrgMail;
              tempOrgMail = data.user_login_details.profile_email;
              if (tempOrgMail != '' && tempOrgMail != null) {
                this.cookieService.set('_TEM', tempOrgMail);
              }

              var tempOrgName;
              tempOrgName = data.user_login_details.profile_organization_text;
              if (tempOrgName != '' && tempOrgName != null) {
                this.cookieService.set('_TON', tempOrgName);
              }

              for (var i = 0; i < data.user_login_details.available_organization.length; i++) {
                if (data.user_login_details.available_organization[i].org_id == this.cookieService.get('_PAOID')) {
                  this.organisationRoles = data.user_login_details.available_organization[i].organization_roles;
                }
              }

              if (this.organisationRoles.includes('Super Admin')) {
                this.hideTwoTabs = false;
                this.activeTab = 1;
              } else if (this.organisationRoles.includes('Test Admin')) {
                this.hideTwoTabs = false;
                this.activeTab = 1;
              } else if (this.organisationRoles.includes('Author')) {
                this.hideTwoTabs = true;
                this.activeTab = 4;
              }
            },
            error => {
              this.showload = false;

              if (error.status == 404) {
                this.router.navigateByUrl('pages/NotFound');
              }
              else if (error.status == 401) {
                this.cookieService.deleteAll();
                window.location.href = credentials.accountUrl;
                // window.location.href='http://accounts.scora.in';
              }
              else {
                this.router.navigateByUrl('pages/serverError');
              }
            },

          );
      }
    }


    this.getSubjectDropdownValues = [];
    this.scheduledSummaryDrill = false;
    //Avila
    this.itemByAuthorDrill = false;
    //
    this.userByTestGroupDrill = false;
    this.leftSideChartDisplay = false;
    this.rightSideChartDisplay = false;
    this.taxAnalyse = false;
    this.topAnalyse = false;
    this.perAnalyse = false;
    //  this.skillGrp = false;
    // this.testVsAvg = false;
    this.dashLtoB = false;
    this.dashBtoB = false;


    this.radioSelect = 1;
    this.Tab2ChartOne = true;
    this.activeTab = 1;
    this.textValue = '';
    this.chartsDisplay = false;
    this.getLeftSideChartData = [];
    this.getRightSideChartData = [];
    //  this.token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjgyMjk2YTM1NmUzNTFhZmNjYTFkMmJhMDc5MTgyOTYzOTc5MDc3ZGY2NjY1NWI3ZDIxMGJkNzA4YmJlMTdmYjhjNWE0ZjU3ZTVlODcxYTliIn0.eyJhdWQiOiIyIiwianRpIjoiODIyOTZhMzU2ZTM1MWFmY2NhMWQyYmEwNzkxODI5NjM5NzkwNzdkZjY2NjU1YjdkMjEwYmQ3MDhiYmUxN2ZiOGM1YTRmNTdlNWU4NzFhOWIiLCJpYXQiOjE1Mjc2Nzc1MDgsIm5iZiI6MTUyNzY3NzUwOCwiZXhwIjoxNTU5MjEzNTA4LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.C4CQAUFNGEihOy2Lr8hmicpM6fCoVIcO89pm1RLgQnYpl0iaLbGo1jzduC8IVt37Jeh4Ykf-KL0xGH6UhvINzOV3cXFzh5LTbCnoDgj8v9MaJSl2ZynpjBxGTuR3dumovgBpQQpx2sFiRrkupLOyL4dh446Sh7aiN9gl31NumxpRcTF5kumc6eQGqY89ITZDMZuyDELr5-ySGaxCOoopoNVWYxUdXhT-HcFD4SisTFniYckX6uOwcCcdKYYDMzQjBO2FHj1YWiIhcnld_qLn5WKVQ_CE5StkQuwGXJEN0xXI90EZR_WDfwV1A4bi9k9w8POa8fGo2smI5EVLDDrF62UShsZ6uR2u0KcWVEZmyDYKfcCwBia1ydiKkBMtFzTW3w2Ytq1b7dUsJy1NXuUYRYkQre4pX8cV2Z-lwerr0zD0DOkMrCjqqePr74p9b1KynXgGsyqkp3b14sB3wSdDJEQf8OU8NBnT0u40IFJkx3ExGNm7FEJ3SLGn3ExgILvMWeTEcu0vB_BgdXTJwkGGRPVICp6AAyXYIdeyJ_Omxohn6J3b63UDrVjt9JR8LdPX5oWHNKI3Qik-8t98X29G2jET-njQdKBVA3jseH4QlyFeb1tUdR__4WK0e16qWXYwq8rnR2RBTxIskrpn8UHOZsnaLkJCquArnTj2GHgctaI'
    this.getChartDetailsTabOne(); //uncomment
    this.getTabFiveChartDetails();
    this.getMeteringDetails();
    this.getChartDetailsTabOne();
    //Avila*******
    this.participantsbystatus();
    this.usersByStatus();
    this.itemsByAuthors();
    this.getItemBankdetails();
    this.getTestDelivered();
    this.getupcomingTests();
    //************ */


    //  this.insightTestNameDropData();
    // this.AttemptChartDisplay = false;
  }


  //  insightDiffChartData(testId,curAttempt)
  //  {
  //    this.AreaChoose = false;
  //    this.curTestId = testId;
  //    this.curAttempt = curAttempt;

  //    this.AttemptChartDisplay = true;
  //    this.ScoreChartDisplay = false;
  //  //  // this.choosedRadioButton = false;
  //   //  var headers = new Headers();
  //   //  headers.append('Content-Type', 'application/json');
  //   //  headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));


  //   //  this.http.get( credentials.userHost + '/difficulty_level_details/'+this.cookieService.get('_PAOID')+'/'+testId+'/'+curAttempt,{headers:headers})

  //   //  .map(res => res.json())

  //   //  .subscribe(
  //     //  data => {

  //       // // this.testHistoryChartChecking(this.curTestId,this.curAttempt);
  //       //  if(data.difficulty_level_count.length != 0)
  //       //  {
  //          this.AttemptLabels = ['April', 'May', 'June', 'July', 'Aug', 'Sep'];
  //          this.AttemptData = ['1','2','3','4', '5', '6'];

  //          var tempIncData;
  //          var tempCorData;
  //          var tempMisData;
  //          tempIncData = ['2'];
  //          tempCorData = ['4'];
  //          tempMisData = ['5'];

  //         //  for(var t=0;t<data.difficulty_level_count.length;t++)
  //         //  {
  //           //  this.AttemptLabels.push(data.difficulty_level_count[t].Diff_Lvl_Nm);
  //           //  tempIncData.push(data.difficulty_level_count[t].Incorrect);
  //           //  tempCorData.push(data.difficulty_level_count[t].Correct);
  //           //  tempMisData.push(data.difficulty_level_count[t].Missed);
  //         //  }

  //          this.AttemptData = [
  //            {data: tempIncData, label:'Incorrect'},
  //            {data: tempCorData, label:'Correct'},
  //            {data: tempMisData, label:'Missed'}
  //          ];

  //          this.AttemptChartDisplay = true;
  //       //  }


  //       //  if(data.difficulty_level_score.length != 0)
  //       //  {
  //       //    this.ScoreLabels = [];
  //       //    this.ScoreData = [];

  //       //    var tempIncData;
  //       //    var tempCorData;
  //       //    var tempMisData;
  //       //    tempIncData = [];
  //       //    tempCorData = [];
  //       //    tempMisData = [];

  //       //    for(var t=0;t<data.difficulty_level_score.length;t++)
  //       //    {
  //       //      this.ScoreLabels.push(data.difficulty_level_score[t].Diff_Lvl_Nm);
  //       //      tempIncData.push(data.difficulty_level_score[t].Incorrect);
  //       //      tempCorData.push(data.difficulty_level_score[t].Correct);
  //       //      tempMisData.push(data.difficulty_level_score[t].Missed);
  //       //    }

  //       //    this.ScoreData = [
  //       //      {data: tempIncData, label:'Incorrect'},
  //       //      {data: tempCorData, label:'Correct'},
  //       //      {data: tempMisData, label:'Missed'}
  //       //    ];

  //       //    this.ScoreChartDisplay = true;
  //       //  }

  //        this.loader = false; 
  //        this.chooseRadio = 1;
  //        this.choosedRadioButton = true;
  //     //  },
  //      error => {

  //        this.loader = false;
  //      }

  //   //  );
  //  }



  getMeteringDetails() {
    this.showload = true;
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));


    this.http.get(credentials.userdashboardHost + '/metering_details/' + this.cookieService.get('_PAOID'), { headers: headers })


      .map(res => res.json())
      .catch((e: any) => {
        return Observable.throw(e)
      })

      .subscribe(
        data => {

          this.showload = false;
          if (data.success) {
            this.tenantPlanDetails = data.content.tenant_plan_details;
            this.tenantPlanNotification = data.content.tenant_plan_notification;
            this.meteringValidity = data.content.validity_details;
            this.metringUserDet = data.content.users_details;
            this.meteringTestInstDet = data.content.test_instance_details;
            this.meteringContentDet = data.content.contents_details;

            if (this.meteringValidity.length != 0) {
              for (var i = 0; i < this.meteringValidity.length; i++) {


                this.validityLabels.push(this.meteringValidity[i].validity_label);
                this.validityData.push(this.meteringValidity[i].validity_count);
              }
            }


            if (this.meteringTestInstDet.length != 0) {
              for (var j = 0; j < this.meteringTestInstDet.length; j++) {


                this.testInstanceLabels.push(this.meteringTestInstDet[j].testinstance_label);
                this.testInstanceData.push(this.meteringTestInstDet[j].testinstance_count);
              }
            }

            if (this.metringUserDet.length != 0) {
              this.userDetailsData = [];
              this.userDetailsLabels = [];

              var tempArray;
              tempArray = [];

              for (var w = 0; w < this.metringUserDet.length; w++) {
                this.userDetailsLabels.push(this.metringUserDet[w].user_label);
                tempArray.push(this.metringUserDet[w].user_count)
              }

              this.userDetailsData = [
                { data: tempArray, label: 'Period 1' }
              ]

            }

            if (this.meteringContentDet.length != 0) {
              this.usageDetailsData = [];
              this.usageDetailsLabels = [];

              var tempArray1;
              tempArray1 = [];

              for (var w = 0; w < this.meteringContentDet.length; w++) {
                this.usageDetailsLabels.push(this.meteringContentDet[w].content_label);
                tempArray1.push(this.meteringContentDet[w].content_count)
              }

              this.usageDetailsData = [
                { data: tempArray1, label: 'No.of Units' }
              ]

            }

            this.displayMetering = true;
          } else if (data.success == false) {
            this.displayMetering = false;
          }



        }
      );
  }

  getChartDetailsTabOne() {
    this.showload = true;
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));


    this.http.get(credentials.userdashboardHost + '/test_admin_test_grp/' + this.cookieService.get('_PAOID'), { headers: headers })


      .map(res => res.json())
      .catch((e: any) => {
        return Observable.throw(e)
      })

      .subscribe(
        data => {
          this.showload = false;
          // var tempTestId;
          if (data.test_grp_performance.length != 0) {
            this.overAllTabTwoData = true;
            this.tempTestId = data.test_grp_performance[0].test_id;
            this.getChartDetailsChartOne(this.tempTestId);
           ///AA this.getChartDetailsChartTwo(this.tempTestId);
          //////AA  this.getChartDetailsChartThree(this.tempTestId);
          }
          else {
            this.overAllTabTwoData = false;
          }
          this.getLeftSideChartData = [];
          this.getRightSideChartData = [];
          this.subjectDropDownData();

          this.dataAssigning = data;

          if (this.dataAssigning.candidate_by_test_group.length != 0) {
            for (var i = 0; i < this.dataAssigning.candidate_by_test_group.length; i++) {


              this.doughnutChartLabels.push(this.dataAssigning.candidate_by_test_group[i].grp_name);
              this.doughnutChartData.push(this.dataAssigning.candidate_by_test_group[i].usercount);
            }

          }


          if (this.dataAssigning.test_taken_vs_test_sched.length != 0) {
            var getBar1DetCompleted: any[] = [];
            var getBar1DetPause: any[] = [];
            var getBar1DetScheduled: any[] = [];
            for (var i = 0; i < this.dataAssigning.test_taken_vs_test_sched.length; i++) {


              getBar1DetCompleted.push(this.dataAssigning.test_taken_vs_test_sched[i].completed);
              getBar1DetPause.push(this.dataAssigning.test_taken_vs_test_sched[i].paused);
              getBar1DetScheduled.push(this.dataAssigning.test_taken_vs_test_sched[i].Scheduled);

              this.barChartLabels1.push(this.dataAssigning.test_taken_vs_test_sched[i].grp_name);
              this.barChartData1 = [
                { data: getBar1DetCompleted, label: 'Completed' },
                { data: getBar1DetPause, label: 'Paused' },
                { data: getBar1DetScheduled, label: 'Scheduled' }
              ];
            }

          }


          if (this.dataAssigning.test_grp_performance.length != 0) {
            var tempMaxScore = [];
            var tempAvgScore = [];
            var tempLineLabels = [];
            for (var m = 0; m < this.dataAssigning.test_grp_performance.length; m++) {
              if (this.dataAssigning.test_grp_performance[m].avg_grp_score == null) {
                this.dataAssigning.test_grp_performance[m].avg_grp_score = "0";
              }
              if (this.dataAssigning.test_grp_performance[m].max_grp_score == null) {
                this.dataAssigning.test_grp_performance[m].max_grp_score = "0";
              }
              tempAvgScore.push(this.dataAssigning.test_grp_performance[m].avg_grp_score);
              tempMaxScore.push(this.dataAssigning.test_grp_performance[m].max_grp_score);
              tempLineLabels.push(this.dataAssigning.test_grp_performance[m].test_name);
            }





            this.lineChartLabels = tempLineLabels;

            this.lineChartData = [
              { data: tempAvgScore, label: 'Avg Group Score' },
              { data: tempMaxScore, label: 'Max Group Score' },
            ]
          }



          if (this.dataAssigning.skill_grp_analysis.length != 0) {
            var getBar3Det1: any[] = [];
            var getBar3Det2: any[] = [];
            var getBar3Det3: any[] = [];
            var getBar3Det4: any[] = [];
            var getBar3Det5: any[] = [];
            var getBar3Det6: any[] = [];
            var getBar3Det7: any[] = [];
            var getBar3Det8: any[] = [];

            for (var i = 0; i < this.dataAssigning.skill_grp_analysis.length; i++) {
              // getBar3Det1 = [];
              // getBar3Det2 = [];
              // getBar3Det3 = [];
              // getBar3Det4 = [];
              // getBar3Det5 = [];
              // getBar3Det6 = [];
              // getBar3Det7 = [];
              // getBar3Det8 = [];

              getBar3Det1.push(this.dataAssigning.skill_grp_analysis[i].OneLessthan30);
              getBar3Det2.push(this.dataAssigning.skill_grp_analysis[i].Two30to40);
              getBar3Det3.push(this.dataAssigning.skill_grp_analysis[i].Three40to50);
              getBar3Det4.push(this.dataAssigning.skill_grp_analysis[i].Four50to60);
              getBar3Det5.push(this.dataAssigning.skill_grp_analysis[i].Five60to70);
              getBar3Det6.push(this.dataAssigning.skill_grp_analysis[i].Six70to80);
              getBar3Det7.push(this.dataAssigning.skill_grp_analysis[i].Seven80to90);
              getBar3Det8.push(this.dataAssigning.skill_grp_analysis[i].EightGreaterthan90);



              this.barChartLabels3.push(this.dataAssigning.skill_grp_analysis[i].Grp_Name);
              this.barChartData3 = [
                { data: getBar3Det1, label: '<30' },
                { data: getBar3Det2, label: '30-40' },
                { data: getBar3Det3, label: '40-50' },
                { data: getBar3Det4, label: '50-60' },
                { data: getBar3Det5, label: '60-70' },
                { data: getBar3Det6, label: '70-80' },
                { data: getBar3Det7, label: '80-90' },
                { data: getBar3Det8, label: '>90' }
              ];


            }

          }


          this.chartsDisplay = true;
          this.scheduledSummaryDrill = false;
          this.userByTestGroupDrill = false;
        },
        error => {

          this.showload = false;
          if (error.status == 404) {
            this.router.navigateByUrl('pages/NotFound');
          }
          else if (error.status == 401) {
            this.cookieService.deleteAll();
            window.location.href = credentials.accountUrl;
            // window.location.href='http://accounts.scora.in';
          }
          else {
            this.router.navigateByUrl('pages/serverError');
          }

        }

      )
  }

  getChartDetailsChartOne(testId) {
    this.paChart1 = false;
    this.showload = true;
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));


    this.http.get(credentials.userdashboardHost + '/pa_test_group/' + this.cookieService.get('_PAOID') + '/' + testId, { headers: headers })

      // this.http.get('http://.brigita.co//public/api/test_admin_test_grp/1' , {headers:headers})

      // this.http.get('../assets/files/apiCall.json')

      .map(res => res.json())
      .catch((e: any) => {
        return Observable.throw(e)
      })

      .subscribe(
        data => {
          this.showload = false;
          this.testVsAvg = true;

          this.PerformanceSummaryTab2 = data;
          if (data.length != 0) {
            this.barChartLabelsTab2 = [];
            this.barChartDataTab2 = [];
            var tempMaxChartData;
            tempMaxChartData = [];
            var tempAvgChartData;
            tempAvgChartData = [];
            for (var h = 0; h < data.length; h++) {

              this.barChartLabelsTab2.push(data[h].grp_name);

              if (data[h].max_grp_score == null) {
                data[h].max_grp_score = 0;
              }

              if (data[h].avg_grp_score == null) {
                data[h].avg_grp_score = 0;
              }

              tempMaxChartData.push(data[h].max_grp_score);
              tempAvgChartData.push(data[h].avg_grp_score);

              this.barChartDataTab2 = [
                { data: tempMaxChartData, label: 'Max-Score' },
                { data: tempAvgChartData, label: 'Avg-Score' }
              ];
            }




          }

        },
        error => {

          this.showload = false;
          if (error.status == 404) {
            // this.router.navigateByUrl('author/NotFound');
            this.paChart1 = true;
            this.errMsgChart = "Oops! Chart Not Found";
          }
          else if (error.status == 401) {
            this.cookieService.deleteAll();
            window.location.href = credentials.accountUrl;
            // window.location.href='http://accounts.scora.in';
          }
          else {
            // this.router.navigateByUrl('author/serverError');
            this.paChart1 = true;
            this.errMsgChart = "Oops! Something Went Wrong. Try Again Later";
          }

        }
      );
  }


  radioChartOne(testId) {
    this.paChart3 = false;
    this.showload = true;
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));


    this.http.get(credentials.userdashboardHost + '/pa_difficulty_lvl/' + this.cookieService.get('_PAOID') + '/' + testId, { headers: headers })


      .map(res => res.json())
      .catch((e: any) => {
        return Observable.throw(e)
      })

      .subscribe(
        data => {
          this.showload = false;
          this.radioSelect = 1;

          this.topAnalyse = false;
          this.perAnalyse = true;
          this.taxAnalyse = false;

          this.diffLevelLabels = [];
          this.diffLevelData = [];
          this.diffLevelScoreLabels = [];
          this.diffLevelScoreData = [];
          var IncrctOne;
          var CrctOne;
          var MissedOne;
          this.pa_diffLevel = data;
          IncrctOne = [];
          CrctOne = [];
          MissedOne = [];

          var IncrctTwo;
          var CrctTwo;
          var MissedTwo;

          IncrctTwo = [];
          CrctTwo = [];
          MissedTwo = [];

          for (var q = 0; q < data.difficulty_level_count.length; q++) {
            this.diffLevelLabels.push(data.difficulty_level_count[q].Diff_Lvl_Nm);

            if (data.difficulty_level_count[q].Incorrect == null) {
              data.difficulty_level_count[q].Incorrect = 0;
            }
            if (data.difficulty_level_count[q].Correct == null) {
              data.difficulty_level_count[q].Correct = 0;
            }
            if (data.difficulty_level_count[q].Missed == null) {
              data.difficulty_level_count[q].Missed = 0;
            }

            IncrctOne.push(data.difficulty_level_count[q].Incorrect);
            CrctOne.push(data.difficulty_level_count[q].Correct);
            MissedOne.push(data.difficulty_level_count[q].Missed);
          }

          this.diffLevelData = [
            { data: IncrctOne, label: 'Incorrect' },
            { data: CrctOne, label: 'Correct' },
            { data: MissedOne, label: 'Missed' }
          ]

          for (var w = 0; w < data.difficulty_level_score.length; w++) {
            this.diffLevelScoreLabels.push(data.difficulty_level_score[w].Diff_Lvl_Nm);

            if (data.difficulty_level_score[w].Incorrect == null) {
              data.difficulty_level_score[w].Incorrect = 0;
            }
            if (data.difficulty_level_score[w].Correct == null) {
              data.difficulty_level_score[w].Correct = 0;
            }
            if (data.difficulty_level_score[w].Missed == null) {
              data.difficulty_level_score[w].Missed = 0;
            }

            IncrctTwo.push(data.difficulty_level_score[w].Incorrect);
            CrctTwo.push(data.difficulty_level_score[w].Correct);
            MissedTwo.push(data.difficulty_level_score[w].Missed);
          }
          this.diffLevelScoreData = [
            { data: IncrctTwo, label: 'Incorrect' },
            { data: CrctTwo, label: 'Correct' },
            { data: MissedTwo, label: 'Missed' }
          ]

        },
        error => {

          this.showload = false;
          if (error.status == 404) {
            // this.router.navigateByUrl('author/NotFound');
            this.paChart3 = true;
            this.errMsgChart = "Oops! Chart Not Found";
          }
          else if (error.status == 401) {
            this.cookieService.deleteAll();
            window.location.href = credentials.accountUrl;
            // window.location.href='http://accounts.scora.in';
          }
          else {
            // this.router.navigateByUrl('author/serverError');
            this.paChart3 = true;
            this.errMsgChart = "Oops! Something Went Wrong. Try Again Later";
          }

        }


      );
  }


  radioChartTwo(testId) {

    this.paChart4Tax = false;
    this.showload = true;
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));


    this.http.get(credentials.userdashboardHost + '/pa_taxonomy/' + this.cookieService.get('_PAOID') + '/' + testId, { headers: headers })

      .map(res => res.json())
      .catch((e: any) => {
        return Observable.throw(e)
      })

      .subscribe(
        data => {
          this.showload = false;

          this.topAnalyse = false;
          this.perAnalyse = false;
          this.taxAnalyse = true;
          this.pa_taxonomydata = data;
          this.TaxonomyLabels = [];
          this.TaxonomyData = [];
          this.TaxonomyScoreLabels = [];
          this.TaxonomyScoreData = [];
          var IncrctOne;
          var CrctOne;
          var MissedOne;

          IncrctOne = [];
          CrctOne = [];
          MissedOne = [];

          var IncrctTwo;
          var CrctTwo;
          var MissedTwo;

          IncrctTwo = [];
          CrctTwo = [];
          MissedTwo = [];

          for (var q = 0; q < data.taxonomy_count.length; q++) {
            this.TaxonomyLabels.push(data.taxonomy_count[q].Taxonomy_Nm);

            if (data.taxonomy_count[q].Incorrect == null) {
              data.taxonomy_count[q].Incorrect = 0;
            }
            if (data.taxonomy_count[q].Correct == null) {
              data.taxonomy_count[q].Correct = 0;
            }
            if (data.taxonomy_count[q].Missed == null) {
              data.taxonomy_count[q].Missed = 0;
            }

            IncrctOne.push(data.taxonomy_count[q].Incorrect);
            CrctOne.push(data.taxonomy_count[q].Correct);
            MissedOne.push(data.taxonomy_count[q].Missed);
          }

          this.TaxonomyData = [
            { data: IncrctOne, label: 'Incorrect' },
            { data: CrctOne, label: 'Correct' },
            { data: MissedOne, label: 'Missed' }
          ]

          for (var w = 0; w < data.taxonomy_score.length; w++) {
            this.TaxonomyScoreLabels.push(data.taxonomy_score[w].Taxonomy_Nm);

            if (data.taxonomy_score[w].Incorrect == null) {
              data.taxonomy_score[w].Incorrect = 0;
            }
            if (data.taxonomy_score[w].Correct == null) {
              data.taxonomy_score[w].Correct = 0;
            }
            if (data.taxonomy_score[w].Missed == null) {
              data.taxonomy_score[w].Missed = 0;
            }

            IncrctTwo.push(data.taxonomy_score[w].Incorrect);
            CrctTwo.push(data.taxonomy_score[w].Correct);
            MissedTwo.push(data.taxonomy_score[w].Missed);
          }
          this.TaxonomyScoreData = [
            { data: IncrctTwo, label: 'Incorrect' },
            { data: CrctTwo, label: 'Correct' },
            { data: MissedTwo, label: 'Missed' }
          ]

        },
        error => {

          this.showload = false;
          if (error.status == 404) {
            // this.router.navigateByUrl('author/NotFound');
            this.paChart4Tax = true;
            this.errMsgChart = "Oops! Chart Not Found";
          }
          else if (error.status == 401) {
            this.cookieService.deleteAll();
            window.location.href = credentials.accountUrl;
            // window.location.href='http://accounts.scora.in';
          }
          else {
            // this.router.navigateByUrl('author/serverError');
            this.paChart4Tax = true;
            this.errMsgChart = "Oops! Something Went Wrong. Try Again Later";
          }

        }

      );
  }


  radioChartThree(testId) {
    this.paChart5Top = false;
    this.showload = true;
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));

    this.http.get(credentials.userdashboardHost + '/pa_topic/' + this.cookieService.get('_PAOID') + '/' + testId, { headers: headers })

      .map(res => res.json())
      .catch((e: any) => {
        return Observable.throw(e)
      })


      .subscribe(
        data => {

          this.pa_topicData = data;
          this.showload = false;
          this.topAnalyse = true;
          this.perAnalyse = false;
          this.taxAnalyse = false;

          this.TopicLabels = [];
          this.TopicData = [];
          this.TopicScoreLabels = [];
          this.TopicScoreData = [];
          var IncrctOne;
          var CrctOne;
          var MissedOne;

          IncrctOne = [];
          CrctOne = [];
          MissedOne = [];

          var IncrctTwo;
          var CrctTwo;
          var MissedTwo;

          IncrctTwo = [];
          CrctTwo = [];
          MissedTwo = [];

          for (var q = 0; q < data.topic_count.length; q++) {
            this.TopicLabels.push(data.topic_count[q].Topic_Nm);

            if (data.topic_count[q].Incorrect == null) {
              data.topic_count[q].Incorrect = 0;
            }
            if (data.topic_count[q].Correct == null) {
              data.topic_count[q].Correct = 0;
            }
            if (data.topic_count[q].Missed == null) {
              data.topic_count[q].Missed = 0;
            }

            IncrctOne.push(data.topic_count[q].Incorrect);
            CrctOne.push(data.topic_count[q].Correct);
            MissedOne.push(data.topic_count[q].Missed);
          }

          this.TopicData = [
            { data: IncrctOne, label: 'Incorrect' },
            { data: CrctOne, label: 'Correct' },
            { data: MissedOne, label: 'Missed' }
          ]

          for (var w = 0; w < data.topic_score.length; w++) {
            this.TopicScoreLabels.push(data.topic_score[w].Topic_Nm);

            if (data.topic_score[w].Incorrect == null) {
              data.topic_score[w].Incorrect = 0;
            }
            if (data.topic_score[w].Correct == null) {
              data.topic_score[w].Correct = 0;
            }
            if (data.topic_score[w].Missed == null) {
              data.topic_score[w].Missed = 0;
            }

            IncrctTwo.push(data.topic_score[w].Incorrect);
            CrctTwo.push(data.topic_score[w].Correct);
            MissedTwo.push(data.topic_score[w].Missed);
          }
          this.TopicScoreData = [
            { data: IncrctTwo, label: 'Incorrect' },
            { data: CrctTwo, label: 'Correct' },
            { data: MissedTwo, label: 'Missed' }
          ]

        },
        error => {

          this.showload = false;
          if (error.status == 404) {
            // this.router.navigateByUrl('author/NotFound');
            this.paChart5Top = true;
            this.errMsgChart = "Oops! Chart Not Found";
          }
          else if (error.status == 401) {
            this.cookieService.deleteAll();
            window.location.href = credentials.accountUrl;
            // window.location.href='http://accounts.scora.in';
          }
          else {
            // this.router.navigateByUrl('author/serverError');
            this.paChart5Top = true;
            this.errMsgChart = "Oops! Something Went Wrong. Try Again Later";
          }

        }

      );
  }


  tabActive(active) {
    this.activeTab = active;
  }

  testVsAvgClicked(e) {
    if (e.active.length != 0) {
      if (e.active[0]._index != undefined) {
        var curChartIndex;
        curChartIndex = e.active[0]._index;

        var headers = new Headers();
        this.showload = true;
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));


        this.http.get(credentials.userdashboardHost + '/pa_test_grp_score_drill/' + this.cookieService.get('_PAOID') + '/' + this.tempTestId + '/' + this.PerformanceSummaryTab2[curChartIndex].grp_id, { headers: headers })

          .map(res => res.json())
          .catch((e: any) => {
            return Observable.throw(e)
          })

          .subscribe(
            data => {

              this.showload = false;
              var drilledData = data;
              var tempDrilledMaxData;
              tempDrilledMaxData = [];
              var tempDrilledAvgData;
              tempDrilledAvgData = [];
              this.tvaLabels = [];
              this.tvaData = [];
              var tempKey;
              tempKey = false;
              for (var u = 0; u < drilledData.length; u++) {
                this.tvaLabels.push(drilledData[u].Section_Nm);
                tempDrilledMaxData.push(drilledData[u].max_Score);
                tempDrilledAvgData.push(drilledData[u].avg_score);

                this.tvaData = [
                  { data: tempDrilledMaxData, label: 'Max group Score' },
                  { data: tempDrilledAvgData, label: 'Avg group Score' }
                ];
                tempKey = true;
              }

              if (tempKey == true) {
                this.testVsAvg = false;
              }

            },
            // error => {

            //   this.showload= false;
            //   if(error.status == 404){
            //     this.router.navigateByUrl('author/NotFound');
            //   }
            //   else if(error.status == 401){
            //     this.cookieService.deleteAll();
            //     //  window.location.href='http://accounts.scora.in';
            //   }
            //   else{
            //     this.router.navigateByUrl('author/serverError');
            //   }

            // }



          );





      }

    }
  }

  chartClickedTab2(event) {


    if (event.active.length != 0) {
      if (event.active[0]._index != undefined) {
        this.Tab2ChartOne = false;
        if (event.active[0]._index == 0) {
          this.barChartLabelsTab2One = ['Section A', 'Section B', 'Section C'];
          this.barChartDataTab2One = [
            { data: [10, 10, 10], label: 'Max-Score' },
            { data: [9, 6, 3], label: 'Avg-Score' }
          ]

          this.curLabel = this.barChartLabelsTab2[0];
        }
        else if (event.active[0]._index == 1) {
          this.barChartLabelsTab2One = ['Singular', 'Plural'];
          this.barChartDataTab2One = [
            { data: [10, 10], label: 'Max-Score' },
            { data: [9, 5], label: 'Avg-Score' }
          ]

          this.curLabel = this.barChartLabelsTab2[1];
        }
      }
    }
    else {
      this.Tab2ChartOne = true;
    }


  }

  barToBarClicked(e) {
    if (e.active.length != 0) {
      if (e.active[0]._index != undefined) {
        var curChartIndex;
        curChartIndex = e.active[0]._index;

        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
        this.showload = true;

        this.http.get(credentials.userdashboardHost + '/ta_skill_grp_analysis_drill/' + this.cookieService.get('_PAOID') + '/' + this.dataAssigning.skill_grp_analysis[curChartIndex].grp_id, { headers: headers })

          .map(res => res.json())
          .catch((e: any) => {
            return Observable.throw(e)
          })

          .subscribe(
            data => {

              this.showload = false;
              var drilledData = data;
              var tempDrilledData;
              tempDrilledData = [];
              this.barToBarLabels = [];
              this.barToBarData = [];
              for (var u = 0; u < drilledData.length; u++) {
                this.barToBarLabels.push(drilledData[u].bucket);
                tempDrilledData.push(drilledData[u].COUNT);

                this.barToBarData = [
                  { data: tempDrilledData, label: 'No.of Users' }
                ];
              }
              this.dashBtoB = true;
            },
            // error => {

            //   this.showload= false;
            //   if(error.status == 404){
            //     this.router.navigateByUrl('author/NotFound');
            //   }
            //   else if(error.status == 401){
            //     this.cookieService.deleteAll();
            //     //  window.location.href='http://accounts.scora.in';
            //   }
            //   else{
            //     this.router.navigateByUrl('author/serverError');
            //   }

            // }
          )

      }

    }
  }


  lineToBarClicked(e) {

    if (e.active.length != 0) {
      if (e.active[0]._index != undefined) {
        var curChartIndex;
        curChartIndex = e.active[0]._index;

        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
        this.showload = true;

        this.http.get(credentials.userdashboardHost + '/ta_test_group_score_drill/' + this.cookieService.get('_PAOID') + '/' + this.dataAssigning.test_grp_performance[curChartIndex].test_id, { headers: headers })

          .map(res => res.json())
          .catch((e: any) => {
            return Observable.throw(e)
          })


          .subscribe(
            data => {

              this.showload = false;
              var drilledData = data;
              var tempDrilledMaxData;
              tempDrilledMaxData = [];
              var tempDrilledAvgData;
              tempDrilledAvgData = [];
              this.lineToBarLabels = [];
              this.lineToBarData = [];
              for (var u = 0; u < drilledData.length; u++) {
                this.lineToBarLabels.push(drilledData[u].grp_name);
                tempDrilledMaxData.push(drilledData[u].max_grp_score);
                tempDrilledAvgData.push(drilledData[u].avg_grp_score);

                this.lineToBarData = [
                  { data: tempDrilledMaxData, label: 'Max group Score' },
                  { data: tempDrilledAvgData, label: 'Avg group Score' }
                ];
              }
              this.dashLtoB = true;
            },
            // error => {

            //   this.showload= false;
            //   if(error.status == 404){
            //     this.router.navigateByUrl('author/NotFound');
            //   }
            //   else if(error.status == 401){
            //     this.cookieService.deleteAll();
            //     //  window.location.href='http://accounts.scora.in';
            //   }
            //   else{
            //     this.router.navigateByUrl('author/serverError');
            //   }

            // }
          );

      }

    }
  }

  lineToBarHome() {
    this.dashLtoB = false;
  }

  barToBarHome() {
    this.dashBtoB = false;
  }

  backToHomeChart() {
    this.Tab2ChartOne = true;
  }

  BarHome() {
    this.testVsAvg = true;
  }

  testSelectionDropDown(curTestId) {

    this.tempTestId = curTestId;
    this.getChartDetailsChartOne(curTestId);
   /////AA this.getChartDetailsChartTwo(curTestId);
    ///AAthis.getChartDetailsChartThree(curTestId);
    this.radioChartOne(curTestId);
    // this.radioChartTwo(curTestId);
    // this.radioChartThree(curTestId);
  }

  testSelectionDropDown3(curTestId) {

    this.tempTestId = curTestId;
    this.getChartDetailsChartOne(curTestId);
   ///AA this.getChartDetailsChartTwo(curTestId);
   //AA this.getChartDetailsChartThree(curTestId);
    this.radioChartOne(curTestId);
    // this.radioChartTwo(curTestId);
    // this.radioChartThree(curTestId);
  }





  curActiveChart(activeChart) {
    if (activeChart == 3) {
      this.radioChartThree(this.tempTestId);
      // this.topAnalyse = false;
      // this.perAnalyse = false;
      // this.taxAnalyse = false;
      this.radioSelect = 3;
    }
    else if (activeChart == 2) {
      this.radioChartTwo(this.tempTestId);
      // this.topAnalyse = false;
      // this.perAnalyse = false;
      // this.taxAnalyse = false;
      this.radioSelect = 2;
    }
    else {
      this.radioChartOne(this.tempTestId);
      // this.topAnalyse = false;
      // this.perAnalyse = false;
      // this.taxAnalyse = false;
      this.radioSelect = 1;
    }

  }

  // itemset analysis

  getTableData(itemset1id, itemset2id) {

    for (var i = 0; i < this.getItemSetDropdownValues.length; i++) {
      if (this.getItemSetDropdownValues[i].itemset_id == itemset1id) {
        this.itemset1 = this.getItemSetDropdownValues[i].ItemSet_Name;
      }
      if (this.getItemSetDropdownValues[i].itemset_id == itemset2id) {
        this.itemset2 = this.getItemSetDropdownValues[i].ItemSet_Name;
      }
    }
    this.showload = true;
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));

    this.itemSetIdOne = itemset1id;
    this.itemSetIdTwo = itemset2id;

    this.http.get(credentials.userdashboardHost + '/table_data/' + this.cookieService.get('_PAOID') + '/' + this.itemSetIdOne + '/' + this.itemSetIdTwo, { headers: headers })

      // this.http.get('http://.brigita.co//public/api/test_admin_test_grp/1' , {headers:headers})

      // this.http.get('../assets/files/apiCall.json')

      .map(res => res.json())

      .subscribe(
        data => {
          this.showload = false;
          this.getLeftSideChartData = [];
          this.getRightSideChartData = [];
          this.leftSideChartDisplay = false;
          this.leftSideChartDisplay2 = true;
          this.leftSideChartDisplay3 = false;
          this.leftSideChartDisplay4 = false;

          this.itemsetAnalysisToggle = 1;

          this.tableDataBinding = data;
          this.getLeftSideChartDataApiCall(this.itemSetIdOne);
          this.getRightSideChartDataApiCall(this.itemSetIdTwo);


        },
        error => {

          this.showload = false;

          if (error.status == 404) {
            this.tableDataBinding = [];
            // this.router.navigateByUrl('author/NotFound');
          }
          else if (error.status == 401) {
            this.cookieService.deleteAll();
            window.location.href = credentials.accountUrl;
            // window.location.href='http://accounts.scora.in';
          }
          else {
            this.tableDataBinding = [];
            this.router.navigateByUrl('pages/serverError');
          }

        }
      );
  }


  getLeftSideChartDataApiCall(itemSetIdOne) {
    this.ISCChartLeft = false;
    this.showload = true;
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));

    this.http.get(credentials.userdashboardHost + '/itemset_chart/' + this.cookieService.get('_PAOID') + '/' + itemSetIdOne, { headers: headers })

      // this.http.get('http://.brigita.co//public/api/test_admin_test_grp/1' , {headers:headers})

      // this.http.get('../assets/files/apiCall.json')

      .map(res => res.json())

      .subscribe(
        data => {
          this.showload = false;

          this.getLeftSideChartData = data;
          this.leftOneChartLabels = [];
          this.leftOneChartData = [];

          if (this.getLeftSideChartData.taxonomy.length != 0) {
            for (var i = 0; i < this.getLeftSideChartData.taxonomy.length; i++) {
              this.leftOneChartLabels.push(this.getLeftSideChartData.taxonomy[i].Taxonomy_Nm);
              this.leftOneChartData.push(this.getLeftSideChartData.taxonomy[i].No_Of_Items);
            }
          }


          this.leftTwoChartLabels = [];
          this.leftTwoChartData = [];

          if (this.getLeftSideChartData.difficulty_level.length != 0) {
            for (var i = 0; i < this.getLeftSideChartData.difficulty_level.length; i++) {
              this.leftTwoChartLabels.push(this.getLeftSideChartData.difficulty_level[i].Diff_Lvl_Nm);
              this.leftTwoChartData.push(this.getLeftSideChartData.difficulty_level[i].No_Of_Items);
            }
          }
          this.leftThreeChartLabels = [];
          this.leftThreeChartData = [];
          if (this.getLeftSideChartData.topic.length != 0) {
            var noOfItems: any[] = [];

            for (var i = 0; i < this.getLeftSideChartData.topic.length; i++) {

              noOfItems.push(this.getLeftSideChartData.topic[i].No_Of_Items);

              this.leftThreeChartLabels.push(this.getLeftSideChartData.topic[i].Topic_Nm);
              this.leftThreeChartData = [
                { data: noOfItems, label: 'No.of Items' }
              ];
            }
          }



          this.leftFourChartLabels = [];
          this.leftFourChartData = [];


          if (this.getLeftSideChartData.itemset_data.length != 0) {
            var noOfItems1: any[] = [];

            for (var i = 0; i < this.getLeftSideChartData.itemset_data.length; i++) {
              noOfItems1.push(this.getLeftSideChartData.itemset_data[i].No_Of_Items);

              this.leftFourChartLabels.push(this.getLeftSideChartData.itemset_data[i].Item_Type_Nm);
              this.leftFourChartData = [
                { data: noOfItems1, label: 'No.of Items' }
              ];
            }
          }


          // this.leftSideChartDisplay2 = true;
          this.leftSideChartDisplay = false;
          this.leftSideChartDisplay2 = true;
          this.leftSideChartDisplay3 = false;
          this.leftSideChartDisplay4 = false;

        },
        error => {

          this.showload = false;
          if (error.status == 404) {
            // this.router.navigateByUrl('author/NotFound');
            this.ISCChartLeft = true;
            this.errMsgChart = "Oops! Chart Not Found";
          }
          else if (error.status == 401) {
            this.cookieService.deleteAll();
            window.location.href = credentials.accountUrl;
            // window.location.href='http://accounts.scora.in';
          }
          else {
            // this.router.navigateByUrl('author/serverError');
            this.ISCChartLeft = true;
            this.errMsgChart = "Oops! Something Went Wrong. Try Again Later";
          }

        }


      );
  }

  getRightSideChartDataApiCall(itemSetIdTwo) {
    this.ISCChartRight = false;
    this.showload = true;
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));



    // var itemSetIdOne;
    // var itemSetIdTwo;
    // var tempLastIndex = data.length -1;
    // for(var y=0;y<data.length;y++)
    // {
    //   itemSetIdOne = data[0].itemset_id;
    //   itemSetIdTwo = data[tempLastIndex].itemset_id;
    // }



    this.http.get(credentials.userdashboardHost + '/itemset_chart/' + this.cookieService.get('_PAOID') + '/' + itemSetIdTwo, { headers: headers })

      // this.http.get('http://.brigita.co//public/api/test_admin_test_grp/1' , {headers:headers})

      // this.http.get('../assets/files/apiCall.json')

      .map(res => res.json())

      .subscribe(
        data => {
          this.showload = false;

          this.getRightSideChartData = data;

          this.rightOneChartLabels = [];
          this.rightOneChartData = [];

          if (this.getRightSideChartData.taxonomy.length != 0) {
            for (var i = 0; i < this.getRightSideChartData.taxonomy.length; i++) {
              this.rightOneChartLabels.push(this.getRightSideChartData.taxonomy[i].Taxonomy_Nm);
              this.rightOneChartData.push(this.getRightSideChartData.taxonomy[i].No_Of_Items);
            }
          }

          this.rightTwoChartLabels = [];
          this.rightTwoChartData = [];

          if (this.getRightSideChartData.difficulty_level.length != 0) {
            for (var i = 0; i < this.getRightSideChartData.difficulty_level.length; i++) {
              this.rightTwoChartLabels.push(this.getRightSideChartData.difficulty_level[i].Diff_Lvl_Nm);
              this.rightTwoChartData.push(this.getRightSideChartData.difficulty_level[i].No_Of_Items);
            }
          }



          this.rightThreeChartLabels = [];
          this.rightThreeChartData = [];


          if (this.getRightSideChartData.topic.length != 0) {
            var noOfItems: any[] = [];

            for (var i = 0; i < this.getRightSideChartData.topic.length; i++) {

              noOfItems.push(this.getRightSideChartData.topic[i].No_Of_Items);

              this.rightThreeChartLabels.push(this.getRightSideChartData.topic[i].Topic_Nm);
              this.rightThreeChartData = [
                { data: noOfItems, label: 'No.of Items' }
              ];
            }
          }


          this.rightFourChartLabels = [];
          this.rightFourChartData = [];


          if (this.getRightSideChartData.itemset_data.length != 0) {
            var noOfItems1: any[] = [];

            for (var i = 0; i < this.getRightSideChartData.itemset_data.length; i++) {
              noOfItems1.push(this.getRightSideChartData.itemset_data[i].No_Of_Items);

              this.rightFourChartLabels.push(this.getRightSideChartData.itemset_data[i].Item_Type_Nm);
              this.rightFourChartData = [
                { data: noOfItems1, label: 'No.of Items' }
              ];
            }
          }

          this.leftSideChartDisplay = false;
          this.leftSideChartDisplay2 = true;
          this.leftSideChartDisplay3 = false;
          this.leftSideChartDisplay4 = false;

        },
        error => {

          this.showload = false;
          if (error.status == 404) {
            // this.router.navigateByUrl('author/NotFound');
            this.ISCChartRight = true;
            this.errMsgChart = "Oops! Chart Not Found";
          }
          else if (error.status == 401) {
            this.cookieService.deleteAll();
            window.location.href = credentials.accountUrl;
            // window.location.href='http://accounts.scora.in';
          }
          else {
            // this.router.navigateByUrl('author/serverError');
            this.ISCChartRight = true;
            this.errMsgChart = "Oops! Something Went Wrong. Try Again Later";
          }

        }


      );
  }


  itemSetDropDownData(subId) {
    this.itemsetSubjectId = subId;
    this.showload = true;
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));


    this.http.get(credentials.userdashboardHost + '/itemset_by_sub/' + this.cookieService.get('_PAOID') + '/' + subId, { headers: headers })

      // this.http.get('http://.brigita.co//public/api/test_admin_test_grp/1' , {headers:headers})

      // this.http.get('../assets/files/apiCall.json')

      .map(res => res.json())

      .subscribe(
        data => {
          this.showload = false;
          this.itemsetAnalysisToggle = 1;
          this.getLeftSideChartData = [];
          this.getRightSideChartData = [];
          this.leftSideChartDisplay = false;
          this.leftSideChartDisplay2 = true;
          this.leftSideChartDisplay3 = false;
          this.leftSideChartDisplay4 = false;

          this.getItemSetDropdownValues = data;

          if (data.length >= 2) {
            this.itemset1 = data[0].ItemSet_Name;
            this.itemset2 = data[1].ItemSet_Name;
            this.getTableData(data[0].itemset_id, data[1].itemset_id);
            // this.getLeftSideChartDataApiCall(data[0].itemset_id);
            // this.getRightSideChartDataApiCall(data[1].itemset_id);
          }
          else {
            this.tableDataBinding = [];
            this.itemsetAnalysisToggle = 1;
            this.getLeftSideChartData = [];
            this.getRightSideChartData = [];
          }

        },
        error => {

          this.showload = false;
          if (error.status == 404) {
            // this.router.navigateByUrl('author/NotFound');
            this.tableDataBinding = [];
            this.itemsetAnalysisToggle = 1;
            this.getLeftSideChartData = [];
            this.getRightSideChartData = [];
          }
          else if (error.status == 401) {
            this.cookieService.deleteAll();
            window.location.href = credentials.accountUrl;
            // window.location.href='http://accounts.scora.in';
          }
          else {
            // this.router.navigateByUrl('author/serverError');
            this.tableDataBinding = [];
            this.itemsetAnalysisToggle = 1;
            this.getLeftSideChartData = [];
            this.getRightSideChartData = [];
          }

        }


      );
  }

  subjectDropDownData() {
    this.showload = true;
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));


    this.http.get(credentials.userdashboardHost + '/sub_itemset/' + this.cookieService.get('_PAOID'), { headers: headers })

      // this.http.get('http://.brigita.co//public/api/test_admin_test_grp/1' , {headers:headers})

      // this.http.get('../assets/files/apiCall.json')

      .map(res => res.json())

      .subscribe(
        data => {
          this.showload = false;
          if (data.length != 0) {
            this.getLeftSideChartData = [];
            this.getRightSideChartData = [];
            this.itemSetDropDownData(data[0].subject_id);
            this.subjectSelectionDropDown(data[0].subject_id);
          }

          this.getSubjectDropdownValues = data;
          this.getSubjectValue = data;


        },
        error => {

          this.showload = false;
          this.getSubjectDropdownValues = [];
          // if(error.status == 404){
          //   this.router.navigateByUrl('/NotFound');
          // }
          // else if(error.status == 401){
          //   this.cookieService.deleteAll();
          //   //  window.location.href='http://accounts.scora.in';
          // }
          // else{
          //   this.router.navigateByUrl('/serverError');
          // }

        }


      );
  }

  selectDiffLevel() {
    this.leftSideChartDisplay = false;
    this.leftSideChartDisplay2 = true;
    this.leftSideChartDisplay3 = false;
    this.leftSideChartDisplay4 = false;
    this.itemsetAnalysisToggle = 1;

  }

  selectTaxonomy() {
    this.leftSideChartDisplay = true;
    this.leftSideChartDisplay2 = false;
    this.leftSideChartDisplay3 = false;
    this.leftSideChartDisplay4 = false;
    this.itemsetAnalysisToggle = 2;
  }

  selectTopic() {
    this.leftSideChartDisplay = false;
    this.leftSideChartDisplay2 = false;
    this.leftSideChartDisplay3 = true;
    this.leftSideChartDisplay4 = false;
    this.itemsetAnalysisToggle = 3;
  }

  selectItemType() {
    this.leftSideChartDisplay = false;
    this.leftSideChartDisplay2 = false;
    this.leftSideChartDisplay3 = false;
    this.leftSideChartDisplay4 = true;
    this.itemsetAnalysisToggle = 4;
  }


  skillGroupAnalysisDrillTable(e) {


    if (e.active.length != 0) {
      if (e.active[0]._index != undefined) {

        var curChartIndex;
        curChartIndex = e.active[0]._index;


        var leftRange;
        var rightRange;

        if (this.barChartLabelsTab2Two[curChartIndex] == "<30") {
          leftRange = 0;
          rightRange = 30;
        }
        else if (this.barChartLabelsTab2Two[curChartIndex] == "30-40") {
          leftRange = 30;
          rightRange = 40;
        }
        else if (this.barChartLabelsTab2Two[curChartIndex] == "40-50") {
          leftRange = 40;
          rightRange = 50;
        }
        else if (this.barChartLabelsTab2Two[curChartIndex] == "50-60") {
          leftRange = 50;
          rightRange = 60;
        }
        else if (this.barChartLabelsTab2Two[curChartIndex] == "60-70") {
          leftRange = 60;
          rightRange = 70;
        }
        else if (this.barChartLabelsTab2Two[curChartIndex] == "70-80") {
          leftRange = 70;
          rightRange = 80;
        }
        else if (this.barChartLabelsTab2Two[curChartIndex] == "80-90") {
          leftRange = 80;
          rightRange = 90;
        }
        else if (this.barChartLabelsTab2Two[curChartIndex] == ">90") {
          leftRange = 90;
          rightRange = 100;
        }


        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
        this.showload = true;

        this.http.get(credentials.userdashboardHost + '/pa_skill_grp_analysis_drill/' + this.cookieService.get('_PAOID') + '/' + this.tempTestId + '/' + leftRange + '/' + rightRange, { headers: headers })

          .map(res => res.json())
          .catch((e: any) => {
            return Observable.throw(e)
          })



          .subscribe(
            data => {
              this.showload = false;


              this.skillGroupAnalysisTableData = data;
              this.skillGrp = false;
            },
            // error => {

            //   this.showload= false;
            //   if(error.status == 404){
            //     this.router.navigateByUrl('author/NotFound');
            //   }
            //   else if(error.status == 401){
            //     this.cookieService.deleteAll();
            //     //  window.location.href='http://accounts.scora.in';
            //   }
            //   else{
            //     this.router.navigateByUrl('author/serverError');
            //   }

            // }

          );
      }
    }

  }

//Avila  ***********
  upcomingTestDrillTable(e) {

    if (e.active.length != 0) {
      if (e.active[0]._index != undefined) {

        var curChartIndex;
        curChartIndex = e.active[0]._index;
        var org_id;
        org_id = this.cookieService.get('_PAOID');
        var month_number;
        month_number = this.upcomingtestdetails[curChartIndex].MonthNumber;

        var body = {
          org_id: org_id,
          month_number:month_number
        }

        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
        this.showload = true;

        // this.http.post(credentials.userdashboardHost + '/admin_upcoming_test_detail' + this.cookieService.get('_PAOID'), body, { headers: headers })
        this.http.post('http://15.207.209.163/new-scora/scoraauthor/public/api' + '/admin_upcoming_test_detail' , body, { headers: headers })

          .map(res => res.json())
          .catch((e: any) => {
            return Observable.throw(e)
          })

          .subscribe(
            data => {
              this.showload = false;
              this.upcomingtestdetailsDrillTableData = data;
              this.upcmgtst = false;
            },
          );
      }
    }

  }

  testDeliveredDrillTable(e) {

    if (e.active.length != 0) {
      if (e.active[0]._index != undefined) {

        var curChartIndex;
        curChartIndex = e.active[0]._index;
        var org_id;
        org_id = this.cookieService.get('_PAOID');
        var month_number;
        month_number = this.testdelivereddetails[curChartIndex].MonthNumber;

        var body = {
          org_id: org_id,
          month_number:month_number
        }

        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
        this.showload = true;

        // this.http.post(credentials.userdashboardHost + '/admin_upcoming_test_detail' + this.cookieService.get('_PAOID'), body, { headers: headers })
        this.http.post('http://15.207.209.163/new-scora/scoraauthor/public/api' + '/admin_delivered_test_detail' , body, { headers: headers })

          .map(res => res.json())
          .catch((e: any) => {
            return Observable.throw(e)
          })

          .subscribe(
            data => {
              this.showload = false;
              this.testdelivereddetailsDrillTableData = data;
              this.testdlvr = false;
            },
          );
      }
    }

  }

  itemBankDrillTable(e) {

    if (e.active.length != 0) {
      if (e.active[0]._index != undefined) {

        var curChartIndex;
        curChartIndex = e.active[0]._index;
        var org_id;
        org_id = this.cookieService.get('_PAOID');
        var month_number;
        month_number = this.itembankdetails.item_by_month[curChartIndex].month_number;

        var body = {
          org_id: org_id,
          month_number:month_number
        }

        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
        this.showload = true;

         this.http.post(credentials.userdashboardHost + '/admin_item_bank_detail', body, { headers: headers })
       // this.http.post('http://15.207.209.163/new-scora/scoraauthor/public/api' + '/admin_item_bank_detail' , body, { headers: headers })

          .map(res => res.json())
          .catch((e: any) => {
            return Observable.throw(e)
          })

          .subscribe(
            data => {
              this.showload = false;
              this.itemBankdetailsDrillTableData = data.item_by_month;
              this.itembnk = false;
            },
          );
      }
    }

  }

  ItemByAuthorsClicked(e) {
    if (e.active.length != 0) {
      if (e.active[0]._index != undefined) {
        var curChartIndex;
        curChartIndex = e.active[0]._index;
        var org_id;
        org_id = this.cookieService.get('_PAOID');
        var authorId;
        authorId = this.itemByAuthorsDetailsData.item_by_author[curChartIndex].Author_ID;
        var body = { org_id: org_id, Author_ID: authorId}
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
        this.showload = true;
        this.http.post(credentials.userdashboardHost + '/admin_item_by_author_detail', body , { headers: headers })

          .map(res => res.json())
          .catch((e: any) => {
            return Observable.throw(e)
          })
          .subscribe(
            data => {
              this.showload = false;
              this.authorVsSubjectwiseDrillData = data.item_by_subject;
              console.log(this.authorVsSubjectwiseDrillData);
              // this.scheduledSummaryDrill = true;
              this.itemByAuthorDrill = true;
            },
          );

      }

    }
    this.itemByAuthorDrill = true;
  }
//*************** */
  userByTestGrpClicked(e) {


    if (e.active.length != 0) {
      if (e.active[0]._index != undefined) {

        var curChartIndex;
        curChartIndex = e.active[0]._index;

        var tempGrpId;

        tempGrpId = this.dataAssigning.candidate_by_test_group[curChartIndex].grp_id


        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
        this.showload = true;

        this.http.get(credentials.userdashboardHost + '/ta_test_grp_drill/' + this.cookieService.get('_PAOID') + '/' + tempGrpId, { headers: headers })

          .map(res => res.json())
          .catch((e: any) => {
            return Observable.throw(e)
          })
          .subscribe(
            data => {

              this.showload = false;
              var userByTestGroupDrillData = data;

              if (userByTestGroupDrillData.length != 0) {
                this.userByChartLabels = [];
                this.userByChartData = [];
                var tempCompArray;
                var tempPauseArray;
                tempCompArray = [];
                tempPauseArray = [];
                for (var d = 0; d < userByTestGroupDrillData.length; d++) {
                  this.userByChartLabels.push(userByTestGroupDrillData[d].tenant_user_nm);
                  tempCompArray.push(userByTestGroupDrillData[d].Completed);
                  tempPauseArray.push(userByTestGroupDrillData[d].Paused);
                }

                this.userByChartData = [
                  { data: tempCompArray, label: 'Completed' },
                  { data: tempPauseArray, label: 'Paused' }
                ]
                this.userByTestGroupDrill = true;
              }
            },
          );

      }

    }
  }

  ScheduledSummaryClicked(e) {
    if (e.active.length != 0) {
      if (e.active[0]._index != undefined) {

        var curChartIndex;
        curChartIndex = e.active[0]._index;

        var tempGrpId;

        tempGrpId = this.dataAssigning.test_taken_vs_test_sched[curChartIndex].grp_id


        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
        this.showload = true;

        this.http.get(credentials.userdashboardHost + '/ta_test_scheduled_drill/' + this.cookieService.get('_PAOID') + '/' + tempGrpId, { headers: headers })

          .map(res => res.json())
          .catch((e: any) => {
            return Observable.throw(e)
          })



          .subscribe(
            data => {

              this.showload = false;
              this.testTakenVsTestScheduledDrillData = data;


              this.scheduledSummaryDrill = true;



            },
            // error => {

            //   this.showload= false;
            //   if(error.status == 404){
            //     this.router.navigateByUrl('author/NotFound');
            //   }
            //   else if(error.status == 401){
            //     this.cookieService.deleteAll();
            //     //  window.location.href='http://accounts.scora.in';
            //   }
            //   else{
            //     this.router.navigateByUrl('author/serverError');
            //   }

            // }

          );

      }

    }
  }

  userByHome() {
    this.userByTestGroupDrill = false;
  }

  TestVsHome() {
    this.scheduledSummaryDrill = false;
  }

  ItemsByAuthorVsHome() {
    this.itemByAuthorDrill = false;
  }
  getTabFiveChartDetails() {
    this.subjectDrill = false;
    this.authorDrill = false;

    this.TabSixDetailsTopic = false;
   // this.TabSixDetailsSubTopic = false;
    this.TabSixDetailsDiffLevel = false;
    this.TabSixDetailsTaxonomy = false;

    this.IBRChart1 = false;
    this.showload = true;
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));


    this.http.get(credentials.userdashboardHost + '/itemset_description/' + this.cookieService.get('_PAOID'), { headers: headers })

      // this.http.get('http://.brigita.co//public/api/pa_test_group/1' , {headers:headers})


      .map(res => res.json())
      .catch((e: any) => {
        return Observable.throw(e)
      })

      .subscribe(
        data => {
          //  this.itemsByAuthorAndItemType();

          this.showload = false;
          this.itemSetBySubjectOptions = {

            scaleShowVerticalLines: false,
            responsive: true,
            legend: { position: 'left' },
            FontSize: 40,
            tooltips: {
              callbacks: {
                label: tooltipItem => `${tooltipItem.yLabel}: ${tooltipItem.xLabel}`,
                title: () => null,
              }
            },

            onAnimationComplete: function () {
              this.showTooltip(this.segments, true);
            }
          };

          this.itemSetByAuthorOptions = {

            legend: { position: 'left' },
            boxWidth: 100,
            tooltipEvents: [],
            showTooltips: false,
            tooltipCaretSize: 0,
            pieceLabel: {
              render: function (args) {
                //
                const percentage = args.percentage,
                  value = args.value;

                // return label + ': ' + value;
                return value;
                // return percentage + '%';
              }
              // position: 'outside',
              // fontStyle: 'bold',
            }
          };





          this.getItemBankChartDetails = data;
          this.itemSetBySubjectLabels = [];
          this.itemSetBySubjectData = [];
          var tempitemSetBySubjectDataArray;
          tempitemSetBySubjectDataArray = [];




          if (!this.isEmptyObject(this.getItemBankChartDetails)) {
            this.showItembankchartDiv = true;
            if (this.getItemBankChartDetails.itemset_by_subjects.length != 0) {
              for (var t = 0; t < this.getItemBankChartDetails.itemset_by_subjects.length; t++) {
                this.itemSetBySubjectLabels.push(this.getItemBankChartDetails.itemset_by_subjects[t].subject_nm);
                tempitemSetBySubjectDataArray.push(this.getItemBankChartDetails.itemset_by_subjects[t].No_Of_Itemsets);
              }

              this.itemSetBySubjectData = [
                { data: tempitemSetBySubjectDataArray, label: 'No.of Item Sets' }
              ];
            }

          } else {
            this.showItembankchartDiv = false;
          }
          this.itemSetByAuthorLabels = [];
          this.itemSetByAuthorData = [];
          var tempitemSetByAuthorDataArray;
          tempitemSetByAuthorDataArray = [];

          if (!this.isEmptyObject(this.getItemBankChartDetails)) {
            this.showItembankchartDiv = true;
            if (this.getItemBankChartDetails.itemset_by_author.length != 0) {
              for (var y = 0; y < this.getItemBankChartDetails.itemset_by_author.length; y++) {
                this.itemSetByAuthorLabels.push(this.getItemBankChartDetails.itemset_by_author[y].Tenant_user_nm);
                this.itemSetByAuthorData.push(this.getItemBankChartDetails.itemset_by_author[y].No_of_Itemsets);
              }

            }
          } else {
            this.showItembankchartDiv = false;
          }
        },
        error => {

          this.showload = false;
          if (error.status == 404) {
            // this.router.navigateByUrl('author/NotFound');
            this.IBRChart1 = true;
            this.errMsgChart = "Oops! Chart Not Found";
          }
          else if (error.status == 401) {
            this.cookieService.deleteAll();
            window.location.href = credentials.accountUrl;
            // window.location.href='http://accounts.scora.in';
          }
          else {
            // this.router.navigateByUrl('author/serverError');
            this.IBRChart1 = true;
            this.errMsgChart = "Oops! Something Went Wrong. Try Again Later";
          }

        }

      );
  }

  itemSetBySubjectClicked(e) {


    if (e.active.length != 0) {
      if (e.active[0]._index != undefined) {
        this.showload = true;
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
        var curIndex;
        curIndex = e.active[0]._index;
        var tempSubId;
        tempSubId = this.getItemBankChartDetails.itemset_by_subjects[curIndex].Subject_ID;

        this.http.get(credentials.userdashboardHost + '/itemset_description_subject_drill/' + this.cookieService.get('_PAOID') + '/' + tempSubId, { headers: headers })

          // this.http.get('http://.brigita.co//public/api/pa_test_group/1' , {headers:headers})


          .map(res => res.json())
          .catch((e: any) => {
            return Observable.throw(e)
          })

          .subscribe(
            data => {
              // this.subjectDrill = true;

              this.showload = false;
              this.getSubjectDrillResponse = data;
              if (this.getSubjectDrillResponse.length != 0) {
                var tempDrillArray;
                tempDrillArray = [];
                this.itemSetBySubjectDrillLabels = [];
                this.itemSetBySubjectDrillData = [];

                for (var o = 0; o < this.getSubjectDrillResponse.length; o++) {
                  this.itemSetBySubjectDrillLabels.push(this.getSubjectDrillResponse[o].ItemSet_Name);
                  tempDrillArray.push(this.getSubjectDrillResponse[o].No_Of_Items);
                }

                this.itemSetBySubjectDrillData = [
                  { data: tempDrillArray, label: 'No.of Items' }
                ];

              }

              this.subjectDrill = true;
            },
            //  error => {

            //   this.showload= false;
            //   if(error.status == 404){
            //     this.router.navigateByUrl('/NotFound');
            //   }
            //   else if(error.status == 401){
            //     this.cookieService.deleteAll();
            //     //  window.location.href='http://accounts.scora.in';
            //   }
            //   else{
            //     this.router.navigateByUrl('/serverError');
            //   }

            // }


          );
      }

    }

  }

  itemSetByAuthorClicked(e) {


    if (e.active.length != 0) {
      if (e.active[0]._index != undefined) {
        this.showload = true;
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));

        var curIndex;
        curIndex = e.active[0]._index;
        var tempAuthorId;
        tempAuthorId = this.getItemBankChartDetails.itemset_by_author[curIndex].Author_ID;


        this.http.get(credentials.userdashboardHost + '/itemset_description_author_drill/' + this.cookieService.get('_PAOID') + '/' + tempAuthorId, { headers: headers })


          .map(res => res.json())
          .catch((e: any) => {
            return Observable.throw(e)
          })

          .subscribe(
            data => {


              this.showload = false;
              this.getAuthorDrillResponse = data;

              if (this.getAuthorDrillResponse.length != 0) {
                var tempDrillArray;
                tempDrillArray = [];
                this.itemSetByAuthorDrillLabels = [];
                this.itemSetByAuthorDrillData = [];

                for (var m = 0; m < this.getAuthorDrillResponse.length; m++) {
                  this.itemSetByAuthorDrillLabels.push(this.getAuthorDrillResponse[m].ItemSet_Name);
                  tempDrillArray.push(this.getAuthorDrillResponse[m].No_Of_Items);
                }

                this.itemSetByAuthorDrillData = [
                  { data: tempDrillArray, label: 'No.of Items' }
                ];
                this.authorDrill = true;
              }
              else {
                alert('No data');
                this.authorDrill = false;
              }



            },
            //  error => {

            //   this.showload= false;
            //   if(error.status == 404){
            //     this.router.navigateByUrl('/NotFound');
            //   }
            //   else if(error.status == 401){
            //     this.cookieService.deleteAll();
            //     //  window.location.href='http://accounts.scora.in';
            //   }
            //   else{
            //     this.router.navigateByUrl('/serverError');
            //   }

            // }


          );
      }

    }

  }

  itemsByAuthorClicked(e) {

    if (e.active.length != 0) {
      if (e.active[0]._index != undefined) {
        this.showload = true;
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));

        var curIndex;
        curIndex = e.active[0]._index;
        var tempAuthorId;
        tempAuthorId = this.itemsByAuthorAndItemTypeResponse.item_distribution_by_author[curIndex].Author_ID;


        this.http.get(credentials.userdashboardHost + '/item_description_by_author_drill/' + this.cookieService.get('_PAOID') + '/' + tempAuthorId, { headers: headers })


          .map(res => res.json())
          .catch((e: any) => {
            return Observable.throw(e)
          })

          .subscribe(
            data => {
              this.showload = false;

              var tempDrilledAuthorData;
              tempDrilledAuthorData = data;
              if (tempDrilledAuthorData.length != 0) {
                this.itemsByAuthorDrillLabels = [];
                this.itemsByAuthorDrillData = [];
                var tempAuthorArray;
                tempAuthorArray = [];
                for (var d = 0; d < tempDrilledAuthorData.length; d++) {
                  this.itemsByAuthorDrillLabels.push(tempDrilledAuthorData[d].topic_nm);
                  tempAuthorArray.push(tempDrilledAuthorData[d].No_of_Items);
                }

                this.itemsByAuthorDrillData = [
                  { data: tempAuthorArray, label: 'No.of Items' }
                ];

                this.itemsByAuthorDrill = true;


              }


            },
            //  error => {

            //   this.showload= false;
            //   if(error.status == 404){
            //     this.router.navigateByUrl('/NotFound');
            //   }
            //   else if(error.status == 401){
            //     this.cookieService.deleteAll();
            //     //  window.location.href='http://accounts.scora.in';
            //   }
            //   else{
            //     this.router.navigateByUrl('/serverError');
            //   }

            // }


          );
      }
    }
  }

  itemsByItemTypeClicked(e) {

    if (e.active.length != 0) {
      if (e.active[0]._index != undefined) {
        this.showload = true;
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));

        var curIndex;
        curIndex = e.active[0]._index;
        var tempItemTypeId;
        tempItemTypeId = this.itemsByAuthorAndItemTypeResponse.item_distribution_by_itemtype[curIndex].Item_Type_id;


        this.http.get(credentials.userdashboardHost + '/item_description_by_itemtype_drill/' + this.cookieService.get('_PAOID') + '/' + tempItemTypeId, { headers: headers })


          .map(res => res.json())
          .catch((e: any) => {
            return Observable.throw(e)
          })

          .subscribe(
            data => {
              this.showload = false;

              var tempDrilledItemTypeData;
              tempDrilledItemTypeData = data;
              if (tempDrilledItemTypeData.length != 0) {
                this.itemsByItemTypeDrillLabels = [];
                this.itemsByItemTypeDrillData = [];

                for (var d = 0; d < tempDrilledItemTypeData.length; d++) {
                  this.itemsByItemTypeDrillLabels.push(tempDrilledItemTypeData[d].diff_lvl_nm);
                  this.itemsByItemTypeDrillData.push(tempDrilledItemTypeData[d].No_of_Items);
                }

                this.itemsByItemTypeDrill = true;


              }


            },
            //  error => {

            //   this.showload= false;
            //   if(error.status == 404){
            //     this.router.navigateByUrl('/NotFound');
            //   }
            //   else if(error.status == 401){
            //     this.cookieService.deleteAll();
            //     //  window.location.href='http://accounts.scora.in';
            //   }
            //   else{
            //     this.router.navigateByUrl('/serverError');
            //   }

            // }


          );
      }
    }
  }

  subjectSelectionDropDown(subjectId) {
    this.reportSubId = subjectId;
    this.TabSixDetailsTopic = false;
    //this.TabSixDetailsSubTopic = false;
    this.TabSixDetailsDiffLevel = false;
    this.TabSixDetailsTaxonomy = false;
    this.SRChart = false;

    this.showload = true;

    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));

    this.http.get(credentials.userdashboardHost + '/subject_wise_items/' + this.cookieService.get('_PAOID') + '/' + subjectId, { headers: headers })

      .map(res => res.json())
      .catch((e: any) => {
        return Observable.throw(e)
      })

      .subscribe(
        data => {

          this.showload = false;
          this.subjectWiseItemDetailsData = data;

          if (this.subjectWiseItemDetailsData.item_by_topic.length != 0) {
            this.itemsByTopicLabels = [];
            this.itemsByTopicData = [];

            var tempTopicArray;
            tempTopicArray = [];

            for (var q = 0; q < this.subjectWiseItemDetailsData.item_by_topic.length; q++) {
              this.itemsByTopicLabels.push(this.subjectWiseItemDetailsData.item_by_topic[q].topic_nm);
              tempTopicArray.push(this.subjectWiseItemDetailsData.item_by_topic[q].No_of_Items);
            }

            this.itemsByTopicData = [
              { data: tempTopicArray, label: 'No.of Items' }
            ];

            this.TabSixDetailsTopic = true;

          } else if (this.subjectWiseItemDetailsData.item_by_topic.length == 0) {
            this.TabSixDetailsTopic = true;
          }

          // if(this.subjectWiseItemDetailsData.items_by_sub_topic.length != 0)
          // {
          this.itemsBySubTopicLabels = ['Author1', 'Author2', 'Author3', 'Author4'];
          this.itemsBySubTopicData = [];

          var Array1 = ['12', '44', '29', '21'];
          var Array2 = ['34'];
          var Array3 = ['44'];
          var Array4 = ['10'];

          // for(var w=0;w<this.subjectWiseItemDetailsData.items_by_sub_topic.length;w++)
          // {
          //   this.itemsBySubTopicLabels.push(this.subjectWiseItemDetailsData.items_by_sub_topic[w].SubTopic_Nm);
          //   // this.itemsBySubTopicData.push(this.subjectWiseItemDetailsData.items_by_sub_topic[w].No_of_Items)
          //   Array1.push(this.subjectWiseItemDetailsData.items_by_sub_topic[w].No_of_Items);
          // }

          this.itemsBySubTopicData = [
            { data: Array1, label: 'Author 1' },
            { data: Array2, label: 'Author 2' },
            { data: Array3, label: 'Author 3' },
            { data: Array4, label: 'Author 4' }
          ];

         // this.TabSixDetailsSubTopic = true;

          // }else if(this.subjectWiseItemDetailsData.items_by_sub_topic.length == 0){
          //   this.TabSixDetailsSubTopic = true;
          // }

          if (this.subjectWiseItemDetailsData.items_by_diff_lvl.length != 0) {
            this.itemsByDiffLevelLabels = [];
            this.itemsByDiffLevelData = [];

            for (var e = 0; e < this.subjectWiseItemDetailsData.items_by_diff_lvl.length; e++) {
              this.itemsByDiffLevelLabels.push(this.subjectWiseItemDetailsData.items_by_diff_lvl[e].diff_lvl_nm);
              this.itemsByDiffLevelData.push(this.subjectWiseItemDetailsData.items_by_diff_lvl[e].No_of_Items);
            }




            this.TabSixDetailsDiffLevel = true;

          } else if (this.subjectWiseItemDetailsData.items_by_diff_lvl.length == 0) {
            this.TabSixDetailsDiffLevel = true;
          }

          if (this.subjectWiseItemDetailsData.items_by_taxonomy.length != 0) {
            this.itemsByTaxonomyLabels = [];
            this.itemsByTaxonomyData = [];

            for (var r = 0; r < this.subjectWiseItemDetailsData.items_by_taxonomy.length; r++) {
              this.itemsByTaxonomyLabels.push(this.subjectWiseItemDetailsData.items_by_taxonomy[r].Taxonomy_Nm);
              this.itemsByTaxonomyData.push(this.subjectWiseItemDetailsData.items_by_taxonomy[r].No_of_Items);
            }
            this.TabSixDetailsTaxonomy = true;
          } else if (this.subjectWiseItemDetailsData.items_by_taxonomy.length == 0) {
            this.TabSixDetailsTaxonomy = true;
          }



        },
        error => {

          this.showload = false;
          if (error.status == 404) {
            // this.router.navigateByUrl('author/NotFound');
            this.SRChart = true;
            this.errMsgChart = "Oops! Chart Not Found";
          }
          else if (error.status == 401) {
            this.cookieService.deleteAll();
            window.location.href = credentials.accountUrl;
            // window.location.href='http://accounts.scora.in';
          }
          else {
            // this.router.navigateByUrl('author/serverError');
            this.SRChart = true;
            this.errMsgChart = "Oops! Something Went Wrong. Try Again Later";
          }

        }

      );
  }

  //Avila
  usersByStatus() {
    // old this.TabSixDetailsTopic = false;
    this.TabUserStatus = false;
    this.SRChart = false;

    this.showload = true;

    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));

    this.http.get(credentials.userdashboardHost + '/admin_user_by_status/' + this.cookieService.get('_PAOID'), { headers: headers })

      .map(res => res.json())
      .catch((e: any) => {
        return Observable.throw(e)
      })

      .subscribe(
        data => {
          this.showload = false;
          // this.subjectWiseItemDetailsData = data;
          this.userStatusDetailsData = data;
          console.log("userStatusDetailsData",this.userStatusDetailsData);

           if(this.userStatusDetailsData.length != 0)
           {
          this.authorUserStatusDetailsData =  this.userStatusDetailsData[0];
          this.testAdminUserStatusDetailsData = this.userStatusDetailsData[1];
          this.examinerUserStatusDetailsData = this.userStatusDetailsData[2];
          //this.itemsByTopicLabels = ['Examiners','Test Admin','Authors'];
          //  this.userStatusLabels = ['Examiners','Test Admin','Authors'];
          this.userStatusLabels = [];
          // this.itemsByTopicData = [];
          this.userStatusData = [];
          var tempTopicArray1 = [];
          var tempTopicArray2 = [];
          var tempTopicArray3 = [];

          for (var q = 0; q < this.userStatusDetailsData.length; q++) {
            if (this.userStatusDetailsData[q].role_name == 'Author') {
              this.userStatusLabels.push(this.userStatusDetailsData[q].role_name);

              tempTopicArray2.push(this.userStatusDetailsData[q].deleted_users);
              tempTopicArray3.push(this.userStatusDetailsData[q].retired_users);
              tempTopicArray1.push(this.userStatusDetailsData[q].active_users);
            }


            if (this.userStatusDetailsData[q].role_name == 'Test Admin') {
              this.userStatusLabels.push(this.userStatusDetailsData[q].role_name);

              tempTopicArray2.push(this.userStatusDetailsData[q].deleted_users);
              tempTopicArray3.push(this.userStatusDetailsData[q].retired_users);
              tempTopicArray1.push(this.userStatusDetailsData[q].active_users);
            }

            if (this.userStatusDetailsData[q].role_name == 'Examiner') {
              this.userStatusLabels.push(this.userStatusDetailsData[q].role_name);

              tempTopicArray2.push(this.userStatusDetailsData[q].deleted_users);
              tempTopicArray3.push(this.userStatusDetailsData[q].retired_users);
              tempTopicArray1.push(this.userStatusDetailsData[q].active_users);
            }
            //tempTopicArray1.push(this.subjectWiseItemDetailsData.item_by_topic[q].No_of_Items);
          }

          //  this.itemsByTopicData = [
          this.userStatusData = [
            { data: tempTopicArray2, label: 'Deleted' },
            { data: tempTopicArray3, label: 'Retired' },
            { data: tempTopicArray1, label: 'Active' }
          ];

          this.TabUserStatus = true;

            }
            else if(this.userStatusDetailsData.length == 0){
              this.TabUserStatus = true;
            }
        },
        error => {

          this.showload = false;
          if (error.status == 404) {

            this.SRChart = true;
            this.errMsgChart = "Oops! Chart Not Found";
          }
          else if (error.status == 401) {
            this.cookieService.deleteAll();
            window.location.href = credentials.accountUrl;

          }
          else {

            this.SRChart = true;
            this.errMsgChart = "Oops! Something Went Wrong. Try Again Later";
          }

        }

      );
  }

  participantsbystatus() {
    // old this.TabSixDetailsTopic = false;
    this.TabParticipantStatus = false;
    this.SRChart = false;

    this.showload = true;

    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));

    this.http.get(credentials.userdashboardHost + '/admin_participants_by_status/' + this.cookieService.get('_PAOID'), { headers: headers })

      .map(res => res.json())
      .catch((e: any) => {
        return Observable.throw(e)
      })

      .subscribe(
        data => {
          this.showload = false;
          // this.subjectWiseItemDetailsData = data;
          this.participantStatusDetailsData = data;
          console.log("participantStatusDetailsData",this.participantStatusDetailsData);

            if(this.participantStatusDetailsData.length != 0)
               {
           this.participantStatusGraphDetailsData = this.participantStatusDetailsData[0]      
          //this.itemsByTopicLabels = ['Examiners','Test Admin','Authors'];
          //  this.participantStatusLabels = ['Examiners','Test Admin','Authors'];
          this.participantStatusLabels = [];
          // this.itemsByTopicData = [];
          this.participantStatusData = [];
          var Array1 = [];
          var Array2 = [];
          var Array3 = [];

          for (var q = 0; q < this.participantStatusDetailsData.length; q++) {
            if (this.participantStatusDetailsData[q].role_name == 'Participant') {
              this.participantStatusLabels.push(this.participantStatusDetailsData[q].role_name);

              Array3.push(this.participantStatusDetailsData[q].deactivate_users);
              Array2.push(this.participantStatusDetailsData[q].debar_users);
              Array1.push(this.participantStatusDetailsData[q].active_users);
            }
            //tempTopicArray1.push(this.subjectWiseItemDetailsData.item_by_topic[q].No_of_Items);
          }

          //  this.itemsByTopicData = [
          this.participantStatusData = [
            { data: Array3, label: 'Deactivated' },
            { data: Array2, label: 'Debared' },
            { data: Array1, label: 'Active' }
          ];

          this.TabParticipantStatus = true;

            }
            else if(this.participantStatusDetailsData.length == 0){
              this.TabParticipantStatus = true;
            }
        },
        error => {

          this.showload = false;
          if (error.status == 404) {

            this.SRChart = true;
            this.errMsgChart = "Oops! Chart Not Found";
          }
          else if (error.status == 401) {
            this.cookieService.deleteAll();
            window.location.href = credentials.accountUrl;

          }
          else {

            this.SRChart = true;
            this.errMsgChart = "Oops! Something Went Wrong. Try Again Later";
          }

        }

      );
  }
  itemsByAuthors() {

    this.TabOneItemByAuthor = false;
    this.IAChart = false;

    this.showload = true;

    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));

    this.http.get(credentials.userdashboardHost+'/admin_item_by_author/'+this.cookieService.get('_PAOID'),{headers:headers})

    .map(res => res.json())
    .catch((e: any) =>{
      return Observable.throw(e)
    } )

    .subscribe(
    data => {
    this.showload = false;
    this.itemByAuthorsDetailsData = data;
    console.log("itemByAuthorsDetailsData",this.itemByAuthorsDetailsData);

     if(this.itemByAuthorsDetailsData.item_by_author.length != 0)
     {

    this.itemsByAuthorsLabels = [];
    this.itemsByAuthorsData = [];

    for(var w=0;w<this.itemByAuthorsDetailsData.item_by_author.length;w++)
    {
      this.itemsByAuthorsLabels.push(this.itemByAuthorsDetailsData.item_by_author[w].Tenant_user_nm);
       this.itemsByAuthorsData.push(this.itemByAuthorsDetailsData.item_by_author[w].No_of_items)
      //Array1.push(this.itemByAuthorsDetailsData.items_by_sub_topic[w].No_of_Items);
    }

    this.TabOneItemByAuthor = true;

     }else if(this.itemByAuthorsDetailsData.item_by_author.length == 0){
       this.TabOneItemByAuthor = true;
     }
    },
      error => {

        this.showload= false;
        if(error.status == 404){
          // this.router.navigateByUrl('author/NotFound');
          this.IAChart = true;
          this.errMsgChart ="Oops! Chart Not Found";
        }
        else if(error.status == 401){
          this.cookieService.deleteAll();
           window.location.href=credentials.accountUrl;
          // window.location.href='http://accounts.scora.in';
        }
        else{
          // this.router.navigateByUrl('author/serverError');
          this.IAChart = true;
          this.errMsgChart = "Oops! Something Went Wrong. Try Again Later";
        }

      }
      );
  }

  getItemBankdetails() {
    this.paChart2 = false;
    this.showload = true;
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));

    
    this.http.get(credentials.userdashboardHost + '/admin_item_bank/' + this.cookieService.get('_PAOID'), { headers: headers })
    
      .map(res => res.json())
      .catch((e: any) => {
        return Observable.throw(e)
      })
      .subscribe(
        data => {
          this.itembankdetails = data;
          console.log("itembankdetails",this.itembankdetails);
          this.showload = false;
          this.itembnk = true;

          this.itemBankbarChartLabelsTab2Two = [];
          this.itemBankbarChartData = [];
          var tempMaxChartData = [];

          for(var i=0;i<this.itembankdetails.item_by_month.length;i++)
          {
            this.itemBankbarChartLabelsTab2Two.push(this.itembankdetails.item_by_month[i].month);
             tempMaxChartData.push(this.itembankdetails.item_by_month[i].No_of_items);
          }
          
          this.itemBankbarChartData = [
            { data: tempMaxChartData }
          ];

        },
        error => {

          this.showload = false;
          if (error.status == 404) {
            // this.router.navigateByUrl('author/NotFound');
            this.paChart2 = true;
            this.errMsgChart = "Oops! Chart Not Found";
          }
          else if (error.status == 401) {
            this.cookieService.deleteAll();
            window.location.href = credentials.accountUrl;
            // window.location.href='http://accounts.scora.in';
          }
          else {
            // this.router.navigateByUrl('author/serverError');
            this.paChart2 = true;
            this.errMsgChart = "Oops! Something Went Wrong. Try Again Later";
          }

        }


      );
  }

  getTestDelivered() {
    this.barChart2 = false;
    this.showload = true;
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));

    this.http.get('http://15.207.209.163/new-scora/scoraauthor/public/api' + '/admin_delivered_test/' + this.cookieService.get('_PAOID'), { headers: headers })

      .map(res => res.json())
      .catch((e: any) => {
        return Observable.throw(e)
      })
      .subscribe(
        data => {
          this.testdelivereddetails = data;
          console.log("testdelivereddetails",this.testdelivereddetails);
          this.showload = false;
          this.testdlvr = true;

          this.testdeliveredbarChartLabels = [];
          this.testdeliveredbarChartData = [];
          var tempChartData = [];

          for(var i=0;i<this.testdelivereddetails.length;i++)
          {
            this.testdeliveredbarChartLabels.push(this.testdelivereddetails[i].Month);
             tempChartData.push(this.testdelivereddetails[i].No_Attempts_Delivered);
          }
          
          this.testdeliveredbarChartData = [
            { data: tempChartData }
          ];

        },
        error => {

          this.showload = false;
          if (error.status == 404) {
            // this.router.navigateByUrl('author/NotFound');
            this.barChart2 = true;
            this.errMsgChart = "Oops! Chart Not Found";
          }
          else if (error.status == 401) {
            this.cookieService.deleteAll();
            window.location.href = credentials.accountUrl;
            // window.location.href='http://accounts.scora.in';
          }
          else {
            // this.router.navigateByUrl('author/serverError');
            this.barChart2 = true;
            this.errMsgChart = "Oops! Something Went Wrong. Try Again Later";
          }

        }


      );
  }

  getupcomingTests() {
    this.barChart1 = false;
    this.showload = true;
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));

    // this.http.get(credentials.userdashboardHost + '/admin_upcoming_test/' + this.cookieService.get('_PAOID'), { headers: headers })
    this.http.get('http://15.207.209.163/new-scora/scoraauthor/public/api' + '/admin_upcoming_test/' + this.cookieService.get('_PAOID'), { headers: headers })
      .map(res => res.json())
      .catch((e: any) => {
        return Observable.throw(e)
      })
      .subscribe(
        data => {
          this.upcomingtestdetails = data;
          console.log("upcomingtestdetails",this.upcomingtestdetails);
          this.showload = false;
          this.upcmgtst = true;

          this.upcomingtestbarChartLabels = [];
          this.upcomingtestbarChartData = [];
          var tempupcomingtestChartData = [];

          for(var i=0;i<this.upcomingtestdetails.length;i++)
          {
            this.upcomingtestbarChartLabels.push(this.upcomingtestdetails[i].Month);
            tempupcomingtestChartData.push(this.upcomingtestdetails[i].No_Attempts);
            //this.upcomingtestbarChartData.push(this.upcomingtestdetails[i].No_Attempts);
          }
          
           this.upcomingtestbarChartData = [
             { data: tempupcomingtestChartData, label: 'month'}
           ];

        },
        error => {

          this.showload = false;
          if (error.status == 404) {
            // this.router.navigateByUrl('author/NotFound');
            this.barChart1 = true;
            this.errMsgChart = "Oops! Chart Not Found";
          }
          else if (error.status == 401) {
            this.cookieService.deleteAll();
            window.location.href = credentials.accountUrl;
            // window.location.href='http://accounts.scora.in';
          }
          else {
            // this.router.navigateByUrl('author/serverError');
            this.barChart1 = true;
            this.errMsgChart = "Oops! Something Went Wrong. Try Again Later";
          }

        }


      );
  }

  openchartmodal(template: TemplateRef<any>, title) {
    this.chartTitle = title;
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: ' modal-lg' }, this.config));
  }

  cancelPOpup() {
    this.modalRef.hide();
    this.chartTitle = '';
  }

}
