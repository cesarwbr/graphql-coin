import fetch from 'node-fetch'
import { PubSub, withFilter } from 'graphql-subscriptions'

const BASE_URL = 'https://www.bitstamp.net/api/v2/ticker'

const pubsub = new PubSub()

const coinsObj = [
  {
    id: 'btcusd',
    name: 'BTC',
    displayName: 'Bitcon',
    image:
      'https://seeklogo.com/images/B/bitcoin-logo-DDAEEA68FA-seeklogo.com.png'
	},
	{
		id: 'bchusd',
    name: 'BCH',
    displayName: 'Bitcon Cach',
    image: 'https://walletgenerator.net/logos/bitcoincash.png'
	},
  {
    id: 'xrpusd',
    name: 'XRP',
    displayName: 'Ripple',
    image:
      'https://www.cryptosaurus.cc/ctrl/wp-content/uploads/RIPPLE.png'
  },
  {
    id: 'ltcusd',
    name: 'LTC',
    displayName: 'Litecoin',
    image:
      'https://www.techaroha.com/wp-content/uploads/2017/09/litecoin.png'
  },
  {
    id: 'ethusd',
    name: 'ETH',
    displayName: 'Ethereum',
    image: 'https://www.ethereum.org/images/logos/ETHEREUM-ICON_Black.png'
  }
]

function listenToPrice(coinObj) {
  global.setInterval(() => {
    fetch(`${BASE_URL}/${coinObj.id}`)
      .then(res => res.json())
      .then(result => {
        const coins = result

        const coin = {
          name: coinObj.name,
          price: coins.last
        }

        pubsub.publish('priceChanged', { priceChanged: coin, name: coin.name })
      })
  }, 10000)
}

coinsObj.forEach(coinObj => listenToPrice(coinObj))

export const resolvers = {
  Query: {
    coins: () => {
			const promises = coinsObj.map(coinObj => {
				return fetch(`${BASE_URL}/${coinObj.id}`)
      })

      return Promise.all(promises)
			.then(results => {
				return Promise.all(results.map(res => res.json()))
			})
			.then(coins => {
				return coins.map((coin, index) => {
					const last = parseFloat(coin.last)
					const open = parseFloat(coin.open)

					const change = (100 * (last - open)) / last
					return ({
            name: coinsObj[index].name,
            displayName: coinsObj[index].displayName,
            price: parseFloat(coin.last),
						image: coinsObj[index].image,
						open,
						change
					})
				})
        })
    }
  },
  Subscription: {
    priceChanged: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('priceChanged'),
        (payload, variables) => {
          return payload.name === variables.name
        }
      )
    }
  }
}
