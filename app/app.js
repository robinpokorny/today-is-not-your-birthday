(() => {
  'use strict';

  const storage = {
    get: (key) => {
      try {
        return JSON.parse(localStorage.getItem(key));
      } catch (e) {
        console.warning(`Can't get item from localStorage: ${key}`);
        return null;
      }
    },

    set: (key, value) => {
      localStorage.setItem(key, JSON.stringify(value));
    }
  };

  const BirthdayInput = React.createClass({
    propTypes: {
      onKeyUp: React.PropTypes.func.isRequired,
      birthday: React.PropTypes.string
    },

    render: function() {
      const div = React.createFactory('div');

      return (
        div(null,
          React.createElement('h1', null, 'When were you born?'),
          React.createElement('input', {
            placeholder: '15.01.1993',
            defaultValue: this.props.birthday,
            onKeyUp: this.props.onKeyUp
          })
        )
      );
    }
  });

  const TodayLabel = (props) => {
    return React.createElement('h1', null, props.isItToday
      ? 'Okay, HB.'
      : 'Today is NOT your birthday'
    );
  };

  const Application = React.createClass({
    getInitialState: function() {
      const bd = storage.get('birthday');
      return {
        birthday: bd,
        isItToday: this.isBirthdayToday(bd)
      };
    },

    render: function() {
      return (
        this.state.birthday === null
        ? React.createElement(BirthdayInput, { onKeyUp: this.onBirthdayInputKeyUpHandler })
        : React.createElement(TodayLabel, { isItToday: this.state.isItToday })
      );
    },

    onBirthdayInputKeyUpHandler: function(event) {
      if (event.key === 'Enter') {
        let birthday = event.currentTarget.value;
        if (/^\d{2}\.\d{2}\.\d{4}$/.test(birthday)) {
          storage.set('birthday', birthday);
          this.setState({
            birthday: birthday,
            isItToday: this.isBirthdayToday(birthday)
          });
        }
      }
    },

    isBirthdayToday: function(birthday) {
      if (!birthday) {
        return false;
      }

      const now = new Date();
      const bd = birthday.split('.');

      return (now.getDate() == bd[0] && now.getMonth() + 1 == bd[1]);
    }
  });

  ReactDOM.render(
    React.createElement(Application),
    document.getElementById('root')
  );
})();
