import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Documents } from './documents';

describe('Documents', () => {
  let fixture: ComponentFixture<Documents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Documents],
    }).compileComponents();

    fixture = TestBed.createComponent(Documents);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the Documentos heading', () => {
    expect(fixture.nativeElement.textContent).toContain('Documentos');
  });
});
