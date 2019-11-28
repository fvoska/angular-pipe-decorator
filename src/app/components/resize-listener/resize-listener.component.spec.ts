import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizeListenerComponent } from './resize-listener.component';

describe('ResizeListenerComponent', () => {
  let component: ResizeListenerComponent;
  let fixture: ComponentFixture<ResizeListenerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResizeListenerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResizeListenerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
