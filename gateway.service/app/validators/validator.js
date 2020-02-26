const jsonschema = require('jsonschema');
const Validator = jsonschema.Validator;

let validator = new Validator();


/**
 * Check if schemas instance length is greater than minLenght 
 */
validator.attributes.minLenght = function (instance, schema, options, ctx){
  if(typeof instance != 'string') return;

  if(typeof schema.minLenght != 'number'){
    throw new jsonschema.SchemaError('"minLength" expects a number');
  }

  if(instance.length < schema.minLenght){
    return `${instance} length is lower than ${schema.minLenght}`;
  }
}


/**
 * Check if instance is a valid email
 */
validator.attributes.isEmail = function (instance, schema, options, ctx){
  if(typeof instance != 'string') return;

  if(typeof schema.isEmail != 'boolean'){
    throw new jsonschema.SchemaError('"isEmail" expects a boolean');
  }

  let emailRe = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if(schema.isEmail && !emailRe.test(instance)){
    return `${instance} is invalid email address.`;
  }

}

module.exports = validator
