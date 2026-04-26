import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacaoModal } from './notificacao-modal';

describe('NotificacaoModal', () => {
  let component: NotificacaoModal;
  let fixture: ComponentFixture<NotificacaoModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificacaoModal],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificacaoModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
