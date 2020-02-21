import { Component, OnInit, ViewChild, ViewChildren, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { EvaluationService } from '../../evaluation.service';
import { environment } from 'src/environments/environment';
import { ModalDirective } from 'ngx-bootstrap';
import { logger } from 'codelyzer/util/logger';
import { MatCheckbox } from '@angular/material';
import { config } from 'src/assets/config';

@Component({
  selector: 'app-section-home',
  templateUrl: './section-home.component.html',
  styleUrls: ['./section-home.component.scss']
})
export class SectionHomeComponent implements OnInit {
  data: any = [];
  // ip = environment.ip;
  configFile = config;
  ip: any = this.configFile.ip;
  loading = false;
  selectedShop: any = {};

  @ViewChild('childModal') childModal: ModalDirective;
  @ViewChild('remarksModal') remarksModal: ModalDirective;
  @ViewChildren('checkStatus') private myCheckbox: any;


  score: any = 0;
  remarks: any = [];
  indexList: any = [];
  surveyId: any = 0;
  visitType: any = '';
  remarksList: any = [];
  selectedRemarks: any = false;
  selectedCriteria: any = 0;
  evaluationArray: any = [];
  productList: any = [];
  msl: any;
  availabilityCount: number;
  totalAchieved: number;
  cloneArray: any = [];
  isFromShop = true;
  rotationDegree = 0;
  isEditable: any = false;
  evaluationCriteria: any = [];
  status: string;
  selectedIndex = -1;
  totalAchieveScore = 0;
  criteriaDesireScore: any = 0;
  evaluation_score: any;
  shopStatus: any;

  constructor(private toastr: ToastrService, private activatedRoutes: ActivatedRoute, private httpService: EvaluationService) {
    this.surveyId;
    this.visitType;
    this.httpService.ip;
    this.activatedRoutes.queryParams.subscribe(q => {
      if (q.location === 'shop') {
        this.isFromShop = false;
      }
    });
    this.activatedRoutes.params.subscribe(params => {
      this.surveyId = params.id;
      this.visitType = params.visitType;
      if (this.visitType == null || this.visitType === '') {
        this.visitType = '';
      }
      // console.log(params);
      const obj = {
        merchandiserShopId: this.surveyId,
        visitType: this.visitType,
        userTypeId: localStorage.getItem('user_type'),
        userId: localStorage.getItem('user_id'),

        // userTypeId: localStorage.getItem('user_type')
      };

      this.getData(obj);
    });
  }

  ngOnInit() {
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


          // document.title = this.data.section[0].sectionTitle;
          if (this.data.criteria) {
            this.evaluationArray = this.data.criteria;
            this.shopStatus = this.data.shopStatus;
            this.selectedCriteria = this.data.criteria[0].id;
            this.cloneArray = this.evaluationArray.slice();
            this.calculateScore();
            this.calculateAchievedScore();
          }

          this.remarksList = this.data.remarks;
          this.productList = this.data.productList;

          localStorage.setItem('productList', JSON.stringify(this.productList));
        }
      },
      error => { }
    );
  }
  calculateAchievedScore() {
    if (this.data.criteria) {
      this.data.criteria.map(c => {
        this.totalAchieveScore += c.achievedScore;
      });
    }
  }

  calculateMSLAgain(products) {
    this.msl = this.data.msl;
    localStorage.setItem('productList', JSON.stringify(products));
    this.productList = localStorage.getItem('productList');

    this.availabilityCount = this.getAvailabilityCount(products);
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
      score: 0
    };
    this.cloneArray.forEach(element => {
      const i = this.cloneArray.findIndex(e => e.id === criteria.id);
      this.cloneArray.splice(i, 1, obj);
    });

    // this.evaluationArray.push(obj);
    // console.log('evaluation array clone', this.cloneArray);
    // this.hideRemarksModal();
    this.selectedRemarks = '';
  }

  counter(event, criteria, index) {
    this.selectedIndex = index;
    // console.dir(event.checked)
    if (event.checked) {
      for (let index = 0; index < this.cloneArray.length; index++) {
        if (this.cloneArray[index].id === criteria.id) {
          const element = this.cloneArray[index];
          this.totalAchieveScore = this.totalAchieveScore - element.achievedScore;
          element.achievedScore = 0;
          for (let index = 0; index < this.myCheckbox._results.length; index++) {
            if (this.myCheckbox._results[index].name === this.selectedCriteria.title) {
              this.myCheckbox._results[index]._checked = false;
            }
          }
        }
      }
      this.indexList.push(index);
      this.selectedCriteria = criteria;
      // this.totalAchieveScore = this.totalAchieveScore + criteria.achievedScore;
      this.showRemarksModal();
    }

    if (!event.checked) {
      for (let index = 0; index < this.cloneArray.length; index++) {
        if (this.cloneArray[index].id === criteria.id) {
          const element = this.cloneArray[index];
          this.totalAchieveScore = this.totalAchieveScore - element.achievedScore;
          element.achievedScore = 0;
          this.cloneArray[index] = element;
          this.cloneArray[index].remarks = [];
          console.log(this.myCheckbox);
          for (let index = 0; index < this.myCheckbox._results.length; index++) {
            if (this.myCheckbox._results[index].name === this.selectedCriteria.title) {
              this.myCheckbox._results[index]._checked = false;
            }



          }

          //     this.myCheckbox.checked = false;

        }
      }
    }
  }

  remarksCounter(remarks, checkStatus, selectedCriteria) {
    // console.log(remarks, !checkStatus.checked, selectedCriteria);
    for (let index = 0; index < this.cloneArray.length; index++) {
      if (this.cloneArray[index].id === selectedCriteria.id) {
        if (!checkStatus.checked) {
          const element = this.cloneArray[index];
          element.achievedScore = element.achievedScore + remarks.score;
          this.totalAchieveScore = this.totalAchieveScore + remarks.score;
          element.remarks == null ? ((element.remarks = []), element.remarks.push(remarks)) : element.remarks.push(remarks);
          this.cloneArray[index] = element;
          // console.log(this.cloneArray[element.id].achievedScore);
        } else {
          const element = this.cloneArray[index];
          element.achievedScore = element.achievedScore - remarks.score;
          this.totalAchieveScore = this.totalAchieveScore - remarks.score;
          this.cloneArray[index] = element;
          const el = element.remarks.indexOf(remarks);
          if (el > -1) {
            element.remarks.splice(el, 1);
          }
          // // element.remarks.pop(remarks)
          // console.log("remarks",element.remarks);
        }
      }
    }
  }

  deductScore(score) { }

  calculateScore() {
    this.score;
    this.data.criteria.map(c => {
      if (c.id !== 6) {
        this.score += c.score;
      }
    });
    // this.score=this.score-(this.msl);

    // console.log('total score is', this.score);
  }

  showChildModal(shop): void {
    this.selectedShop = shop;
    this.rotationDegree = 0;
    this.childModal.show();
  }

  hideChildModal(): void {
    this.childModal.hide();
  }

  evaluateShop() {
    this.loading = true;
    const obj = {
      criteria: this.cloneArray,
      surveyId: this.surveyId,
      evaluatorId: localStorage.getItem('user_id'),
      totalScore: this.totalAchieveScore,
      isEvaluated: this.shopStatus
    };
    // console.log('selected criteria', obj);
    this.httpService.evaluateShop(obj).subscribe(
      (data: any) => {
        // console.log('evaluated shop data',data);
        this.loading = false;

        if (data.status) {
          this.toastr.success(data.message, 'Stauts');

          setTimeout(() => {
            window.close();
          }, 2000);
        } else {
          this.toastr.error(data.message, 'Stauts');
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

  showRemarksModal() {
    this.remarksModal.show();
  }
  hideRemarksModal() {
    // if (!!this.selectedRemarks) {
    this.remarksModal.hide();
    // } else {
    //   this.toastr.info(`please select remarks for "${this.selectedCriteria.title}"`);
    // }
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
      // console.log('unchecked evaluation array,using cancel button', this.cloneArray);
    }

    // this.checkForCritical(criteria);

    this.hideRemarkModalForCancelOption();
  }

  hideRemarkModalForCancelOption() {
    this.hideRemarksModal();
    if (this.selectedCriteria.isEditable) {
      this.subtractScore(this.selectedCriteria);
    }
  }

  subtractScore(criteria) {
    this.totalAchieveScore =
      this.criteriaDesireScore > 0
        ? this.totalAchieveScore - Math.abs(criteria.score - this.criteriaDesireScore)
        : this.totalAchieveScore - Math.abs(criteria.achievedScore);
  }
}
