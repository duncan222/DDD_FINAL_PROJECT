import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { BrowserModule } from '@angular/platform-browser';
import { AuthService } from '../../services/auth.service';

interface Credit {
  cardNumber: string;
  cardAddress: string; 
  cardAddressID: number;
}

interface CardForm{ 
  cardnumber: string; 
  cardAddress: string; 
}

interface Address{ 
  uniqueAdressID: number; 
  paymentAddress: string; 
  deliveryAddress: string; 
}

interface categoryType {
  category: string;
  types: string[]; 
}

interface cartItem { 
  productID: number; 
  size: string;
  tile: string; 
  brand: string;
  quantity: number; 
  price: number; 
}

interface orderItem { 
  title: string;
  quantity: number; 
}

interface orderArray { 
  orderID: number;
  status: string;
  deliveryType: string;
  deliveryPrice: string;
  deliveryDate: string;
  shipDate: string;
  orderItems: orderItem[];
}

@Component({
  selector: 'app-shopping-page',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  templateUrl: './shopping-page.component.html',
  styleUrl: './shopping-page.component.css'
})
export class ShoppingPageComponent implements OnInit{

  customerID: number | null = 0;
  message: string = 'stuff';
  products: any[] = [];
  categories: categoryType[] = [];
  cartTotal: number = 0; 
  shoppingCart: cartItem[] = [];
  filteredProducts: any[] = [];
  orders: any[] = [];
  searchTerm: string = "";
  c_validity: boolean = true; 
  t_validity: boolean = true;
  order_products: orderArray[] = [];
  order_product_arr: orderItem[] = []; 
  orders_list: orderArray[] = [];
  deliveryType: string = "standard";
  customerName: string = "";
  customerBalance: number = 0.0; 
  addressId: number = 0;
  addresses: Address[] = [];
  selectedCard: string = "";
  cardForm: CardForm = {cardnumber: "", cardAddress: ""}
  cards: any [] = []; 
  cards_and_address: any[] = [];
  cardSelection: string = "";



  orderButton(): void{ 
    this.postOrder(); 
  }

  postOrder(): void{ 
    this.http.post<any>('http://localhost:3000/api/orders', {     
    Status: "issued",
    DeliveryType:this.deliveryType,
    DeliveryPrice:this.cartTotal,
    DeliveryDate: new Date().toDateString,
    ShipDate: new Date().toDateString,
    CardNumber: this.selectedCard, 
    CustomerID: this.customerID}).subscribe(
      (response) => {
        console.log('Customer registration successfull', response);
        var new_orderID = response.orderid;
        this.postOrderProducts(new_orderID);
      },
      (error) => {
        console.error('Error', error);
      }
    )
  }

  submitForm(): void{ 
    console.log(this.addressId)
    this.http.get<any>(`http://localhost:3000/api/addresses/id/${this.addressId}`).subscribe(
      (response) => {
        console.log(response)
        var address : Address = {
          uniqueAdressID: this.addressId ,
          paymentAddress: response.paymentaddress,
          deliveryAddress: response.deliveryaddress, 
        }
        this.http.post<any>('http://localhost:3000/api/addresses', {     
          paymentaddress: this.cardForm.cardAddress, 
          deliveryaddress: address.deliveryAddress
        }).subscribe(
            (response) => {
              console.log('post address successful', response);
              console.log(response);
              response.addressid;
              this.postCard(response.uniqueaddressid);
    
            },
            (error) => {
              console.error('Error', error);
            }
          ) 
      }
    );
  }

  postAddress(): void{ 
    var temp_address = this.getAddresses(this.addressId);
    this.http.post<any>('http://localhost:3000/api/addresses', {     
      paymentaddress: this.cardForm.cardAddress, 
      deliveryaddress: temp_address.deliveryAddress
    }).subscribe(
        (response) => {
          console.log('post address successful', response);
        },
        (error) => {
          console.error('Error', error);
        }
      )    
  }

  putAddress(address_index: any): void{ 
    this.http.put<any>(`http://localhost:3000/api/addresses/${address_index.addressId}`, {
      paymentAddress: address_index.paymentaddress,
      deliveryAddress: address_index.deliveryaddress, 
    }).subscribe(
      (response) => {
        
      }
    );
  }

