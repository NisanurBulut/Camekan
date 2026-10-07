import { ShopParam } from './shopParams.model';

describe('ShopParam', () => {
  it('should create an instance', () => {
    expect(new ShopParam()).toBeTruthy();
  });

  it('starts on Page 1 with 6 items per Page', () => {
      const shopParam = new ShopParam();
        expect(shopParam.PageNumber).toBe(1);
        expect(shopParam.PageSize).toBe(6);
    });

});
