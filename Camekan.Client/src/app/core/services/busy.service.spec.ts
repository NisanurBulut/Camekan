import {NgxSpinnerService} from "ngx-spinner";
import {BusyService} from "./busy.service";

// vi.fn() hiç bir şey yapmaz, sadece kendine gelen istekleri yazar, sahte method
function createBusyService() {
  const spinner = {show: vi.fn(), hide: vi.fn()};
  const service = new BusyService(spinner as unknown as NgxSpinnerService); // sadece testte kullanılır, gerçekmiş gibi kabul et anlamına gelir
  return {service, spinner} ;
}
describe('BusyService', () => {
  it('shows a spinner if it takes a request', () => {
    const {service, spinner} = createBusyService();
    service.busy();
    expect(spinner.show).toHaveBeenCalledTimes(1); // iptal edilene kadar çalış yani spinner göster
  });

it('shows the spinner until last request ends', () => {
     const { service, spinner } = createBusyService();

    service.busy();
    service.busy();
    service.idle();
    expect(spinner.hide).not.toHaveBeenCalled();

    service.idle();
    expect(spinner.hide).toHaveBeenCalledTimes(1); // iptal edilene kadar çalış yani spinner göster
  });

  it('busyRequest must not be negative', () => {
    const {service, spinner} = createBusyService();
    service.idle();
    expect(service.busyRequestCount).toBe(0); // isteklerin hepsi sonuçlanana dek, httpRequest sayısı 0 olana dek çalışır yani spinner göster
  })
});
