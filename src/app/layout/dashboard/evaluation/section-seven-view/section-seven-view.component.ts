import { Component, OnInit, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import { config } from 'src/assets/config';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EvaluationService } from '../evaluation.service';

@Component({
  selector: 'section-seven-view',
  templateUrl: './section-seven-view.component.html',
  styleUrls: ['./section-seven-view.component.scss']
})
export class SectionSevenViewComponent implements OnInit {

  @Input('data') data;
  // @ViewChild('childModal') childModal: ModalDirective;
  @Output('showModal') showModal:any=new EventEmitter<any>()
  @Input('isEditable') isEditable :any;
  @Output('productList') productForEmit:any=new EventEmitter<any>();
  selectedShop: any = {};
  selectedImage: any = {};
  // ip=environment.ip;
  configFile = config;

  ip: any = this.configFile.ip;
  hover = 'hover';
  zoomOptions = {
    Mode: 'hover'
  };
  zoomedImage = 'https://image.shutterstock.com/image-photo/micro-peacock-feather-hd-imagebest-260nw-1127238569.jpg';
  products: any;
  availability: any;
  changeColor: boolean;
  updatingMSL: boolean;
  colorUpdateList: any=[];
  surveyId: any;
  evaluatorId:any;
  MSLCount: number=0;
  MSLNAvailabilityCount: number;


  constructor(private router:Router,private toastr:ToastrService,private httpService:EvaluationService) { }

  ngOnInit() {
    var arr=this.router.url.split('/');
    this.surveyId=+arr[arr.length-1];
    this.evaluatorId = localStorage.getItem("user_id");
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes.data.currentValue) {
      this.data = changes.data.currentValue;
      this.selectedImage = this.data.imageList[0];
      this.products=this.data.mslTable;
      if(this.products.length>0)
      this.availability=this.getAvailabilityCount(this.products);
      console.log('is editable',this.isEditable)
      this.MSLNAvailabilityCount=this.getMSLNAvailbilityCount(this.products)
    }


  }

  setSelectedImage(img) {
    this.selectedImage = img;

  }


  getAvailabilityCount(products)
  {
    let sum=[]
    products.forEach(element => {
      if(element.available_sku==1)
      sum.push(element)
      
    });
    return sum.length;
  }
  getMSLNAvailbilityCount(products)
  {
    let pro=[];
    let msl=[];
    products.forEach(p=>{
      let obj={};
     if(p.MSL=='Yes'  && p.available_sku==1 ){
       obj={
         available_sku:p.available_sku,
         MSL:p.MSL
       }
       pro.push(obj)

     }

     if(p.MSL=='Yes'){
       msl.push(p)
     }
      
   })
  this.MSLCount=msl.length;
    return  pro.length;
  }

  updateString(value){
    return value?'Yes':'No';
  }

  toggleValue(value){
    if(this.isEditable){
      this.changeColor=true;
      this.updatingMSL=true
     
      this.colorUpdateList.push(value.id)
      let obj={
        msdId:value.id,
        unitAvailable:!!value.available_sku? 0:1,
        surveyId:this.surveyId,
        evaluatorId:this.evaluatorId
      }
      // return value?'YES':'NO';
  
  this.httpService.updateMSLStatus(obj).subscribe((data:any)=>{
    if(data.success){
      // this.products=data.productList;
      let key=data.msdId;
      this.products.forEach(e => {
  
      // for (const key of this.colorUpdateList) {
        if(key==e.id){
          var i=this.products.findIndex(p=>p.id==key);
          let obj={
            id:e.id,
            available_sku:(e.available_sku==0)?e.available_sku= 1:e.available_sku =0,
            MSL:e.MSL,
            product_title:e.product_title,
            category_title:e.category_title,
            color:'red'
          };
    
          this.products.splice(i,1,obj);

          // console.log(this.products[i])
        }
        localStorage.setItem('productList',JSON.stringify(this.products))

     
        
      
      // }
   
      this.availability=this.getAvailabilityCount(this.products)
      this.MSLNAvailabilityCount=this.getMSLNAvailbilityCount(this.products)
  
             
      });
  
      this.productForEmit.emit(this.products);
      // this.toastr.success('Status updated successfully.','Update MSL');
      this.updatingMSL=false;
  
  
    }
    else{
      this.toastr.error(data.message,'Update MSL')
    }
  })
  
    }
   
  }

  showChildModal(shop): void {
    this.selectedShop = shop;
    this.showModal.emit(this.selectedShop);
    // this.childModal.show();
  }

}
