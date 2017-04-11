const directive = (name, controller) => {
  document
    .querySelectorAll(`[${ name }]`)
    .forEach(elem => controller(elem, elem.attributes[name].value));
};

const evalInScope = (exp, scope) => eval(
  Object
    .keys(scope)
    .map(name => `var ${ name } = ${ JSON.stringify(scope[name]) }`)
    .concat(exp)
    .join(';')
);

const run = (exp, scope) => {
  try {
    return evalInScope(exp, scope);
  } catch (e) {
  }
};

const $watches = [];
const $scope = { };

const $watch = (exp, cb) => {
  const prev = run(exp, $scope);

  $watches.push({ exp, cb, prev });

  cb(prev, prev);
};

const $digestOnce = () => {
  let changed = false;

  $watches.forEach(watch => {
    const { exp, cb, prev } = watch;
    const curr              = run(exp, $scope);

    if (curr !== prev) {
      cb(curr, prev);
      watch.prev = curr;
      changes = true;
    }
  });

  return changed;
};

const $digest = () => {
  let loops = 10;

  while ($digestOnce() && loops) {
    loops -= 1;
  }

  if (!loops) {
    console.log(`Digest ran too many times!`);
  }
};


