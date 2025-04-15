import xss from 'xss';
import validator from 'validator';

export function cleanAndValidate(input) {
  const sanitized = xss(input);

  const isValid = validator.isURL(sanitized, {
    require_protocol: false, // for domain-like values like `google.com`
  });

  return isValid ? sanitized : null;
}