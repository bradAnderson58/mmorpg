
import { isInternalLink } from './main'

test('should return false given external link', () => {
  expect(isInternalLink('https://google.com')).toBe(false);
});
