module.exports.generateColor = () => {
  return "#" + Math.random().toString(16).slice(2, 8);
}