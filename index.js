const directive = (name, controller) => {
  document
    .querySelectorAll(`[${name}]`)
    .forEach(elem => controller(
      elem,
      elem.attributes[name].value));
};

const evalInScope = (exp, scope) => {
  try {
    return eval(
      Object
        .keys(scope)
        .map(name => `var ${ name } = ${ JSON.stringify(scope[name]) }`)
        .concat(exp)
        .join(';')
    );
  } catch (e) {
  }
};
const scope = {};
const watchers = [];

const $digestOnce = () => {
  let changed = false;

  watchers.forEach(watcher => {
    const { exp, cb, prev } = watcher;
    const curr = evalInScope(exp, scope);
    if (curr !== prev) {
      cb();
      watcher.prev = curr;
      changed = true;
    }
  });

  return changed;
};
const $digest = () => {
  let changed = true;
  let loop = 10;

  while (changed && loop) {
    loop -= 1;
    changed = $digestOnce();
  }

  if (!loop) {
    console.log('Oh now.. bad code!');
  }
};
const $watch = (func, cb) => {
  watchers.push({ exp, cb, prev: evalInScope(exp, scope) });
  return () => watchers = watchers.filter(i => i !== cb);
};

directive('ng-model', (elem, key) => {
  const update = () => {
    scope[key] = elem.value || '';
    $digest();
  };

  elem.oninput = update;
  $watch(key, () => elem.value = scope[key]);
  update();
});
directive('ng-bind', (elem, exp) => {
  $watch(exp, () => elem.innerText = evalInScope(exp, scope));
});
directive('ng-show', (elem, exp) => {
  const update = () => {
    const value = evalInScope(exp, scope); // age < 17
    elem.style.display = value ? 'initial' : 'none';
  };

  $watch(exp, update);
});

