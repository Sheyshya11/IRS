module.exports = {
  format: "A3",
  orientatation: "portrait",
  border: "8mm",
  header: {
    height: "15mm",
    contents: "subham shrestha",
  },
  footer: {
    height: "20mm",
    contents: {
      first: "Cover page",
      2: "Second page",
      default:
        '<span style="color: #444;">{{pages}}</span></span>{{pages}}</span>',
      last: "Last page",
    },
  },
};
