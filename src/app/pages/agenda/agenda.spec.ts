import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Agenda } from './agenda';

describe('Agenda', () => {
  let fixture: ComponentFixture<Agenda>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Agenda],
    }).compileComponents();

    fixture = TestBed.createComponent(Agenda);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the Agenda heading', () => {
    expect(fixture.nativeElement.textContent).toContain('Agenda');
  });
});
