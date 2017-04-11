directive('ng-model', (elem, key) => {
  elem.oninput = () => {
    $scope[key] = elem.value;
    $digest();
  };

  $scope[key] = elem.value || '';
  $digest();

  $watch(key, curr => elem.value = curr);
});

directive('ng-bind', (elem, exp) => {
  $watch(exp, curr => elem.innerText = curr);
});

$watch('me', curr => {
  console.log(`Older: ${ curr }`);
  $scope.age = curr * 2;
});


$watch('age', curr => {
  console.log(`Age: ${ curr }`);
  $scope.older = curr * 2;
});

$digest();