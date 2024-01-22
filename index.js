const INCREASE = 'increase';
const DECREASE = 'decrease';
const WATER_AMOUNT_STEP = 0.1; // шаг добавления(удаления) воды в(из) чайника

class KettleComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			waterAmount: 0, // количество воды в чайнике
			isKettleOn: false, // состояние чайника (включен/выключен)
			temperature: 0, // текущая температура воды в чайнике (изначально берем температуру равную 0)
			timer: null, // переменная для очистки setInterval
			isWaterBoiled: false, // переменная для определения состояния воды (закипела/не закипела)
			isShowCurrentTemperatureNotification: false, // переменная для вывода(скрытия) сообщения о текущей температуре
			isShowKettleConditionNotification: false // переменная для вывода(скрытия) сообщения о состоянии чайника
		};
	}

	get waterAmount() { // геттер для количества воды в чайнике
		return this.state.waterAmount;
	}

	set waterAmount(value) { // сеттер для изменения количества воды в чайнике в зависимости от того, какая кнопка была нажата (добавить воды/отлить воды)
		if (value === INCREASE) {
			this.setState({ waterAmount: +(this.state.waterAmount + WATER_AMOUNT_STEP).toFixed(1) });
			return;
		}
		if (value === DECREASE) {
			this.setState({ waterAmount: +(this.state.waterAmount - WATER_AMOUNT_STEP).toFixed(1) });
			return;
		}
		this.setState({ waterAmount: 0 });
	}

	get timer() { // геттер переменной для вызова clearInterval
		return this.state.timer;
	}

	set timer(value) { // сеттер переменной для возможности дальнейшего вызова clearInterval
		this.setState({ timer: value });
	}

	disableButtons = (value) => { // метод для блокировок кнопок (добавить воды/отлить воды) в зависимости от условий (при достижении максимального и минимального значений)
		if (value === INCREASE) return this.waterAmount === 1;
		if (value === DECREASE) return !this.waterAmount;
		return false;
	}

	kettleOn = () => { // метод включения чайника
		this.showNotification(); // выводим сообщение о состоянии чайника
		this.setState({ isWaterBoiled: false, isKettleOn: true });
		const temperatureForOneSecond = 100 / (this.waterAmount * 10);  // рассчитываем время кипения воды для текущего объема залитой в чайник воды
		this.timer = setInterval(() => {  // изменяем сообщение о текущей температуры воды в чайнике каждую секунду
			this.setState({
				isShowCurrentTemperatureNotification: true,
				temperature: this.state.temperature + temperatureForOneSecond
			})
			if (this.state.temperature >= 100) { // при достижении температуры воды в чайнике 100 градусов выключаем чайник и выводим сообщение, что чайник закипел
				this.setState({ isWaterBoiled: true });
				this.kettleOff();
			}
		}, 1000)
	}

	kettleOff = () => {
		this.showNotification(); // выводим сообщение о состоянии чайника
		this.setState({ isKettleOn: false, isShowCurrentTemperatureNotification: false, temperature: 0 });
		clearInterval(this.timer); // очищаем clearInterval
	}

	showNotification = () => { // метод для вывода сообщения о состоянии чайника
		this.setState({ isShowKettleConditionNotification: true });
		setTimeout(() => this.setState({ isShowKettleConditionNotification: false }), 2000);
	}

	showKettleCondition = () => { // метод для установки состояния чайника в зависимости от определенных условий
		switch (true) {
			case this.state.isKettleOn: {
				return 'включен';
			}
			case !this.state.isKettleOn && this.state.isWaterBoiled: {
				return 'закипел';
			}
			case !this.state.isKettleOn && !this.state.isWaterBoiled: {
				return 'выключен';
			}
			default: {
				return '';
			}
		}
	}

	render() {
		return (
			<div className='context'>
				{ !this.state.isWaterBoiled ? <img src="./images/kettleWithoutSteam.svg" alt="kettleWithoutSteam"/> :
					<img src="./images/kettleWithSteam.svg" alt="kettleWithSteam"/> }
				<span>Количество налитой воды: { !this.waterAmount ? 0 : this.waterAmount.toFixed(1) } л</span>
				<div className='buttons'>
					<button className='button' disabled={ this.disableButtons(INCREASE) || this.state.isKettleOn }
					        onClick={ () => this.waterAmount = INCREASE }>
						Долить воды
					</button>
					<button className='button' disabled={ this.disableButtons(DECREASE) || this.state.isKettleOn }
					        onClick={ () => this.waterAmount = DECREASE }>
						Отлить воды
					</button>
					<button className='button' disabled={ !this.waterAmount || this.state.isKettleOn } onClick={ this.kettleOn }>
						Включить чайник
					</button>
					<button className='button' disabled={ !this.waterAmount || !this.state.isKettleOn }
					        onClick={ this.kettleOff }>
						Выключить чайник
					</button>
				</div>
				<div
					className={ ['is-kettle-condition', this.state.isShowKettleConditionNotification ? 'show-notification' : ''].join(' ') }>Чайник { this.showKettleCondition() }.
				</div>
				<div
					className={ ['temperatureNotification', this.state.isShowCurrentTemperatureNotification ? 'show-notification' : ''].join(' ') }>Текущая
					температура воды: { this.state.temperature.toFixed(1) } &#8451;</div>
			</div>
		);
	}
}

let root = document.querySelector('#root');
ReactDOM.render(<KettleComponent/>, root)