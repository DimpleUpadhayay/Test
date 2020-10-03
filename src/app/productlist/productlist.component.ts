import { Component, NgZone, OnInit } from '@angular/core';
import { GetproductService } from '../getproduct.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpParams } from '@angular/common/http';
@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.scss']
})
export class ProductlistComponent implements OnInit {
  sortType = ['id', 'size', 'price'];
  selectedValue = 'price'
  productDetails: any
  date;
  ispageActive: boolean;
  p: any = 1;
  itemsPerPage: any = 15;
  total: number;
  isPageLength: boolean = false;
  statusText: boolean = false;
  temArr: any;
  public loading = false;
  constructor(private GetProductService: GetproductService, lc: NgZone) {
    window.onscroll = () => {
      let d = document.documentElement;
      let offset = d.scrollTop + window.innerHeight + 5;
      let height = d.offsetHeight;
      if (offset >= height) {
        this.statusText = true;
        if (this.statusText === true) {

          this.temArr.forEach(element => {
            let date1 = element.date;
            let test = new Date(date1);
            var timestamp = Date.parse(date1);
            if (isNaN(timestamp) == false) {//CHECK DATE IS VAILD
              element.date = this.getChangeDate(test.toISOString());
            }
          });


          //CHECK EVERY 5 NEW RECORDS
          if (this.productDetails.length < this.temArr.length) {
            let len = this.productDetails.length;
            for (let i = len; i < len + 5; i++) {
              this.productDetails.push(this.temArr[i]);
            }
          }

          //GET COUNT FOR PAGAINATIO
          this.GetProductService.getProducts().subscribe((result) => {
            this.total = result.length;
          });

        }

      }
    };

  }

  ngOnInit(): void {
    this.getProductsOnLoadAndOnPageChange(this.p);
  }
 //change the formate of date comman function
  dateFormate() {
    this.productDetails.forEach(element => {
      let date = element.date;
      let test = new Date(date);
      element.date = this.getChangeDate(test.toISOString());
    });
  }
//load data
  getProductsOnLoadAndOnPageChange(currentPageNo) {
    this.loading = true;
    this.p = currentPageNo;
    const params = new HttpParams({
      fromObject: {
        _page: this.p,
        _limit: this.itemsPerPage
      }
    });
  //Api Call
    this.GetProductService.getPage(params).subscribe((result) => {
      this.loading = false;
      this.productDetails = result;
      this.temArr = result.slice(0, 15);
      this.productDetails = result.slice(0, 5);
      this.dateFormate();
    });


  }
  //date Foramte main function
  getChangeDate(addedDate) {
    const oneSecond = 1000;
    const oneMinute = 60 * oneSecond;
    const oneHour = 60 * oneMinute;
    const oneDay = 24 * oneHour;
    const oneWeek = 7 * oneDay;
    const diffTime = +new Date() - +new Date(addedDate);
    if (diffTime < oneMinute) {
      const timeAgo = Math.floor(diffTime / oneSecond);
      return `${timeAgo} ${timeAgo > 1 ? 'seconds' : 'second'} ago`;
    } else if (diffTime < oneHour) {
      const timeAgo = Math.floor(diffTime / oneMinute);
      return `${timeAgo} ${timeAgo > 1 ? 'minutes' : 'minute'} ago`;
    } else if (diffTime < oneDay) {
      const timeAgo = Math.floor(diffTime / oneHour);
      return `${timeAgo} ${timeAgo > 1 ? 'hours' : 'hour'} ago`;
    } else if (diffTime <= oneWeek) {
      const timeAgo = Math.floor(diffTime / oneDay);
      return `${timeAgo} ${timeAgo > 1 ? 'days' : 'day'} ago`;
    } else {
      return `${new Date(addedDate).toLocaleString()}`;
    }
  }
//sorting product by id,size,price
  sortBy(event) {
    this.loading=true;
    const params = new HttpParams({
      fromObject: {
        _sort: event,
        _page: this.p,
        _limit: this.itemsPerPage

      }
    });
    //Api Call for sortproduct
    this.GetProductService.sortProduct(params).subscribe((res) => {
      this.loading = false;
      if (res) {
        this.productDetails = res;
        this.dateFormate();
      }
   
    });
   
  }

}
