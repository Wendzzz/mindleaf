import { Eyebrow, Icon, Reveal } from '../ui.jsx'

const FREE = ['Your first reading plan', 'Daily reminders at the time you choose', 'Streaks, grace days and your journal']
const PLUS = ['Every plan in the library', 'Audio for every daily reading', 'Group plans for book clubs', 'Everything in Free']

export default function Pricing() {
  return (
    <section id="pricing" className="section pricing">
      <div className="container">
        <div className="pricing-head">
          <Reveal><Eyebrow>Pricing</Eyebrow></Reveal>
          <Reveal delay={0.05}><h2 className="h2">Start free. <span className="accent-text">Stay for the next book.</span></h2></Reveal>
        </div>
        <div className="plans">
          <Reveal className="plan">
            <span className="plan-name">Starter</span>
            <span className="plan-price">Free <small>forever</small></span>
            <ul>{FREE.map((f) => <li key={f}><Icon.check /> {f}</li>)}</ul>
            <a href="./app/" className="btn btn-ghost">Start Day 1</a>
          </Reveal>
          <Reveal className="plan plan-plus" delay={0.08}>
            <span className="plan-name">Mindleaf Plus</span>
            <span className="plan-price">₦5,000 <small>per month</small></span>
            <ul>{PLUS.map((f) => <li key={f}><Icon.check /> {f}</li>)}</ul>
            <a href="./app/#/paywall" className="btn btn-orange">Get Mindleaf Plus</a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
