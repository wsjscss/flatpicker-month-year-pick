class newFp {
  constructor(selector, options) {
    this.test = 1;
    this.fp = flatpickr(selector, {
      inline: true,
      locale: document.querySelector('html').getAttribute('lang'),
      ...options,
      onReady: (dates, dateAsString, inst) => {
        this.upgradeUI(inst);

        if (!options.onReady) {
          return;
        }

        options.onReady.call(this);
      },
      onChange(dates) {
        if (dates.length) {
          let day = dates[0].getDate();
          let year = this.currentYear;
          let month = this.l10n.months.longhand[this.currentMonth];

          this.calendarContainer.querySelector('[data-day]').innerHTML = day;
          this.calendarContainer.querySelector(
            '[data-month]'
          ).innerHTML = month;
          this.calendarContainer.querySelector('[data-year]').innerHTML = year;
        }

        if (!options.onChange) {
          return;
        }

        options.onChange.call(this);
      },
    });
  }

  upgradeUI(inst) {
    this.createTopNav(inst);
    this.createYearSelector(inst);
    this.createMonthSelector(inst);

    this.addYearEvents(inst);
    this.addMonthEvents(inst);
    this.addDayEvents(inst);
  }

  createTopNav(inst) {
    let $monthCont = inst.monthNav;
    let today = new Date();
    let day = today.getDate();
    let year = inst.currentYear;
    let month = inst.l10n.months.longhand[inst.currentMonth];

    let $newMonthUI = `
  <div class="new-mont">
    <button data-year>${year}</button>
    <button data-month data-selected-month-num="${inst.currentMonth}">${month}</button>
    <button data-day>${day}</button>
  </div>
  `;

    $monthCont.insertAdjacentHTML('beforeend', $newMonthUI);
  }

  createYearSelector(inst) {
    let $yearCont = inst.innerContainer;
    let yearsHtml = ``;
    let currentYear = new Date().getFullYear();

    for (let i = 0; i < 100; i++) {
      yearsHtml += `
      <div class="year" data-year="${currentYear}">${currentYear}</div>
    `;
      currentYear--;
    }

    let html = `
  <div class="absolute-cont" data-year-select>
    ${yearsHtml}
  </div>
  `;

    $yearCont.insertAdjacentHTML('beforeend', html);
  }

  createMonthSelector(inst) {
    let $cont = inst.innerContainer;
    let monthsHtml = ``;
    let months = []; // [{short: String, long: String}]

    for (let i = 0; i <= 11; i++) {
      months.push({
        short: inst.l10n.months.shorthand[i],
        long: inst.l10n.months.longhand[i],
        idx: i,
      });
    }

    months.forEach((month) => {
      monthsHtml += `
        <div
            class="month"
            data-month-short="${month.short}"
            data-month-long="${month.long}"
            data-month-num="${month.idx}"
          >
          ${month.short}
        </div>
      `;
    });

    let html = `
  <div class="absolute-cont" data-month-select>
    ${monthsHtml}
  </div>
  `;

    $cont.insertAdjacentHTML('beforeend', html);
  }

  addYearEvents(inst) {
    let $parent = inst.calendarContainer;
    let $yearToggle = $parent.querySelector('[data-year]');
    let $dayToggle = $parent.querySelector('[data-day]');
    let $yearSelect = $parent.querySelector('[data-year-select]');
    let $monthSelect = $parent.querySelector('[data-month-select]');
    let $monthToggle = $parent.querySelector('[data-selected-month-num]');

    $yearToggle.addEventListener('click', (e) => {
      $yearSelect.classList.toggle('show');

      // Close month
      $monthSelect.classList.remove('show');
    });

    $yearSelect.addEventListener('click', (e) => {
      let yearElm = e.target;
      if (!yearElm.classList.contains('year')) {
        return;
      }

      let year = yearElm.dataset.year;
      let month = +$monthToggle.dataset.selectedMonthNum;

      // FP logic
      inst.setDate(new Date(`${month}/01/${year}`), true);
      // inst.changeMonth(month, false);

      // UI
      $yearSelect.classList.remove('show');
      $yearToggle.innerHTML = year;
      $dayToggle.innerHTML = '01';
    });
  }

  addMonthEvents(inst) {
    let $parent = inst.calendarContainer;
    let $monthToggle = $parent.querySelector('[data-month]');
    let $dayToggle = $parent.querySelector('[data-day]');
    let $monthSelect = $parent.querySelector('[data-month-select]');
    let $yearSelect = $parent.querySelector('[data-year-select]');

    $monthToggle.addEventListener('click', (e) => {
      $monthSelect.classList.toggle('show');

      // Close years
      $yearSelect.classList.remove('show');
    });

    $monthSelect.addEventListener('click', (e) => {
      let monthElm = e.target;
      if (!monthElm.classList.contains('month')) {
        return;
      }

      let monthShort = monthElm.dataset.monthShort;
      let monthLong = monthElm.dataset.monthLong;
      let monthNum = +monthElm.dataset.monthNum + 1;

      // // FP logic
      inst.setDate(new Date(`${monthNum}/01/${inst.currentYear}`), true);
      $monthToggle.setAttribute('data-selected-month-num', monthNum);

      // UI
      $monthSelect.classList.remove('show');
      $monthToggle.innerHTML = monthLong;
      $dayToggle.innerHTML = '01';
    });
  }

  addDayEvents(inst) {
    let $parent = inst.calendarContainer;
    let $dayToggle = $parent.querySelector('[data-day]');
    let $monthSelect = $parent.querySelector('[data-month-select]');
    let $yearSelect = $parent.querySelector('[data-year-select]');

    $dayToggle.addEventListener('click', (e) => {
      // Close years, month
      $yearSelect.classList.remove('show');
      $monthSelect.classList.remove('show');
    });
  }

  setDate(date) {
    this.fp.setDate(date, true);
  }
}
