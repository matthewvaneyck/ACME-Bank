import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountDetailFormComponent } from './account-detail-form.component';

describe('AccountDetailFormComponent', () => {
  let component: AccountDetailFormComponent;
  let fixture: ComponentFixture<AccountDetailFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountDetailFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountDetailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
