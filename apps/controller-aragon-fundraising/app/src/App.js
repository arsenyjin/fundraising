import React, { Fragment, useState } from 'react'
import { useApi } from '@aragon/api-react'
import { Layout, Tabs, Button, Main, SidePanel, SyncIndicator } from '@aragon/ui'
import { useInterval } from './utils/use-interval'
import AppHeader from './components/AppHeader/AppHeader'
import NewOrder from './components/NewOrder'
import PresaleSidePanel from './components/PresaleSidePanel'
import Reserves from './screens/Reserves'
import Orders from './screens/Orders'
import MyOrders from './screens/MyOrders'
import Overview from './screens/Overview'
import PresaleView from './screens/Presale'
import { AppLogicProvider, useAppLogic } from './app-logic'
import miniMeTokenAbi from './abi/MiniMeToken.json'
import marketMaker from './abi/BatchedBancorMarketMaker.json'

const isPresale = false

const Presale = () => {
  const [orderPanel, setOrderPanel] = useState(false)

  return (
    <div css="min-width: 320px">
      <Main assetsUrl="./">
        <Fragment>
          <Layout>
            <AppHeader
              heading="Fundraising Presale"
              action={
                <Button mode="strong" label="Buy Presale Tokens" onClick={() => setOrderPanel(true)}>
                  Buy Presale Tokens
                </Button>
              }
            />
            <PresaleView />
          </Layout>
          <PresaleSidePanel price={300.0} opened={orderPanel} onClose={() => setOrderPanel(false)} />
        </Fragment>
      </Main>
    </div>
  )
}

const tabs = ['Overview', 'Orders', 'My Orders', 'Reserve Settings']

const App = () => {
  const { isReady, common, overview, ordersView, reserve } = useAppLogic()

  const [orderPanel, setOrderPanel] = useState(false)
  const [tabIndex, setTabindex] = useState(0)

  const api = useApi()

  const [polledTotalSupply, setPolledTotalSupply] = useState(null)
  const [polledBatchId, setPolledBatchId] = useState(null)

  // polls the bonded token total supply, batchId, price
  useInterval(async () => {
    if (isReady) {
      // totalSupply
      const bondedTokenContract = api.external(common.bondedToken.address, miniMeTokenAbi)
      const totalSupply = await bondedTokenContract.totalSupply().toPromise()
      setPolledTotalSupply(totalSupply)
      // batchId
      const marketMakerContract = api.external(common.addresses.marketMaker, marketMaker)
      const batchId = await marketMakerContract.getCurrentBatchId().toPromise()
      setPolledBatchId(batchId)
    }
  }, 3000)

  const handlePlaceOrder = async (collateralTokenAddress, amount, isBuyOrder) => {
    const intent = { token: { address: collateralTokenAddress, value: amount, spender: common.addresses.marketMaker } }
    // TODO: add error handling on failed tx, check token balances
    if (isBuyOrder) {
      console.log(`its a buy order where token: ${collateralTokenAddress}, amount: ${amount}`)
      api
        .openBuyOrder(collateralTokenAddress, amount, intent)
        .toPromise()
        .catch(console.error)
    } else {
      console.log(`its a sell order where token: ${collateralTokenAddress}, amount: ${amount}`)
      api
        .openSellOrder(collateralTokenAddress, amount)
        .toPromise()
        .catch(console.error)
    }
  }

  const handleClaim = (batchId, collateralTokenAddress, isBuyOrder) => {
    // TODO: add error handling on failed tx, check token balances
    if (isBuyOrder) {
      console.log(`its a buy claim where token: ${collateralTokenAddress}, batchId: ${batchId}`)
      api
        .claimBuyOrder(batchId, collateralTokenAddress)
        .toPromise()
        .catch(console.error)
    } else {
      console.log(`its a sell claim where token: ${collateralTokenAddress}, batchId: ${batchId}`)
      api
        .claimSellOrder(batchId, collateralTokenAddress)
        .toPromise()
        .catch(console.error)
    }
  }

  const handleTappedTokenUpdate = (tapAmount, floor) => {
    api
      .updateTokenTap(common.daiAddress, tapAmount, floor)
      .toPromise()
      .catch(console.error)
  }

  return (
    <div css="min-width: 320px">
      <Main assetsUrl="./">
        <SyncIndicator visible={!isReady} />
        {isReady && common.collateralsAreOk && (
          <Fragment>
            <Layout>
              <AppHeader
                heading="Fundraising"
                action={
                  <Button mode="strong" label="New Order" onClick={() => setOrderPanel(true)}>
                    New Order
                  </Button>
                }
              />
              <Tabs selected={tabIndex} onChange={setTabindex} items={tabs} />
              {tabIndex === 0 && (
                <Overview
                  overview={overview}
                  bondedToken={common.bondedToken}
                  currentBatch={common.currentBatch}
                  polledData={{ polledTotalSupply, polledBatchId }}
                />
              )}
              {tabIndex === 1 && <Orders orders={ordersView} />}
              {tabIndex === 2 && <MyOrders orders={ordersView} account={common.connectedAccount} onClaim={handleClaim} />}
              {tabIndex === 3 && (
                <Reserves
                  bondedToken={common.bondedToken}
                  reserve={{ ...reserve, collateralTokens: common.collateralTokens }}
                  polledData={{ polledTotalSupply }}
                  updateTappedToken={handleTappedTokenUpdate}
                />
              )}
            </Layout>
            <SidePanel opened={orderPanel} onClose={() => setOrderPanel(false)} title="New Order">
              <NewOrder
                opened={orderPanel}
                collaterals={common.collateralTokens}
                bondedToken={common.bondedToken}
                price={overview.startPrice}
                onOrder={handlePlaceOrder}
              />
            </SidePanel>
          </Fragment>
        )}
        {isReady && !common.collateralsAreOk && <h1>Something wrong with the collaterals</h1>}
      </Main>
    </div>
  )
}

export default () => <AppLogicProvider>{isPresale ? <Presale /> : <App />}</AppLogicProvider>
