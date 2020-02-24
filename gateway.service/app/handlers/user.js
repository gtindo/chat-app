exports.register = async (data) => {
  return new Promise((resolve, reject) => {
    try{
      console.log(data);
      resolve(data);
    } catch (err) {
      console.log(err)
      reject("error");
    }
  });
}
