module.exports = {
  generateClassCode: (categoryName) => {
    let classCode = "";
    let result = categoryName.split(" ");
    for (let i = 0; i < result.length; i++) {
      classCode += result[i][0];
    }
    return classCode;
  },
};
