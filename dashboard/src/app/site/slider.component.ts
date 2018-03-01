import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Slide } from '../models/main.model';
import { ShopService } from '../services/shop.service';

@Component({
  selector: 'site-slider',
  templateUrl: './slider.component.html',
  providers:   [ ShopService ],
})

export class SiteSliderComponent implements OnInit {

  @ViewChild('imgview') imgview;

  private page_current: number = 1;
  private page_prev: number = 1;
  private page_next: number = 1;
  private keyword: string;
  private pagination: number[];
  private slides_count: number;
  private slides_per_page: number;
  private slides: Slide[];
  private selected_slide: Slide;
  private imgloaded: any = null;

  constructor(
    private route: ActivatedRoute,
    private _service: ShopService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.findMenus();
  }

  findMenus() : void {
    this._service.getSlides(this.page_current, this.keyword).then((res) => {
      this.slides = res.slides as Slide[]
      this.slides_count = res.total
      this.slides_per_page = res.onpage
      this.pagination = res.pagi
      this.page_current = res.page_current
      this.page_prev = res.page_prev
      this.page_next = res.page_next
    });
  }

  navtopage(page: number) : void {
    this.page_current = page;
    this.findMenus();
  }

  slideChanged(slide: Slide) : void {
    this._service.updateSlide(slide);
  }

  saveChanges(slide: Slide) : void {
    if(this.imgloaded instanceof FormData) {
      this.imgloaded.append("slide", JSON.stringify(slide));
      this._service.saveSlideChanged(this.imgloaded)
      .then((res) => { slide.cover = res.filename });
    } else {
      this._service.updateSlide(slide);
    }
    this.slides.forEach((v, i) => {
      if(+v.id === +slide.id) v = slide;
    });
    this.selected_slide = this.imgloaded = null;
  }

  viewDetails(slide: Slide) : void {
    this.selected_slide = slide;
  }

  onimgloaded(event) : void {
    var path = event.target.value.split('\\');
    var filename = path.pop();
    var ext = (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : null;
    if(['jpeg','jpg','gif','png'].indexOf(ext) === -1) {
      return event.target.value = null;
    }
    var files: any = event.target.files;
    var formData: any = new FormData();
    formData.append("files", files[0], files[0]['name']);
    this.imgloaded = formData;


    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = (e:any) => {
      this.imgview.nativeElement.src = e.target.result;
      console.log(e);
    }
    reader.readAsDataURL(file);
  }

  back(): void {
     this.location.back();
  }

}