  getAddresses(addressid: number): any {
    this.http.get<any>(`http://localhost:3000/api/addresses/id/${addressid}`).subscribe(
        (response) => {
          console.log(response)
          var address : Address = {
            uniqueAdressID: addressid ,
            paymentAddress: response.paymentaddress,
            deliveryAddress: response.deliveryaddress, 
          }
          console.log(address)
          return address; 
        }
      );
  }

  postCard(addressid: any): void{ 
    this.http.post<any>('http://localhost:3000/api/creditcard', {     
    CardNumber: this.cardForm.cardnumber, 
    CustomerID: this.customerID,
    CardAddresses: addressid,
  }).subscribe(
      (response) => {
        this.cards = [];
        this.getCards();
        console.log('Customer registration successfull', response);
      },
      (error) => {
        console.error('Error', error);
      }
    )    
  }

  setupCards(): void{ 
    console.log(this.cards.length)

    for(let i = 0; i < this.cards.length; i++){
      console.log(this.cards)
      this.http.get<any>(`http://localhost:3000/api/addresses/id/${this.cards[i].cardaddresses}`).subscribe(
        (response) => {
          console.log(response)
          var temp_card: Credit = { 
            cardNumber: this.cards[i].cardnumber,
            cardAddress: response.paymentAddress, 
            cardAddressID: this.cards[i].cardaddresses
          }
          this.cards_and_address.push(temp_card);        
        },
        (error) => { 
          console.log(error);
        }
      );
    }

  }

  getCards(): void{ 
    this.http.get<any>(`http://localhost:3000/api/creditcard/${this.customerID}`).subscribe(
      (response) => {
        this.cards = response; 
        console.log(response)
        this.setupCards(); 
      },
      (error) => {
        console.log(error);
      }
    );
  }

  putCard(): void{

  }

  deleteAddress(paymentaddress: number): void{ 
    this.http.delete<any>(`http://localhost:3000/api/creditcard/${paymentaddress}`).subscribe(
      (response) => {
        console.log(response)
      },
      (error) => {
        console.error('Error fetching staff info', error);
      }
    );
  }


  deleteCard(cardnumber: string, paymentaddress: number): void{ 
    this.http.delete<any>(`http://localhost:3000/api/creditcard/${cardnumber}`).subscribe(
      (response) => {
        console.log(response)
        this.cards = []; 
        this.deleteAddress(paymentaddress); 
        this.getCards; 
      },
      (error) => {
        console.error('Error fetching staff info', error);
      }
    );
  }


  getCustomerInfo(customerid: number): void {
    this.http.get<any>(`http://localhost:3000/api/customer/id/${customerid}`).subscribe(
        (response) => {
          console.log(response)
          this.customerName = response.name;
          this.customerBalance = parseFloat(response.balance);
          this.addressId = response.customeraddressid;
        },
        (error) => {
          console.error('Error fetching staff info', error);
        }
      );
  }

  postOrderProducts(orderID: any): void{ 
    for(let i = 0; i < this.shoppingCart.length; i++){
      this.http.post<any>('http://localhost:3000/api/order_products', {     
        Quantity: this.shoppingCart[i].quantity , OrderId: orderID, ProductId: this.shoppingCart[i].productID
      }).subscribe(
        (response) => {
          console.log('Customer registration successfull', response);
        },
        (error) => {
          console.error('Error', error);
        }
      )
    }
    this.orders_list = [];
    this.getOrders();
    this.shoppingCart = [];
    var newBalance = (this.customerBalance + this.cartTotal).toFixed(2); 
    this.http.put<any>(`http://localhost:3000/api/customer/id/${this.customerID}`, { balance: newBalance}).subscribe(
      (response) => {
        console.log('Customer updated', response);
        this.customerBalance = 0; 
        this.cartTotal = 0.0;
        this.deliveryType = "standard";
        this.getCustomerInfo(Number(this.customerID));
      },
      (error) => {
        console.error('Error', error);
      }
  );
  }

