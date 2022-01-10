
const Natives = {
  merge: function merge(target, source) {
    Object.entries(source).forEach(([key, value]) => {
      value && typeof value === 'object' ? 
      merge(target[key] = target[key] || {}, value) : 
      target[key] = value;
    });
    return target;
  },
  pick(object, keys){
    return keys.reduce((result, key) => {
      if (Object.hasOwn(object, key)) result[key] = object[key];
      return result;
    }, {})
  }
}

export { Natives }