import fetch from 'node-fetch'
import { PubSub, withFilter } from 'graphql-subscriptions'

const BASE_URL = 'https://min-api.cryptocompare.com/data'

const pubsub = new PubSub()

global.setInterval(() => {
	fetch(`${BASE_URL}/pricemulti?fsyms=BTC&tsyms=USD`)
	.then(res => res.json())
	.then(result => {
		const coins = result

		const coin = {
			name: 'BTC',
			price: coins.BTC.USD
		}

		pubsub.publish('priceChanged', { priceChanged: coin, name: coin.name })
	})
}, 10000)

global.setInterval(() => {
	fetch(`${BASE_URL}/pricemulti?fsyms=ETH&tsyms=USD`)
	.then(res => res.json())
	.then(result => {
		const coins = result

		const coin = {
			name: 'ETH',
			price: coins.ETH.USD
		}

		pubsub.publish('priceChanged', { priceChanged: coin, name: coin.name })
	})
}, 5000)

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
	},
	Subscription: {
		priceChanged: {
			subscribe: withFilter(() => pubsub.asyncIterator('priceChanged'), (payload, variables) => {
				return payload.name === variables.name
			})
		}
	}
}
