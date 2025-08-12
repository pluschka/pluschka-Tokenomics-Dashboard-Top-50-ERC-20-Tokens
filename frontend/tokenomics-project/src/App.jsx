import './App.css'
import { useState, useEffect } from 'react'
import tokenData from './data/erc20_full_data.json'
import TokenClassBar from './components/TokenClassBar'
import IncentiveBar from './components/IncentiveBar'
import PriceAndMarketBar from './components/PriceAndMarketBar'
import TokenRiskAndsecurityBar from './components/RiskAndSecurity'
import VestingAndCliffBar from './components/VestingAndCliff'
import DistributionBar from './components/Distribution'
import GovernanceBar from './components/Governance'
import TotalSupplyChart from './components/TotalSupplyChart';
import CirculatingSupplyChart from './components/CirculatingSupplyChart';
import MaxSupplyChart from './components/MaxSupplyChart';

function App() {
  const [tokens, setTokens] = useState([])

  useEffect(() => {
    setTokens(tokenData)
  }, [])

  return (
    <>
      <div className="scroll-container">
        <div className="wide-content">
          <div className="header">
            <h1>
              <span className="tooltip">
                Tokenomics
                <span className="tooltip-text">
                  Tokenomics is the study and analysis of the economic aspects of a cryptocurrency or blockchain project, with a particular focus on the design and distribution of its native digital tokens.
                </span>
              </span>
            </h1>
            <h2>of Top 50 ERC-20 Tokens</h2>
          </div>

          {/* Roadmap */}
          <div className="roadmap-container">
            <div className="roadmap-horizontal"></div>
            <div className="roadmap-vertical"></div>

            {/* Supply Facts */}
            <div className="roadmap-pointer roadmap-pointer-supply"></div>
            <div className="category-box left supply">
              <h3 className="h_left">Supply Facts</h3>

              <h4 className="h_left">What is the total supply of the top 50 erc-20 tokens?</h4>
                <TotalSupplyChart />

              <h4 className="h_left">What is the maximum supply of the top 50 erc-20 tokens?</h4>
              <MaxSupplyChart />

              <h4 className="h_left">How much supply is currently circulating of the top 50 erc-20 tokens?</h4>
                <CirculatingSupplyChart />

            </div>

            {/* Token Class */}
            <div className="roadmap-pointer roadmap-pointer-class"></div>
              <div className="category-box right class">
                <h3 className="h_right">Token Class</h3>
                <h5 className="h_right">Utility Token provide access to a product or service within a specific blockchain ecosystem. Payment Token serve primarily as a medium of exchange for goods and services, like digital currency. Investment Token represent an asset or profit share, often regulated as a security or investment vehicle.</h5>
                <TokenClassBar tokens={tokens} />
              </div>

            {/* Incentive */}
            <div className="roadmap-pointer roadmap-pointer-incentive"></div>
              <div className="category-box right incentive">
                <h3 className="h_right">Incentive mechanism</h3>
                <h5 className="h_right">An incentive mechanism is a structured system of rewards and penalties used in blockchain and token economies to influence participant behavior, encourage desired actions, deter harmful activities, and ensure alignment between individual incentives and the overall network’s goals and sustainability.</h5>
                  <IncentiveBar tokens={tokens} />
              </div>

            {/* Price and Market */}
            <div className="roadmap-pointer roadmap-pointer-price_and_market"></div>
              <div className="category-box right price_and_market">
                <h3 className="h_right">Price and Market Mechanism</h3>
                <h5 className="h_right">A price and market mechanism is the process by which supply and demand interact in a market to determine prices, allocate resources, and guide production, consumption, and investment decisions through signals.</h5>
                  <PriceAndMarketBar tokens={tokens} />
              </div>

            {/* Risk and Security */}
            <div className="roadmap-pointer roadmap-pointer-risk_and_security"></div>
              <div className="category-box right risk_and_security">
                <h3 className="h_right">Risk and Security Mechanism</h3>
                <h5 className="h_right">A risk and security mechanism for tokens refers to the safeguards, policies, and technical measures implemented to protect a blockchain project’s assets, users, and infrastructure from vulnerabilities, attacks, and operational failures, ensuring trust, stability, and regulatory compliance.</h5>
                  <TokenRiskAndsecurityBar tokens={tokens} />
              </div>

            {/* Vetsing and Cliff */}
            <div className="roadmap-pointer roadmap-pointer-vesting_and_cliff"></div>
              <div className="category-box right vesting_and_cliff">
                <h3 className="h_right">Vesting and Cliff</h3>
                <h5 className="h_right">A vesting and cliff schedule defines when and how allocated tokens are released to recipients over time. The cliff is an initial waiting period during which no tokens are released, followed by a vesting phase where tokens are unlocked gradually or in milestones. These mechanisms align incentives, prevent immediate sell-offs, and encourage long-term commitment from team members, investors, and other stakeholders.</h5>
                  <VestingAndCliffBar tokens={tokens} />
              </div>
            {/* Distribution*/}
            <div className="roadmap-pointer roadmap-pointer-distribution"></div>
              <div className="category-box left distribution">
                <h3 className="h_right">Distribution</h3>
                <h5 className="h_right">The process by which a project allocates and delivers its tokens to various stakeholders or the public. Distribution methods can include sales, rewards, incentives, or free allocations, and are designed to fund development, encourage adoption, and align the interests of investors, team members, and the community.</h5>
                  <DistributionBar tokens={tokens} />
              </div>
            {/* Governance*/}
            <div className="roadmap-pointer roadmap-pointer-governance"></div>
              <div className="category-box right governance">
                <h3 className="h_right">Governance</h3>
                <h5 className="h_right">The systems, rules, and processes through which decisions are made and implemented within a blockchain project or decentralized network. Governance defines how stakeholders propose, debate, and vote on changes to protocols, allocate resources, and set strategic direction, aiming to balance transparency, efficiency, and community participation.</h5>
                  <GovernanceBar tokens={tokens} />
              </div>

            </div>

          </div>
        </div>

    </>
  )
}

export default App

