import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Menu } from '../models/main.model';
import { ShopService } from '../services/shop.service';

@Component({
  selector: 'site-menu',
  templateUrl: './menu.component.html',
  providers:   [ ShopService ],
})

export class SiteMenuComponent implements OnInit {

  private page_current: number = 1;
  private page_prev: number = 1;
  private page_next: number = 1;
  private keyword: string;
  private pagination: number[];
  private menus_count: number;
  private menus_per_page: number;
  private menus: Menu[];
  private selected_menu: Menu;

  constructor(
    private route: ActivatedRoute,
    private _service: ShopService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.findMenus();
  }

  findMenus() : void {
    this._service.getMenus(this.page_current, this.keyword).then((res) => {
      this.menus = res.menus as Menu[]
      this.menus_count = res.total
      this.menus_per_page = res.onpage
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

  menuChanged(menu: Menu) : void {
    this._service.updateMenu(menu);
  }

  saveChanges(menu: Menu) : void {
    this.menuChanged(menu);
    this.menus.forEach((v, i) => {
      if(+v.id === +menu.id) v = menu;
    });
    this.selected_menu = null;
  }

  viewDetails(menu: Menu) : void {
    this.selected_menu = menu;
  }

  back(): void {
     this.location.back();
  }

}
