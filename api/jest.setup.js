import {jest} from '@jest/globals'

const modules = {};
jest.unstable_mockModule('./src/utils/helper.js', async () => {
    // console.log(arguments);
    if(modules['./src/utils/helper.js']) {
        return modules['./src/utils/helper.js'];
    }
    const actual = await import('./src/utils/helper.js');
    // console.log('actual', actual);
    modules['./src/utils/helper.js'] = {
      ...actual,
      delay: jest.fn().mockResolvedValue('fast!'),
    };
    return modules['./src/utils/helper.js'];
  });