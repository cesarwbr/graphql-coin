import fetch from 'node-fetch'

const BASE_URL = 'https://min-api.cryptocompare.com/data'

export const resolvers = {
	Query: {
		coins: () => {
			return fetch(`${BASE_URL}/pricemulti?fsyms=BTC,ETH&tsyms=USD,BRL`)
			.then(res => res.json())
			.then(result => {
				const coins = result

				return [{
					name: 'BTC',
					price: coins.BTC.USD
				}, {
					name: 'ETH',
					price: coins.ETH.USD
				}]
			})
		}
	}
}
