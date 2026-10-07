import { ShopParam } from './shopParams.model';

describe('ShopParam', () => {
  it('should create an instance', () => {
    expect(new ShopParam()).toBeTruthy();
  });
});


// describe('ShopParam', () => {
//     it('starts on Page 1 with 6 items per Page', () => {
//       const shopParam = new shopParam();
//         expect(shopParam.page).toBe(1);
//         expect(shopParam.itemsPerPage).toBe(6);
//     });
//   })
