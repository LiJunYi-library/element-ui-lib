const regexp = {
  https: /^(https)/,
  http: /^(http)/,
  Url: /^(http(s?):\/\/)/,
  jd: /^(http(s?):\/\/[^.]*?.jd)/,
};

export default regexp;

export function regexpUrl() {
  console.log('getParse');
}
