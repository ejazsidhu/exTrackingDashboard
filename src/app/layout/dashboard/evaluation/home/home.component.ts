import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EvaluationService } from '../evaluation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ResizeEvent } from 'angular-resizable-element';
import { config } from 'src/assets/config';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  data: any = [];
  // ip = environment.ip;
  configFile = config;

  ip: any = this.configFile.ip;
  loading = false;
  selectedShop: any = {};

  @ViewChild('childModal') childModal: ModalDirective;
  @ViewChild('remarksModal') remarksModal: ModalDirective;
  @ViewChild('sosModal') sosModal: ModalDirective;



  score: any = 0;

  indexList: any = [];
  surveyId: any = 0;
  remarksList: any = [];
  selectedRemarks: any = false;
  selectedRemarksList: any = [];
  selectedCriteria: any = {};
  evaluationArray: any = [];
  productList: any = [];
  msl: any;
  availabilityCount: number;
  cloneArray: any = [];
  isFromShop = true;
  rotationDegree = 0;
  isEditable: any = false;
  selectedIndex = -1;
  criteriaDesireScore: any = 0;
  totalAchieveScore = 0;
  MSLCount: number;
  isCritical = true;
  isNoNCritical = false;
  isDragging = false;
  selectedSoS: any ={};
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private activatedRoutes: ActivatedRoute,
    private httpService: EvaluationService,
    private evaluationService: EvaluationService,

  ) {
    this.surveyId;

    this.activatedRoutes.queryParams.subscribe(q => {
      if (q.location) { this.isFromShop = false; }
    });
    this.activatedRoutes.params.subscribe(params => {
      this.surveyId = params.id;

      const obj = {
        surveyId: this.surveyId,
        userTypeId: localStorage.getItem('user_type')
        // userId:localStorage.getItem('user_id')
      };

      this.getData(obj);
    });
  }
  value = 5;
  options: any = {
    showTicksValues: true,
    stepsArray: [
      { value: 1 },

    ]
  };

  createTickForSlider(maxTicks) {
    const result:any = [];

   for (let index = 0; index < maxTicks.score; index++) {
     result.push({value:index});

   }
    this.options.stepsArray = result;
  }

  ngOnInit() {
    this.availabilityCount = 0;
  }
  formatLabel(value: number | null) {
    if (!value) {
      return 0;
    }

    if (value >= 1000) {
      return Math.round(value / 1000);
    }

    return value;
  }

  onResizeEnd(event: ResizeEvent): void {
    // console.log('Element was resized', event);
    this.isDragging = !this.isDragging;
  }

  rotateImage() {
    if (this.rotationDegree === 360) {
      this.rotationDegree = 90;
    } else {
      this.rotationDegree += 90;
    }
  }
  getData(obj) {
    this.httpService.getShopDetails(obj).subscribe(
      data => {
        if (data) {
          this.data = data;

          document.title = this.data.section[0].sectionTitle;
          if (this.data.criteria) {
            this.evaluationArray = this.data.criteria;
            this.cloneArray = this.evaluationArray.slice();
            this.totalAchieveScore = this.getTotalAchieveScore();
          }

          // console.log(this.data)
          this.remarksList = this.data.remarks;
          this.productList = this.data.productList;

          localStorage.setItem('productList', JSON.stringify(this.productList));
          this.msl = this.data.msl;
          this.isEditable = this.data.isEditable || this.isEditable;
          if (this.productList.length > 0) { this.availabilityCount = Math.round(this.getMSLNAvailbilityCount(this.productList)); } // Math.round(this.getAvailabilityCount(this.productList));
          if (this.data.criteria) { this.calculateScore(); }
        }
      },
      error => {}
    );
  }

  calculateMSLAgain(products) {
    this.msl = this.data.msl;
    localStorage.setItem('productList', JSON.stringify(products));
    this.productList = localStorage.getItem('productList');

    this.availabilityCount = Math.round(this.getMSLNAvailbilityCount(products)); // Math.round(this.getAvailabilityCount(products));
  }

  getMSLNAvailbilityCount(products) {
    const pro = [];
    const msl = [];
    products.forEach(p => {
      let obj = {};
      if (p.MSL === 'Yes' && p.available_sku === 1) {
        obj = {
          available_sku: p.available_sku,
          MSL: p.MSL
        };
        pro.push(obj);
      }

      if (p.MSL === 'Yes') {
        msl.push(p);
      }
    });
    this.MSLCount = msl.length;

    const MSLScore = (pro.length / this.MSLCount) * 10;
    return MSLScore;
  }
  getAvailabilityCount(products) {
    if (!products) {
      products = localStorage.getItem('productList');
    }
    const pro = products.map(p => p.available_sku);
    const sum = pro.reduce((a, v) => a + v);
    return (sum / pro.length) * this.msl;
  }

  getCriteriaWithRemarks(remarks, criteria) {
    const obj = {
      remarkId: remarks,
      id: criteria.id,
      title: criteria.title,
      score: criteria.score,
      criteriaMapId: criteria.criteriaMapId,
      // achievedScore: (criteria.isEditable)? (this.criteriaDesireScore==criteria.score)?0:this.criteriaDesireScore : 0,

      achievedScore: criteria.isEditable ? this.criteriaDesireScore : 0,
      isEditable: criteria.isEditable,
      isChecked: 1
    };
    this.cloneArray.forEach(element => {
      const i = this.cloneArray.findIndex(e => e.id === criteria.id);
      this.cloneArray.splice(i, 1, obj);
    });
    // this.subtractScore(this.selectedCriteria);
    // this.evaluationArray.push(obj);
    console.log('evaluation array clone', this.cloneArray);
    // this.updateAchieveScore(criteria.id);
    this.hideRemarksModal();
    this.selectedRemarks = '';
    this.selectedRemarksList = [];
    this.criteriaDesireScore = 0;
  }

  checkboxChange(event, id) {
    console.log('checkbox event', !event.checked, id);

    if (!event.checked) {
      this.selectedRemarksList.push(id);
    } else {
      for (let i = 0; i < this.selectedRemarksList.length; i++) {
        if (this.selectedRemarksList[i] === id) {
          this.selectedRemarksList.splice(i, 1);
        }
      }
    }
    // this.selectedRemarksList.pop(id)

    console.log('remarks list', this.selectedRemarksList);
  }

  updateAchieveScore(id) {
    for (let index = 0; index < this.cloneArray.length; index++) {
      const element = this.cloneArray[index];
      const aScore = element.achievedScore;

      if (element.id === id) {
        this.cloneArray[index].achievedScore = this.criteriaDesireScore > 0 ? this.criteriaDesireScore : aScore;
      }
    }
    this.totalAchieveScore = this.getTotalAchieveScore();
  }

  getTotalAchieveScore() {
    let score = 0;
    this.cloneArray.forEach(element => {
      if (element.achievedScore >= 0 && element.id !== 5) {
        score = score + element.achievedScore;
      }
    });

    return score;
  }

  subtractScore(criteria) {
    this.totalAchieveScore =
      this.criteriaDesireScore > 0
        ? this.totalAchieveScore - Math.abs(criteria.score - this.criteriaDesireScore)
        : this.totalAchieveScore - Math.abs(criteria.achievedScore);
  }

  isAnyCriteriaCheck() {
    let result = false;
    this.cloneArray.forEach(element => {
      if (element.isChecked) {
        result = true;
      }
    });

    return result;
  }

  counter(event, criteria, index) {

    this.selectedIndex = index;
    // console.dir(event.checked)
    if (event.checked) {
      if (criteria.id === 14) {
        this.isCritical = false;
      } else {
        this.isNoNCritical = true;
        this.isCritical = true;
      }
      // this.score=this.score-Math.abs(criteria.score);
      // this.updateAchieveScore(criteria.id);
      // this.totalAchieveScore=this.getTotalAchieveScore()

      // this.totalAchieveScore =
      //   this.criteriaDesireScore > 0
      //     ? this.totalAchieveScore - Math.abs(this.criteriaDesireScore)
      //     : this.totalAchieveScore - Math.abs(criteria.achievedScore);
      this.indexList.push(index);
      this.updateAchieveScore(criteria.id);

      this.selectedCriteria = criteria;
      if (!criteria.isEditable) {
        this.subtractScore(this.selectedCriteria);
      }
      this.showRemarksModal();
    } else {
      this.totalAchieveScore = this.totalAchieveScore + Math.abs(criteria.score);

      const i = this.indexList.indexOf(index);
      this.indexList.splice(i, 1);

      if (this.evaluationArray.length > 0) {
        const obj = {
          remarkId: [],
          id: criteria.id,
          title: criteria.title,
          score: criteria.score,
          criteriaMapId: criteria.criteriaMapId,
          achievedScore: criteria.score > criteria.achievedScore || criteria.score < 0 ? criteria.score : criteria.achievedScore,
          isEditable: criteria.isEditable,
          isChecked: 0
        };
        const e = this.evaluationArray.findIndex(i => i.id === criteria.id);
        this.cloneArray.splice(e, 1, obj);
        console.log('unchecked evaluation array', this.cloneArray);
        this.selectedRemarksList = [];
        this.updateAchieveScore(criteria.id);
        this.checkForCritical(criteria);
      }
    }
  }

  cancelCriteriaSelection() {
    const inputs: any = document.querySelectorAll('.checkbox');
    for (let j = 0; j < inputs.length; j++) {
      if (this.selectedCriteria.id === inputs[j].id) {
        inputs[j].checked = false;
      }
    }
    const criteria = this.selectedCriteria;
    this.totalAchieveScore = this.totalAchieveScore + Math.abs(criteria.score);
    const i = this.indexList.indexOf(this.selectedIndex);
    this.indexList.splice(i, 1);

    if (this.evaluationArray.length > 0) {
      const obj = {
        remarkId: [],
        id: criteria.id,
        title: criteria.title,
        score: criteria.score,
        criteriaMapId: criteria.criteriaMapId,
        achievedScore: criteria.score > criteria.achievedScore ? criteria.score : criteria.achievedScore,
        isEditable: criteria.isEditable,
        isChecked: 0
      };
      const e = this.evaluationArray.findIndex(i => i.id === criteria.id);
      this.cloneArray.splice(e, 1, obj);
      console.log('unchecked evaluation array,using cancel button', this.cloneArray);
    }

    this.checkForCritical(criteria);

    this.hideRemarkModalForCancelOption();
  }
  checkForCritical(criteria) {
    if (criteria.id === 14) {
      this.isCritical = true;
      this.isNoNCritical = false;
    } else {
      const result = this.isAnyCriteriaCheck();
      if (!result) {
        this.isNoNCritical = false;
      }
      this.isCritical = true;
    }
  }
  calculateScore() {
    this.score;
    this.data.criteria.map(c => {
      if (c.score > 0) {
        this.score += c.score;
      }
    });
    // this.score=this.score-(this.msl);

    console.log('total score is', this.score);
  }

  // makeScoreZero(){
  //   let result=[];
  //   this.cloneArray.forEach(element => {

  //     if()

  //   });
  // }
  evaluateShop() {
    const user_id = localStorage.getItem('user_id');
    this.loading = true;
    const req = true;
    // if(this.selectedRemarks==0 || this.selectedRemarks==false || this.selectedRemarks==''){
    //   this.toastr.info(`please select remarks for ALL selected criteria`);
    //   this.loading=false;
    //   req=false;
    // }
    // this.cloneArray.forEach(element => {

    //     if (element.remarkId=='' || element.remarkId==false) {
    //       this.toastr.info(`please select remarks for "${element.title}"`);
    //       req=false;
    //       this.loading=false;
    //     }

    //   });
    // this.evaluationArray.forEach(element => {
    //   if(this.selectedRemarks==0 || this.selectedRemarks==false || this.selectedRemarks==''){
    //     if (element.remarkId=='' || element.remarkId==false) {
    //       this.toastr.info(`please select remarks for "${element.title}"`);
    //       req=false;
    //       this.loading=false;
    //     }

    //   }});

    if (req) {
      const pl = JSON.parse(localStorage.getItem('productList'));
      this.getAvailabilityCount(pl);
      const obj = {
        criteria: this.cloneArray,
        surveyId: this.surveyId,
        evaluatorId: user_id,
        msl: Math.round(this.availabilityCount),
        status: this.checkForSlectedRemarks(this.cloneArray)
      };

      this.evaluationService.evaluateShop(obj).subscribe(
        (data: any) => {
          // console.log('evaluated shop data',data);
          this.loading = false;

          if (data.success) {
            this.toastr.success('shop evaluated successfully ');
            this.evaluationArray = [];
            this.cloneArray = [];
            this.indexList = [];
            setTimeout(() => {
              window.close();
            }, 2000);
          } else {
            this.toastr.info(data.errorMessage, 'Info');
          }
        },
        error => {
          // console.log('evaluated shop error',error)
          // window.close()
          this.loading = false;
          this.toastr.error(error.message, 'Error');
        }
      );
    }
  }



  checkForSlectedRemarks(list) {
    let result = 1;
    list.forEach(element => {
      if (element.remarkId && element.remarkId.length > 0) {
      result = 2;
      }

    });


    return result;

  }
  updateSoS() {

    if (this.selectedSoS.total_com_height <= 0) {
    this.toastr.warning('Height must be greater than zero.');
    } else {
    this.hideSoSModal();
    }


    const obj = {
      userId: parseInt(localStorage.getItem('user_id')),
      width: parseInt(this.selectedSoS.total_width),
      com_width: parseInt(this.selectedSoS.total_com_width),
      merchandiserId: parseInt(this.selectedSoS.merchandiser_survey_id)
    };

    console.log('final SoS object', obj  );
    this.httpService.updateSOS(obj).subscribe((data: any) => {
      if (data.success) {
        this.toastr.info('SOS width is updated');

      }
// alert(data)
    }, error => {
      // alert(error)
    }
    );
  }

  showChildModal(shop): void {
    this.selectedShop = shop;
    this.rotationDegree = 0;
    this.childModal.show();
  }

  hideChildModal(): void {
    this.childModal.hide();
  }

  showSoSModal(item): void {
  console.log('output item', item);
  this.selectedSoS = item;
    this.sosModal.show();
  }

  hideSoSModal(): void {
    this.sosModal.hide();
  }

  showRemarksModal() {
    this.criteriaDesireScore = 0; // this.selectedCriteria.achievedScore;
    this.remarksModal.show();
  }

  hideRemarkModalForCancelOption() {
    if (this.selectedCriteria.isEditable) {
      this.subtractScore(this.selectedCriteria);
    }

    // this.updateAchieveScore(this.selectedCriteria.id)
    this.remarksModal.hide();
  }
  hideRemarksModal() {
    if (this.selectedCriteria.isEditable) {
      this.subtractScore(this.selectedCriteria);
    }

    // this.updateAchieveScore(this.selectedCriteria.id)
    // if(this.selectedRemarksList.length>0)
    this.remarksModal.hide();
    // else{
    //   this.toastr.info(`please select remarks for "${this.selectedCriteria.title}"`)
    // }
  }
}
