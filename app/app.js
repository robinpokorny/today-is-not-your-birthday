(() => {
  'use strict'

  const {
    Component,
    createElement,
    createFactory
  } = window.React

  const storage = {
    get: (key) => {
      try {
        return JSON.parse(window.localStorage.getItem(key))
      } catch (e) {
        console.warn(`Can't get item from localStorage: ${key}`)
        return null
      }
    },

    set: (key, value) => {
      window.localStorage.setItem(key, JSON.stringify(value))
    }
  }

  const isBirthdayToday = (birthday) => {
    if (!birthday) {
      return false
    }

    const now = new Date()
    const bd = birthday.split('.')

    return (now.getDate() == bd[0] && now.getMonth() + 1 == bd[1])
  }

  const BirthdayInput = ({ birthday, onKeyUp }) => (
    createFactory('div')(null,
      createElement('h1', null, 'When were you born?'),
      createElement('input', {
        placeholder: '15.01.1993',
        defaultValue: birthday,
        onKeyUp
      })
    )
  )

  const TodayLabel = ({ birthday }) => {
    const birthdayToday = isBirthdayToday(birthday)
    const text = birthdayToday
      ? 'Okay, HB.'
      : 'Today is NOT your birthday'
    const className = birthdayToday
      ? 'label label--birthday'
      : 'label'

    return createElement('h1', { className }, text)
  }

  class Application extends Component {
    constructor () {
      super()
      this.state = { birthday: storage.get('birthday') }
    }

    render () {
      const { birthday } = this.state

      const label = birthday === null
        ? createElement(BirthdayInput, { onKeyUp: this.onBirthdayInputKeyUpHandler.bind(this) })
        : createElement(TodayLabel, { birthday })
      const className = isBirthdayToday(birthday)
        ? 'root root--birthday'
        : 'root'

      return createElement('div', { className }, [label])
    }

    onBirthdayInputKeyUpHandler ({ key, currentTarget }) {
      if (key === 'Enter') {
        const birthday = currentTarget.value

        if (/^\d{2}\.\d{2}\.\d{4}$/.test(birthday)) {
          storage.set('birthday', birthday)
          this.setState({ birthday })
        }
      }
    }
  }

  window.ReactDOM.render(
    createElement(Application),
    document.getElementsByTagName('body')[0]
  )
})()