  getOrders(): void {
    this.http.get<any[]>('http://localhost:3000/api/orders').subscribe(
      (response) => {
        this.orders = response;
          this.http.get<any[]>('http://localhost:3000/api/order_products').subscribe(
            (response) => {
              const products = response;
              this.orders = this.orders.filter(order => order.customerid === this.customerID);
              console.log(this.customerID);

              for (let i = 0; i < this.orders.length; i++) {
                var orderproducts: orderItem[] = [];
                var temp_products = products.filter(product => product.orderid === this.orders[i].orderid);
                console.log(temp_products)
                for (let k = 0; k < temp_products.length; k++){
                  var item_name = this.products.find(product => product.productid === temp_products[k].productid);
                  console.log(item_name.name)
                  orderproducts.push({ title: item_name.name, quantity: temp_products[k].quantity })
                }
                this.orders_list.push({  
                  orderID: this.orders[i].orderid,
                  status: this.orders[i].status,
                  deliveryType: this.orders[i].deliverytype,
                  deliveryPrice: this.orders[i].deliveryprice,
                  deliveryDate: this.orders[i].deliverydate,
                  shipDate: this.orders[i].shipdate,
                  orderItems: orderproducts
                })
              }
          
          console.log(this.orders_list)
            },
        (error) => {
          console.error('Error', error);
        }
      );
      },
      (error) => {
        console.error('Error', error);
      }
    );
  }

  getProducts(): void {
    this.http.get<any[]>('http://localhost:3000/api/product').subscribe(
      (response) => {
        this.products = response;
        this.filteredProducts = this.products;
        this.sortProducts(); 
        console.log(this.categories);
        this.getOrders();
      },
      (error) => {
        console.error('Error', error);
      }
    );
  }


  filterProducts() {
    if (!this.searchTerm) {
      this.filteredProducts = this.products;
      return;
    }

    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1
    );
  }

  AddToCart(new_item: any): void{ 
    if(this.shoppingCart.some(item => item.productID === new_item.productid)){
      const index = this.shoppingCart.find(item => item.productID === new_item.productid); 
      if(index?.price != undefined && index?.quantity != undefined){
        index.price = parseFloat((Number(index.price) + Number(new_item.price)).toFixed(2)); 
        index.quantity += 1; 
      }
    }
    else{
      this.shoppingCart.push({ 
        productID: new_item.productid, 
        size: new_item.size,
        tile: new_item.name,
        brand: new_item.brand,
        quantity: 1,
        price: Number(new_item.price)
      });
    }
    this.cartTotal = Number((this.cartTotal + Number(new_item.price)).toFixed(2));
  }

  isCategoryValid(category: any): boolean{ 
    if(this.filteredProducts.some(item => item.category == category.category)){ 
      
      return true;
    }
    else{
      return false;
    }
  }

  isTypeValid(type: any): boolean{ 
    if(this.filteredProducts.some(item => item.type == type)){ 
      return true;
    }
    else{
      return false;
    }
  }

  RemoveFromCart(old_item: any): void{ 
    if(old_item.quantity == 1){
      this.shoppingCart = this.shoppingCart.filter(item => item.productID != old_item.productID);
      this.cartTotal = Number((this.cartTotal - Number(old_item.price)).toFixed(2));
    }
    else{ 
      const indexCart = this.shoppingCart.find(item => item.productID === old_item.productID); 
      const indexProduct = this.products.find(item => item.productid === old_item.productID); 
      if(indexCart?.price != undefined && indexCart?.quantity != undefined){
        indexCart.price = parseFloat((Number(old_item.price) - Number(indexProduct.price)).toFixed(2)); 
        indexCart.quantity -= 1; 
      }    
      this.cartTotal = Number((this.cartTotal -  Number(indexProduct.price)).toFixed(2));
    }
  }

  //make an interface that stores both the category and an array of objects to go with it. 

  sortProducts(): void { 
    this.products.forEach(product => { 
      if(!this.categories.some(category => category.category === product.category)){
        this.categories.push({category: product.category, types: [product.type]});
      }  
      else{
        const index = this.categories.find(category => category.category === product.category);
        if(!index?.types.includes(product.type)){
          index?.types.push(product.type);
        }
      }
    });
  }


  constructor(private http: HttpClient, private authService: AuthService) {

  }

  ngOnInit(): void {
      this.customerID = this.authService.getLoggedInUserId()
      this.getProducts(); 
      this.getCards(); 
      this.getCustomerInfo(Number(this.customerID));
  }

}
