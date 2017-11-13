const { h, app } = hyperapp;

const KEY = 'birthday';

// ==== Utils
const toMonthDay = date => {
  const toTwoDigits = n => String(n).padStart(2, '0');

  const month = toTwoDigits(date.getMonth() + 1);
  const day = toTwoDigits(date.getDate());

  return `-${month}-${day}`;
};

const today = toMonthDay(new Date());

// ==== Views
const NotTodayView = () =>
  h(
    'div',
    { class: 'root' },
    h('h1', { class: 'label' }, 'Today is NOT your birthday')
  );
const HappyBirthdayView = () =>
  h(
    'div',
    { class: 'root root--birthday' },
    h('h1', { class: 'label label--birthday' }, 'Okay, HB.')
  );
const SetBirthdayView = ({ dateValue, year }, { setValue, setBirthday }) =>
  h('div', { class: 'root' }, [
    h('h1', {}, 'What day is your birthday?'),
    h(
      'form',
      {
        onsubmit: e => {
          setBirthday();
          e.preventDefault();
        }
      },
      h('input', {
        type: 'date',
        required: true,
        value: dateValue,
        oninput: event => setValue(event.target.value),
        min: `${year}-01-01`,
        max: `${year}-12-31`
      }),
      h('input', {
        type: 'submit',
        hidden: 'true'
      })
    )
  ]);

app({
  state: {
    birthday: window.localStorage.getItem(KEY),
    dateValue: null,
    year: new Date().getFullYear()
  },
  view: (state, actions) => {
    const { birthday } = state;

    if (!birthday) return SetBirthdayView(state, actions);
    if (birthday === today) return HappyBirthdayView();
    return NotTodayView();
  },
  actions: {
    setBirthday: ({ dateValue }) => () => {
      if (!dateValue) return;

      const birthday = dateValue.substring(4);
      window.localStorage.setItem(KEY, birthday);

      return { birthday };
    },
    setValue: () => dateValue => ({ dateValue })
  }
});
