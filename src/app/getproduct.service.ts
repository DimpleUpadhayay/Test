import { Injectable } from '@angular/core';
import{ HttpClient } from '@angular/common/http';

interface products
{
    'id':string;
    'size':number;
    'price':string;
    'face':string;
    'date':string;
}


@Injectable({
  providedIn: 'root'
})
export class GetproductService {
  constructor(private httpobj:HttpClient) { }
  
  getProducts()
	{
   return this.httpobj.get<products[]>('http://localhost:3000/api/products');
      
   }
   sortProduct(params) {
    return this.httpobj.get<products[]>('http://localhost:3000/api/products',{params});
  }
  
  getPage(params) {
    return this.httpobj.get<products[]>('http://localhost:3000/api/products',{params});
  }


}
