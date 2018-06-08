const moment = require('moment');

const interpolations = {
    "Fn::RandomFloat": ({min, range}) => Math.random() * range + min,
    "Fn::Moment": ({format}) => moment().format(format),
    "Fn::ConvertType": ({type, value}) => global[type](value),
    "Fn::Eval": s => eval(s),
    get: name => name.startsWith('Fn::') ? interpolations[name] : undefined
};

const interpolate = (json, depth) => {
    if (typeof json === 'object')
        for (const key in json) {
            if (!depth || depth > 0) json[key] = interpolate(json[key], depth - 1);
            const ip = interpolations.get(key);
            if (ip) return ip(json[key]);
        }
    return json;
};

module.exports = interpolate;