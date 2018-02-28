import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @Input() keyword: string = '';
  @Output('keywordChange') emitter = new EventEmitter<string>();

  searchtyping(event) : any {
    this.keyword = event.target.value;
    this.emitter.emit(this.keyword);
  }
}
