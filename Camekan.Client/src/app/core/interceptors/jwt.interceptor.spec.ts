import { of } from 'rxjs';
import { jwtInterceptor } from './jwt.interceptor';
import { HttpRequest } from "@angular/common/http";
import { environment } from 'src/environments/environment';

function headerFor(url:string){
  let sent!:HttpRequest<unknown>;
  jwtInterceptor(new HttpRequest('GET', url), req => {sent = req; return of();});

    return sent.headers.get('Authorization');
  }

  describe('jwtInterceptor', ()=> {

    beforeEach(()=> localStorage.setItem('token','parla'));
    afterEach(()=>localStorage.clear());

    it('adds the token to API requests',()=>{

      expect(headerFor(`${environment.apiUrl}/basket`)).toBe('Bearer parla')
    })

    it('doesnt add the token to other urls', ()=>{
      expect(headerFor('../../../assets/i18n/tr.json')).toBeNull();
      expect(headerFor('../../../assets/i18n/en.json')).toBeNull();
      expect(headerFor(`${environment.apiUrl}x/basket`)).toBeNull();
    })
  });
