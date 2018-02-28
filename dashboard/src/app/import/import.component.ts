import { Component, OnInit } from '@angular/core';
import { Product } from '../models/main.model';
import { ProductsService } from '../shop/products.service';
import 'rxjs/Rx' ;

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']
})
export class ImportComponent implements OnInit {

  private products: Product[];
  private filename: string;

  constructor(
    private _service: ProductsService
  ) {

  }

  public downloadFile(data): void {
    var blob = new Blob([(<any>data)._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    var downloadUrl= URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download="megakovka.xlsx";
    link.click();
  }

  public getPricelist(): void {
    this._service.getPricelist().then((res) => window.open(res, "_blank"));
  }

  public xlsxloaded(event): null {
    var path = event.target.value.split('\\');
    var filename = path.pop();
    var ext = (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : null;
    if(ext !== 'xlsx') {
      this.filename = 'Только xlsx книги доступны для загрузки';
      return event.target.value = null;
    }
    this.filename = filename;
    var files: any = event.target.files;
    var formData: any = new FormData();
    formData.append("files", files[0], files[0]['name']);
    this._service.uploadPricelist(formData)
      .then((res) => {
        console.log(res);
        this.products = res.products as Product[]
      });
  }

  ngOnInit() {

  }


}
