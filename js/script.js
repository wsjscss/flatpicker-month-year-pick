let fp = new newFp('#fp', {
  inline: true,
  onChange() {
    console.log('To server', this.selectedDates[0]);
  },
});

document.querySelector('#reset').addEventListener('click', () => {
  fp.setDate(new Date());
});
